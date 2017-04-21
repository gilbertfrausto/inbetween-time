/**
    *   @name Inbetween-Time
    *   @version 0.01
    *   @description Inbetween Time is Contructor with an iterator method that is called a certain number of times and stops.
    *   @param spec {Object} timer, count, method.
    *   @param timer{number} Time in ms between each Iteration
    *   @param count{number} Max number of iterations
    *   @param method{count} Method to be called durring each iteration
    *   @example
*/
"use strict";
var t_t = (function (spec) {
    var current = 0; //Keeps track of iteration count.
    var timeout;
    var paused = false;
    var timer = spec.timer, count = spec.count, method = spec.method;
    var iterator = function () {
        var wrapper = function () {
            if (!paused && current < count) {
                method();
                console.log('Iterations:', current);
                current++;
            }
            else if (paused) {
                clearTimeout(timeout);
                console.log('Iterations pasued');
            }
            else {
                iterator = undefined;
                timeout = undefined;
                wrapper = undefined;
                console.log('Iterations complete');
            }
            timeout = setTimeout(wrapper, timer);
        };
        timeout = setTimeout(wrapper, timer);
    };
    var resume = function () {
        paused = false;
        iterator();
    };
    var wait = function (yieldTime) {
        paused = true;
        console.log('Iterations paused via wait');
        clearTimeout(timeout);
        setTimeout(function () {
            resume();
        }, yieldTime);
    };
    return Object.freeze({
        iterator: iterator,
        wait: wait
    });
});
