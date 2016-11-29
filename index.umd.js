(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.onTransitionEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});