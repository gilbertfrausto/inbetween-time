"use strict";

/**
 * @name Inbetween-Time
 * @param {Object} spec
 * @description Inbetween Time is iterator, similar to coroutine
 * @deprecated
 */
export function inBetweenTime(spec) {
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
    };
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
  function getIterations() {
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
    getIterations,
    setCount,
    completed,
    pause,
    resume,
  });
}

/**
 * @module Inbetween-Time (Immutable Data-Oriented Version)
 * @description An immutable, data-oriented iterator. Functions return a new state instead of modifying it.
 */

/**
 * Create a state object to be passed to the runner
 * @param {Object} spec 
 * @returns {ReadOnly<Object>} 
 */
export function createIteratorState(spec) {
  return Object.freeze({
    ...spec,
    current: 0,
    paused: false,
    isCompleted: false,
    lastTime: 0,
  });
}

/**
 * Pause the iterations indefinitely
 * @param {Object} state
 * @returns {ReadOnly<Object>} 
 */
export function pause(state) {
  return Object.freeze({ ...state, paused: true });
}

/**
 * Resume iterations
 * @param {Object} state 
 * @returns {ReadOnly<Object>} 
 */
export function resume(state) {
  return Object.freeze({ ...state, paused: false, lastTime: 0 }); // Reset lastTime on resume
}

/**
 * Set the count of iterations to happen
 * @param {Object} state
 * @param {number} newCount: the new count of iterations set to happen
 * @returns
 */
export function setCount(state, newCount) {
  return Object.freeze({ ...state, count: newCount });
}

/**
 * Set timer, this is the amount of time between each iteration in milliseconds 
 * @param {Object} state 
 * @param {number} newTimer 
 * @returns 
 */
export function setTimer(state, newTimer) {
  return Object.freeze({ ...state, timer: newTimer });
}
/**
 * This is the core logic, a pure function that calculates the next state based on the current time.
 * @param {Object} The current state.
 * @param {number} timestamp The current time from requestAnimationFrame.
 * @returns The new state.
 */
export function tick(state, timestamp) {
  if (state.paused || state.isCompleted) {
    return state; // No change
  }
  // If this is the first tick, just record the start time and return a new state.
  if (state.lastTime === 0) {
    return Object.freeze({ ...state, lastTime: timestamp });
  }
  const elapsed = timestamp - state.lastTime;
  if (elapsed >= state.timer) {
    state.method(); // Note: This is still a side effect, but it's the designated one.
    const newCurrent = state.current + 1;
    const isCompleted = newCurrent >= state.count;
    if (isCompleted && state.onComplete) {
      state.onComplete();
    }
    return Object.freeze({
      ...state,
      current: newCurrent,
      lastTime: timestamp,
      isCompleted: isCompleted,
    });
  }
  return state; // No change if timer hasn't elapsed
}

/**
 * This will create a new runner or iterator
 * @param {Object} initialState
 * @param {() =>} onStateChange
 * @returns
 */
export function createRunner(initialState, onStateChange) {
  let currentState = initialState;
  let requestId;
  const loop = (timestamp) => {
    const newState = tick(currentState, timestamp);
    if (newState !== currentState) {
      currentState = newState;
      if (onStateChange) {
        onStateChange(currentState);
      }
    }
    if (!currentState.isCompleted && !currentState.paused) {
      requestId = requestAnimationFrame(loop);
    } else {
      requestId = undefined;
    }
  };
  const dispatch = (transition) => {
    const oldState = currentState;
    currentState = transition(oldState);
    if (onStateChange) {
      onStateChange(currentState);
    }
    // If the iterator was paused and is now resumed, restart the loop.
    if (oldState.paused && !currentState.paused) {
      requestId = requestAnimationFrame(loop);
    }
    // If the iterator was running and is now paused, cancel the loop.
    else if (!oldState.paused && currentState.paused && requestId) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  };
  // Start the loop initially if not paused
  if (!currentState.paused) {
    requestId = requestAnimationFrame(loop);
  }
  return Object.freeze({
    dispatch,
    getState: () => currentState,
  });
}

/**
 * This will pause all iterations for a certain amout of time
 * @param {ReadOnly<Object>} runner
 * @param {number} yieldTime
 */
export function wait(runner, yieldTime) {
  runner.dispatch(pause);
  setTimeout(() => {
    runner.dispatch(resume);
  }, yieldTime);
}

export default Object.freeze({
  inBetweenTime,
  wait,
  setTimer,
  pause,
  resume,
  setCount,
  createRunner,
  createIteratorState
});
