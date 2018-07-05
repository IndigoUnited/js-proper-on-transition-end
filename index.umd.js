(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.onTransitionEnd = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"longest-transition":2}],2:[function(require,module,exports){
'use strict';

function __readTransitions(el) {
    var styles = getComputedStyle(el);
    var properties = styles.transitionProperty.replace(' ', '').split(',');
    var durations = styles.transitionDuration.replace(' ', '').split(',').map(_parseFloat);
    var delays = styles.transitionDelay.replace(' ', '').split(',').map(_parseFloat);

    return properties.map(function __handleMapProperties(prop, i) {
        return {
            property: prop,
            duration: Math.ceil((durations[i] || durations[0] || 0) * 1000),
            delay: Math.ceil((delays[i] || delays[0] || 0) * 1000),
        };
    });
}

function longestTransition(el) {
    var longest = __readTransitions(el).reduce(function __handleReduceTransitions(prev, curr) {
        if (!prev) {
            return curr;
        }

        return prev.duration + prev.delay >= curr.duration + curr.delay ? prev : curr;
    }, null);

    return longest;
}

function _parseFloat(x) {
    return parseFloat(x, 10);
}

module.exports = longestTransition;

},{}]},{},[1])(1)
});
