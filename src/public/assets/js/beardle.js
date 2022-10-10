class Beardle {
    _container   = document.getElementById('beardle');
    _keyboard    = document.getElementById('keyboard');
    _header      = document.getElementById('header');
    _answer      = document.getElementById('answer');
    _submit      = document.getElementById('submit');
    _skip        = document.getElementById('skip');
    _play        = document.getElementById('play');
    _input       = document.getElementById('input');
    _badStep     = document.querySelector('[data-step="-1"]');
    _timeLength  = document.getElementById('timeLength');
    _timeCurrent = document.getElementById('timeCurrent');
    _playIcon    = document.getElementById('playIcon');

    steps = {
        0: 1.5,
        1: 2.5,
        2: 4.5,
        3: 11.5,
        4: 16.5,
        5: 9999
    };

    checker     = null;
    suggestions = [];
    audio       = {};
    beardle     = '';
    songFile    = '';
    options     = {
        key: '',
        currentStep: 0,
        inputs: [],
        finished: false
    };


    /**
     * Converts an audio timestamp to minutes/seconds
     * @param {float} time
     * @returns {string}
     */
    calcTime = (time) => {
        const totalSecs = Math.ceil(time)
        const hours     = parseInt(totalSecs / 3600);
        const minutes   = parseInt((totalSecs - (hours * 3600)) / 60);
        const seconds   = Math.ceil((totalSecs - ((hours * 3600) + (minutes * 60))));

        return (minutes < 10 ? + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    };


    /**
     * Recalculates the max height of the main container (#beardle)
     */
    calcHeight = () => {
        const height = window.innerHeight;
        const offHeight = Math.abs(this._header.scrollHeight + this._keyboard.scrollHeight) + 30;

        this._container.style.setProperty('max-height', `calc(${height}px) - ${offHeight}px`);
    };


    /**
     * Returns the full path of the sounds path. Appends a string to the end if provided.
     * @param {string} append
     * @returns {string}
     */
    getSoundsLocation = (append) => {
        return location.protocol + '//' + location.host + location.pathname + '/assets/sounds/' + append;
    }


    /**
     * Creates, loads an audio element and sets the audio duration.
     */
    createAudio = () => {
        let _this = this;

        // this.audio      = document.createElement('audio');
        // this.audio.id   = 'song';
        // this.audio.type = 'audio/mpeg';
        // this.audio.src  = _this.getSoundsLocation(_this.songFile);
        // this.audio.load();
        // this.audio.currentTime = 0;

        // this.audio.addEventListener('loadedmetadata', (event) => {
        //     _this._timeLength.innerText = _this.calcTime(_this.audio.duration);
        // });

        _this.audio = WaveSurfer.create({
            container    : document.querySelector('#waveform'),
            waveColor    : 'black',
            progressColor: 'white',
            hideCursor   : true,
            normalize    : true,
            pixelRatio   : 1,
            cursorWidth  : 0,
            interact     : false,
            height: 75,
            barWidth: 3,
        });

        _this.audio.load(_this.getSoundsLocation(_this.songFile));

        _this.audio.on('ready', () => {
            _this._timeLength.innerText = _this.calcTime(_this.audio.getDuration());
            _this._play.disabled = false;
        });
    };


    /**
     * Loads and handles the autocompletion of input
     */
     loadAutoComplete = () => {
        let _this = this;

        new Autocomplete('#input', {
            search: (input) => {
                if (input.length < 1) {
                    return [];
                }

                let result = _this.suggestions.filter(song => {
                    return (song.toLowerCase().indexOf(input.toLowerCase()) == -1 ? false : true);
                });

                return result;
            },

            getResultValue: (result) => {
                const input = _this._answer.value;
                const regex = new RegExp(input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi')
                return result.replace(regex, `<span class="border-b-2 border-warning">$&</span>`);
            },

            onSubmit: (result) => {
                if (typeof result !== 'undefined') {
                    let tmp = document.createElement('div');
                    tmp.innerHTML = result;
                    _this._answer.value    = tmp.textContent || tmp.innerText || '';
                    _this._submit.disabled = false;
                } else {
                    _this._answer.value = '';
                }
            }
        });
    };


    /**
     * Create event listeners
     */
    setEvents = () => {
        let _this = this;

        window.addEventListener('resize', () => {
            _this.calcHeight();
        });

        // Disable submit button if length of answer is lower than 3
        _this._answer.addEventListener('input', (event) => {
            _this._submit.disabled = (_this._answer.value.length < 3);
        });


        // Handle play button
        _this._play.addEventListener('click', (event) => {
            if (!_this.audio.isPlaying()) {
                _this._playIcon.classList.add('animate-spin');
                _this.audio.play();
                return;
            }

            _this.audio.stop();
        });


        // Handle current playing time and limits
        _this.audio.on('audioprocess', (event) => {
            const currentLimit = _this.steps[_this.options.currentStep];

            if (_this.audio.getCurrentTime() > currentLimit) {
                _this.audio.stop();
            }

            _this._timeCurrent.innerText = _this.calcTime(_this.audio.getCurrentTime());
        });


        // Handle audio pause event
        _this.audio.on('pause', (event) => {
            clearInterval(_this.checker);
            _this.checker = null;

            _this._playIcon.classList.remove('animate-spin');
        });


        _this._skip.addEventListener('click', (event) => {
            event.preventDefault();
            _this.skip();
        });

        _this._submit.addEventListener('click', (event) => {
            event.preventDefault();
            _this.submit();
        });
    };


    /**
     * Return an object with the step and guide
     * @param {integer} num
     * @returns
     */
    getSteps = (num) => {
        return {
            step: document.querySelector(`[data-step="${num}"]`),
            guide: document.querySelector(`[data-step-guide="${num}"]`)
        };
    };


    /**
     * Skips the current step
     */
    skip = () => {
        let _this         = this;
        const currentStep = _this.options.currentStep;
        let steps         = _this.getSteps(currentStep);

        _this._container.setAttribute('data-current', currentStep + 1);

        _this._answer.value    = '';
        _this._submit.disabled = true;
        steps.step.innerText   = 'Skipped';

        steps.guide.classList.add('bg-warning');
        steps.step.classList.add('border-warning');

        _this.options.inputs.push('');
        _this.options.currentStep = (currentStep >= 5 ? 5 : currentStep + 1);

        if (currentStep >= 4) {
            _this.lose();
        }
    };


    /**
     * Submits an answer. If preDefined is empty will use the current answer input
     * @param {string} preDefined
     * @returns {undefined}
     */
    submit = (preDefined) => {
        let _this = this;

        const answer      = (preDefined ? preDefined : _this._answer.value);
        const currentStep = _this.options.currentStep;
        let step          = _this.getSteps(currentStep);

        _this._container.setAttribute('data-current', currentStep + 1);
        _this._answer.value    = '';
        _this._submit.disabled = true;
        step.step.innerText    = answer;

        if (answer.toLowerCase() !== _this.beardle.toLowerCase()) {
            step.guide.classList.add('bg-error');
            step.step.classList.add('border-error');

            _this.options.currentStep = (currentStep >= 5 ? 5 : currentStep + 1);
            _this.options.inputs.push(answer);

            if (currentStep >= 4) {
                _this.lose();
            }

            return;
        }

        step.step.classList.add('border-success');
        _this.win();
    };


    /**
     * Set the current state to lost and shows the answer
     */
    lose = () => {
        let _this = this;

        _this._skip.disabled   = true;
        _this._submit.disabled = true;
        _this._answer.disabled = true;
        _this._badStep.classList.remove('hidden', 'border-success');
        _this._badStep.classList.add('border-error');
        _this._badStep.innerText  = _this.beardle;
        _this.options.currentStep = 5;
        _this.options.finished    = true;
    };


    /**
     * Set the current state to won
     */
    win = () => {
        let _this = this;

        document.querySelectorAll('#beardle .border-light').forEach((element) => {
            element.classList.add('border-success');
        });

        _this._skip.disabled   = true;
        _this._submit.disabled = true;
        _this._answer.disabled = true;
        _this._badStep.classList.add('hidden');
        _this.options.currentStep = 5;
        _this.options.finished    = true;
    };


    /**
     * Loads the game
     * @param {object} options
     */
    load = (options) => {
        let _this = this;

        console.log(options);

        _this.beardle = options.song;
        _this.songFile = options.file;
        _this.suggestions = options.suggestions;

        _this.createAudio();
        _this.loadAutoComplete();
        _this.setEvents();
        _this.calcHeight();
    };
}
