'use strict';

/**
 * @name Inbetween-Time
 * @param {Object} spec 
 * @version 1.0.8
 * @description Inbetween Time is iterator, similar to coroutine
 */
function inBetweenTime(spec) {

  let request_id;
  let current = 0; // Keeps track of iteration count.
  let paused = false;
  let isCompleted = false;
  let { timer, count, method, onComplete } = spec;
  let lastTime = 0;

  /**
   * @returns {void}
   */
  let iterator = () => {
    let wrapper = (timestamp) => {
      if (paused) {
        return;
      }

      if (!lastTime) {
        lastTime = timestamp;
      }
      const elapsed = timestamp - lastTime;

      if (current < count) {
        if (elapsed >= timer) {
          method();
          current++;
          lastTime = timestamp;
        }
        request_id = requestAnimationFrame(wrapper);
      } else {
        isCompleted = true;
        onComplete && onComplete();
        iterator = undefined;
        request_id = undefined;
        wrapper = undefined;
      }
    }
    request_id = requestAnimationFrame(wrapper);
  };

  /**
   * @returns {void}
   */
  function resume() {
    paused = false;
    iterator();
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
    cancelAnimationFrame(request_id);
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

  /**
   * @returns {boolean}
   */
  function completed() {
    return isCompleted;
  }

  /**
   * @returns {void}
   */
  function pause() {
    paused = true;
    cancelAnimationFrame(request_id);
  }

  return Object.freeze({
    iterator,
    wait,
    getCount,
    getInterations,
    setCount,
    completed,
    pause,
    resume
  });
}

export default inBetweenTime;
