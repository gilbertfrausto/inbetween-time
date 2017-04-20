/**
    *   @name Inbetween-Time
    *   @version 0.01
    *   @description Inbetween Time. Contructor with and iterator that is call a certain number of times and stops.
    *   @param spec {Object} timer, count, method.
    *   @param timer{number} Time in ms between each Iteration
    *   @param count{number} Max number of iterations
    *   @param method{count} Method to be called durring each iteration
    *   @example
    *
    *    let repeater = () => {
    *        console.log('this needs to run three Times!');
    *    };
    *
    *    let ropes = t_t({
    *        timer: 1000,
    *        count: 4,
    *        method: repeater
    *    });
    *
    *    console.log(ropes.iterator());
*/
"use strict";

var t_t = function t_t(spec) {
    var current = 0;
    var timer = spec.timer,
        count = spec.count,
        method = spec.method;


    var _iterator = function iterator() {
        var _wrapper = function wrapper() {
            if (current < count) {
                method();
                current++;
            } else {
                _iterator = null;
                timeout = null;
                _wrapper = null;
            }

            timeout = setTimeout(_wrapper, timer);
        };
        var timeout = setTimeout(_wrapper, timer);
    };

    return Object.freeze({
        iterator: _iterator
    });
};
