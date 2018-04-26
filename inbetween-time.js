/**
*   @name Inbetween-Time
*   @version 0.01
*   @description Inbetween Time is Contructor with an iterator method that is called a certain number of times and stops.
*   @param spec {Object} timer, count, method.
*   @param timer{number} Time in ms between each Iteration
*   @param count{number} Max number of iterations
*   @param method{func} Method to be called durring each iteration
*   @example
*/

"use strict";

const t_t = ((spec) => {
    
	let timeout;
	let current = 0; //Keeps track of iteration count.
    let paused	= false;
	let { timer, count, method } = spec,
	
    iterator = () => {
        let wrapper = () => {
            if(!paused && current < count){
                method();
                console.log('Iterations:', current);
                current++;
            } else if (paused) {
            	clearTimeout(timeout);
            	console.log('Iterations pasued');
            } else {
                iterator    = undefined;
                timeout     = undefined;
                wrapper     = undefined;
                console.log('Iterations complete');
            }
            timeout = setTimeout(wrapper, timer);
        }
        timeout = setTimeout(wrapper, timer);
	};
	
    const resume = () => {
        paused = false;
        iterator();
    },
    wait = (yieldTime) => {
    	paused = true;
        console.log('Iterations paused via wait');
        clearTimeout(timeout);
        setTimeout(() => {
            resume();
        }, yieldTime);
    };


    return Object.freeze({
        iterator,
        wait
    });
});
