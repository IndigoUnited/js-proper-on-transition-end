'use strict';

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

module.exports = function (element, expectedDuration, callback) {
    var gracePeriod;
    var timeOutTimer;

    // browser does not support transitionend, no animation
    if (!transitionend) {
        setTimeout(callback, 0);

        return;
    }

    // define the duration and grace period
    if (typeof expectedDuration === 'object') {
        gracePeriod = expectedDuration.gracePeriod;
        expectedDuration = expectedDuration.duration;
    } else {
        gracePeriod = defaultEventFailureGracePeriod;
    }

    element.addEventListener(transitionend, __handleTransitionEnd);

    timeOutTimer = setTimeout(__handleTransitionEnd, expectedDuration + gracePeriod);

    function __handleTransitionEnd(e) {
        // if event timed out or it it is on target
        if (!e || e.target === element) {
            // clear the timer if it's still running
            clearTimeout(timeOutTimer);

            element.removeEventListener(transitionend, __handleTransitionEnd);

            if (callback) {
                callback();
            }
        }
    }
};
