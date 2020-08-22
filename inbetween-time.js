'use strict';

/**
 * @name Inbetween-Time
 * @param {Object} spec 
 * @version 1.0.8
 * @description Inbetween Time is iterator, similar to coroutine
 */
function t_t(spec) {

  let timeout;
  let current = 0; // Keeps track of iteration count.
  let paused = false;
  let { timer, count, method } = spec,

  /**
   * @returns {void}
   */
  iterator = () => {
    let wrapper = () => {
      if (!paused && current < count) {
        method();
        current++;
      } else if (paused) {
        clearTimeout(timeout);
      } else {
        iterator = undefined;
        timeout = undefined;
        wrapper = undefined;
      }
      timeout = setTimeout(wrapper, timer);
    }
    timeout = setTimeout(wrapper, timer);
  };

  /**
   * @returns {void}
   */
  function resume() {
    paused = false;
    iterator();
  }

  /**
   * 
   * @param {number} yieldTime 
   */
  function wait(yieldTime) {
    paused = true;

    clearTimeout(timeout);
    setTimeout(() => {
        resume();
    }, yieldTime);
  }

  /**
   * @returns {number}
   */
  function getCount() {
    return count;
  }

  /**
   * @param {number} yieldTime 
   * @returns {void}
   */
  function wait(yieldTime) {
    paused = true;
    clearTimeout(timeout);
    setTimeout(() => {
      resume();
    }, yieldTime);
  }

  /**
   * @returns {number}
   */
  function getInterations() {
    return current;
  }

  /**
   * @param {number} changed 
   * @returns {void}
   */
  function setCount(changed) {
    count = changed;
  }

  return Object.freeze({
    iterator,
    wait,
    getCount,
    getInterations,
    setCount
  });

}
