/**
*   @name Inbetween-Time
*   @version 1.0.1
*   @description Inbetween Time is Contructor with an iterator method that is called a certain number of times and stops.
*   @param  {Object} spectake four properties
*   @property {Number} timer Time in ms between each Iteration
*   @property {Number} count Max number of iterations
*   @property {Function} method Method to be called during each iteration
* 	@return {Object}
*   @property {Function} iterator will call the spec.method property @return {void}
*   @property {Function} wait take one argument and this is the amount of time the iterator will be stopped in milliseconds @return {void}
*   @property {Function} getCount get the count of iteration set to happen @return {number}
*   @property {Function} setCount change the amount of iterations set to happen @return {void}
*   @property {Function} getInterations get the iterations number @return {number}
*   @param  {Number} yieldTime  amount of time iterator will yield.
*
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
                // console.log('Iterations:', current);
                current++;
            } else if (paused) {
            	clearTimeout(timeout);
            	// console.log('Iterations paused');
            } else {
                iterator    = undefined;
                timeout     = undefined;
                wrapper     = undefined;
                
                // console.log('Iterations complete');
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
        // console.log('Iterations paused via wait');
        clearTimeout(timeout);
        setTimeout(() => {
            resume();
        }, yieldTime);
    },
    getCount = () => {
        return count;
    },
    getInterations = () => {
        return current;
    },
    setCount = (changed) => {
        count = changed;
    };

    return Object.freeze({
        iterator,
        wait,
        getCount,
        getInterations,
        setCount
    });
});
