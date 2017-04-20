/**
    *   @name Inbetween-Time
    *   @version 0.01
    *   @description Inbetween Time is Contructor with an iterator method that is called a certain number of times and stops.
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

const t_t = ((spec) => {
    let current = 0; //Keeps track of iteration count.
    let {timer, count, method} = spec;

    let iterator = () => {
        let wrapper = () => {
            if(current < count){
                method();
                current++;
            } else{
                iterator    = null;
                timeout     = null;
                wrapper     = null;
            }

            console.log(timer, current);
            timeout = setTimeout(wrapper, timer);
        }
        let timeout = setTimeout(wrapper, timer);
    };

    return Object.freeze({
        iterator
    });
});
