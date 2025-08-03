/**
 * @module Inbetween-Time (Immutable Data-Oriented Version)
 * @description An immutable, data-oriented iterator. Functions return a new state instead of modifying it.
 */
// This function is already pure/immutable
export function createIteratorState(spec) {
    return Object.freeze({
        ...spec,
        current: 0,
        paused: false,
        isCompleted: false,
        lastTime: 0,
    });
}
// --- Pure State Transition Functions ---
export function pause(state) {
    return Object.freeze({ ...state, paused: true });
}
export function resume(state) {
    return Object.freeze({ ...state, paused: false, lastTime: 0 }); // Reset lastTime on resume
}
export function setCount(state, newCount) {
    return Object.freeze({ ...state, count: newCount });
}
export function setTimer(state, newTimer) {
    return Object.freeze({ ...state, timer: newTimer });
}
/**
 * This is the core logic, a pure function that calculates the next state based on the current time.
 * @param state The current state.
 * @param timestamp The current time from requestAnimationFrame.
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
        }
        else {
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
    return {
        dispatch,
        getState: () => currentState,
    };
}
export function wait(runner, yieldTime) {
    runner.dispatch(pause);
    setTimeout(() => {
        runner.dispatch(resume);
    }, yieldTime);
}
/**
 * Linearly interpolates between two numbers.
 * @param a The start value.
 * @param b The end value.
 * @param t The interpolation factor (0.0 to 1.0).
 * @returns The interpolated value.
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
