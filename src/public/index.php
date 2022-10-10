<!DOCTYPE html>
<html lang="en" data-theme="synthwave" class="synthwave">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beardle</title>

    <link rel="stylesheet" href="assets/css/beardle.build.css">
</head>
<body>
    <div class="wrap">
        <header id="header" class="p-2 mb-6">
            <div class="flex justify-center align-center">
                <h2 class="font-bold uppercase">Beardle</h2>
                <div class="ml-2 btn btn-xs whitespace-pre cursor-default animate-pulse">Tipsy!</div>
            </div>
        </header>

        <main id="beardle" class="p-2" data-current="0">
            <div data-step="0" class="w-full text-sm border border-light rounded p-2 mb-2">
                &nbsp;
            </div>

            <div data-step="1" class="w-full text-sm border border-light rounded p-2 mb-2">
                &nbsp;
            </div>

            <div data-step="2" class="w-full text-sm border border-light rounded p-2 mb-2">
                &nbsp;
            </div>

            <div data-step="3" class="w-full text-sm border border-light rounded p-2 mb-2">
                &nbsp;
            </div>

            <div data-step="4" class="w-full text-sm border border-light rounded p-2 mb-2">
                &nbsp;
            </div>

            <div data-step="-1" class="w-full text-sm border border-success rounded p-2 mb-2 skip-step hidden">
                &nbsp;
            </div>
        </main>

        <aside id="keyboard" class="flex flex-col w-full border-t border-base-300 bg-neutral/50">
            <div id="progress" class="flex w-full p-2">
                <div data-step-guide="0" class="flex-none border border-white/50 h-4">
                    &nbsp;
                </div>

                <div data-step-guide="1" class="flex-none border border-white/50 h-4">
                    &nbsp;
                </div>

                <div data-step-guide="2" class="flex-none border border-white/50 h-4">
                    &nbsp;
                </div>

                <div data-step-guide="3" class="flex-none border border-white/50 h-4">
                    &nbsp;
                </div>

                <div data-step-guide="4" class="flex-none border border-white/50 h-4">
                    &nbsp;
                </div>
            </div>

            <div id="controls" class="flex justify-between items-center px-5 m-2 w-full">
                <div id="timeCurrent">0:00</div>

                <div id="control">
                    <button id="play" class="btn rounded-full border border-white/75">
                        <svg id="playIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-9 h-9"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
                    </button>
                </div>

                <div id="timeLength">0:00</div>
            </div>

            <div id="input" class="mt-2 p-2 w-full">
                <div class="relative">
                    <ul class="autocomplete-result-list"></ul>
                </div>

                <input
                    id="answer"
                    class="input input-bordered w-full autocomplete-input bg-neutral/50"
                    type="text"
                    placeholder="What song is it?"
                    spellcheck="false"
                    autocorrect="off"
                    autocomplete="off"
                >

                <div class="mt-5 w-full flex justify-between py-1">
                    <button id="skip" class="btn btn-sm btn-warning">Skip</button>
                    <button id="submit" class="btn btn-sm btn-success">Submit</button>
                </div>
            </div>
        </aside>
    </div>

    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>

    <script src="assets/js/vendor/autocomplete.min.js"></script>
    <script src="assets/js/beardle.js"></script>
    <script src="assets/js/load.js"></script>
</body>
</html>
