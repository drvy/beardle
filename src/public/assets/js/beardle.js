class Beardle {
    _container   = document.getElementById('beardle');
    _keyboard    = document.getElementById('keyboard');
    _header      = document.getElementById('header');
    _answer      = document.getElementById('answer');
    _submit      = document.getElementById('submit');
    _skip        = document.getElementById('skip');
    _control     = document.getElementById('control');
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

        this.audio      = document.createElement('audio');
        this.audio.id   = 'song';
        this.audio.type = 'audio/mpeg';
        this.audio.src  = _this.getSoundsLocation(_this.songFile);
        this.audio.load();
        this.audio.currentTime = 0;

        this.audio.addEventListener('loadedmetadata', (event) => {
            _this._timeLength.innerText = _this.calcTime(_this.audio.duration);
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
        _this._control.addEventListener('click', (event) => {
            if (_this.audio.paused) {
                _this.audio.play();
                return;
            }

            _this.audio.pause();
            _this.audio.currentTime = 0;
        });


        // Handle current playing time and limits
        _this.audio.addEventListener('playing', (event) => {
            _this.checker = setInterval(() => {
                const currentLimit = _this.steps[_this.options.currentStep];

                if (_this.audio.currentTime > currentLimit) {
                    _this.audio.pause();
                    _this.audio.currentTime = 0;
                }

                _this._timeCurrent.innerText = _this.calcTime(_this.audio.currentTime);
            }, 50);

            _this._playIcon.classList.add('animate-spin');
        });


        // Handle audio pause event
        _this.audio.addEventListener('pause', (event) => {
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
     *
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
     *
     * @param {*} preDefined
     * @returns
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
     *
     */
    lose = () => {
        let _this = this;

        _this._input.classList.add('hidden');
        _this._badStep.classList.remove('hidden', 'border-success');
        _this._badStep.classList.add('border-error');
        _this._badStep.innerText  = _this.beardle;
        _this.options.currentStep = 5;
        _this.options.finished    = true;
    };


    /**
     *
     */
    win = () => {
        let _this = this;

        document.querySelectorAll('#beardle .border-light').forEach((element) => {
            element.classList.add('border-success');
        });

        _this._input.classList.add('hidden');
        _this._badStep.classList.add('hidden');
        _this.options.currentStep = 5;
        _this.options.finished    = true;
    };


    load = (options) => {
        let _this = this;

        console.log(options);

        _this.beardle = options.song;
        _this.songFile = options.file;

        _this.createAudio();
        _this.setEvents();
        _this.calcHeight();
    };
}
