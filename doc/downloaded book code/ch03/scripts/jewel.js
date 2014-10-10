var jewel = (function() {

    var scriptQueue = [],
        numResourcesLoaded = 0,
        numResources = 0,
        executeRunning = false;

    function executeScriptQueue() {
        var next = scriptQueue[0],
            first, script;
        if (next && next.loaded) {
            executeRunning = true;
            // remove the first element in the queue
            scriptQueue.shift();
            first = document.getElementsByTagName("script")[0];
            script = document.createElement("script");
            script.onload = function() {
                if (next.callback) {
                    next.callback();
                }
                // try to execute more scripts
                executeScriptQueue();
            };
            script.src = next.src;
            first.parentNode.insertBefore(script, first);
        } else {
            executeRunning = false;
        }
    }


    function load(src, callback) {
        var image, queueEntry;
        numResources++;

        // add this resource to the execution queue
        queueEntry = {
            src: src,
            callback: callback,
            loaded: false
        };
        scriptQueue.push(queueEntry);

        image = new Image();
        image.onload = image.onerror = function() {
            numResourcesLoaded++;
            queueEntry.loaded = true;
            if (!executeRunning) {
                executeScriptQueue();
            }
        };
        image.src = src;
    }
    
    // hide the active screen (if any) and show the screen
    // with the specified id
    function showScreen(screenId) {
        var dom = jewel.dom,
            $ = dom.$,
            activeScreen = $("#game .screen.active")[0],
            screen = $("#" + screenId)[0];
        if (!jewel.screens[screenId]) {
            alert("This module is not implemented yet!");
            return;
        }
        if (activeScreen) {
            dom.removeClass(activeScreen, "active");
        }
        dom.addClass(screen, "active");
        // run the screen module
        jewel.screens[screenId].run();
    }

    function isStandalone() {
        return (window.navigator.standalone !== false);
    }

    function setup() {
        // hide the address bar on Android devices
        if (/Android/.test(navigator.userAgent)) {
            jewel.dom.$("html")[0].style.height = "200%";
            setTimeout(function() {
                window.scrollTo(0, 1);
            }, 0);
        }

        // disable native touchmove behavior to 
        // prevent overscroll
        jewel.dom.bind(document, "touchmove", function(event) {
            event.preventDefault();
        });

        if (isStandalone()) {
            showScreen("splash-screen");
        } else {
            showScreen("install-screen");
        }
    }

    return {
        isStandalone: isStandalone,
        load: load,
        setup: setup,
        showScreen : showScreen,
        screens: {}
    };
})();