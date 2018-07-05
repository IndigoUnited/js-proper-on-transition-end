'use strict';

var longestTransition = require('longest-transition');

var defaultEventFailureGracePeriod = 100;

// transitionend below based on https://github.com/kubens/transition-utility
var transitionend = (function () {
    var transition;
    var element = document.createElement('fakeelement');
    var transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd',
    };

    // look for supported transition
    for (transition in transitions) {
        if (element.style[transition] !== undefined) {
            return transitions[transition];
        }
    }

    // transition is unsupported
    return false;
})();

module.exports = function (element, options, callback) {
    var timeout;
    var gracePeriod;
    var timeoutTimer;
    var longest;

    // browser does not support transitionend, no animation
    if (!transitionend) {
        setTimeout(callback, 0);

        return function () {};
    }

    // handle default parameters
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    // if no timeout provided, infer it
    if (!options.timeout) {
        longest = longestTransition(element);

        if (!longest) {
            setTimeout(callback, 0);

            return function () {};
        }
    }

    timeout = options.timeout || (longest.duration + longest.delay);
    gracePeriod = options.gracePeriod || defaultEventFailureGracePeriod;

    element.addEventListener(transitionend, __handleTransitionEnd);

    timeoutTimer = setTimeout(__handleTransitionEnd, timeout + gracePeriod);

    function __handleTransitionEnd(e) {
        // if event timed out or it is on target (respecting the longest transitioning property if necessary)
        if (!e || (e.target === element && (!longest || longest.property === e.propertyName))) {
            __cleanup();

            if (callback) {
                callback();
            }
        }
    }

    function __cleanup() {
        clearTimeout(timeoutTimer);
        element.removeEventListener(transitionend, __handleTransitionEnd);
    }

    return __cleanup;
};
