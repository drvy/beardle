class Beardle {
    _container   = document.getElementById('beardle');
    _keyboard    = document.getElementById('keyboard');
    _header      = document.getElementById('header');
    _answer      = document.getElementById('answer');
    _submit      = document.getElementById('submit');
    _skip        = document.getElementById('skip');
    _control     = document.getElementById('control');
    _badStep     = document.querySelector('[data-step="-1"]');
    _timeLength  = document.getElementById('timeLength');
    _timeCurrent = document.getElementById('timeCurrent');
    _playIcon    = document.getElementById('playIcon');

    steps = {
        0: 0.5,
        1: 1.5,
        2: 3.5,
        4: 10.5,
        5: 15.5,
        6: 9999
    };

    checker     = null;
    suggestions = [];
    audio       = {};
    beardle     = '';
    songFile    = '';
    options     = {
        key: '',
        currentStep: 0,
        inputs: []
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
            _timeLength.innerText = _this.calcTime(_this.audio.duration);
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
            _this._submit.disabled = (this.value.length < 3);
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
    };


    /**
     * Return an object with the step and guide
     * @param {*} num
     * @returns
     */
    getSteps = (num) => {
        return {
            step: document.querySelector(`[data-step="${num}]"`),
            guide: document.querySelector(`[data-step-guide="${num}"]`)
        };
    };
}
