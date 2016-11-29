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
        if (transitions.hasOwnProperty(transition)) {
            if (element.style[transition] !== undefined) {
                return transitions[transition];
            }
        }
    }

    // transition is unsupported
    return false;
})();

module.exports = function (element, expectedDuration, callback, eventFailureGracePeriod) {
    var gracePeriod;
    var done;
    var forceEnd;

    // browser does not support transitionend, no animation
    if (!transitionend) {
        setTimeout(function () {
            callback();
        }, 0);

        return;
    }

    gracePeriod = eventFailureGracePeriod !== undefined ? eventFailureGracePeriod : defaultEventFailureGracePeriod;
    done = false;
    forceEnd = false;

    element.addEventListener(transitionend, onTransitionEnd);

    setTimeout(function () {
        if (!done) {
            // forcing onTransitionEnd callback...
            forceEnd = true;
            onTransitionEnd();
        }
    }, expectedDuration + gracePeriod);

    function onTransitionEnd(e) {
        if (forceEnd || e.target === element) {
            done = true;
            element.removeEventListener(transitionend, onTransitionEnd);

            if (callback) {
                callback(e);
            }
        }
    }
};
