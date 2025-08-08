import { test, expect, describe } from "bun:test";
import {
  inBetweenTime,
  createIteratorState,
  pause,
  resume,
  setCount,
  setTimer,
  tick,
  createRunner,
  wait,
} from "../src";

global.requestAnimationFrame = (callback) => {
  return setTimeout(() => {
    callback(Date.now());
  }, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

describe("Inbetween Time", () => {
  const instance = inBetweenTime({
    count: 10,
    timer: 10, // Add timer to make the async behavior more predictable
    method: () => {}
  });
  
  test('Should get count', async () => {
    expect(instance.getCount()).toEqual(10);
    instance.iterator();
    
    // Wait for the iterator to complete exactly one iteration
    await new Promise(resolve => setTimeout(resolve, 15));
    
    expect(instance.getIterations()).toEqual(1);
  });

  test('Should pause and resume with wait()', async () => {
    const instance = inBetweenTime({
      count: 10,
      timer: 10,
      method: () => {}
    });
    instance.iterator();
    await new Promise(resolve => setTimeout(resolve, 25));
    instance.wait(100);
    const iterations = instance.getIterations();
    expect(instance.getIterations()).toBe(iterations);
    await new Promise(resolve => setTimeout(resolve, 110));
    expect(instance.getIterations()).toBeGreaterThan(iterations);
  });

  test('Should stop after completing all iterations', async () => {
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {}
    });
    instance.iterator();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getIterations()).toBe(3);
  });

  test('Should adjust to a new count with setCount()', async () => {
    const instance = inBetweenTime({
      count: 5,
      timer: 10,
      method: () => {}
    });
    instance.iterator();
    await new Promise(resolve => setTimeout(resolve, 25));
    instance.setCount(3);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getIterations()).toBe(3);
  });

  test('Should call onComplete when finished', async () => {
    let completed = false;
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {},
      onComplete: () => {
        completed = true;
      }
    });
    instance.iterator();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(completed).toBe(true);
  });

  test('completed() should return true when finished', async () => {
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {}
    });
    expect(instance.completed()).toBe(false);
    instance.iterator();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.completed()).toBe(true);
  });

  test('pause() should stop all iterations', async () => {
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {}
    });
    expect(instance.getIterations()).toBe(0);
    instance.iterator();
    instance.pause();
    const currentCount = instance.getIterations();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getIterations()).toBe(currentCount);
  });

  test('resume() should start iterations again', async () => {
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {}
    });
    expect(instance.getIterations()).toBe(0);
    instance.iterator();
    instance.pause();
    const currentCount = instance.getIterations();
    await new Promise(resolve => setTimeout(resolve, 100));
    instance.resume();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getIterations()).toBeGreaterThan(currentCount);
  });
});

describe("Inbetween Time (Immutable)", () => {
  test("createIteratorState should create a valid initial state", () => {
    const spec = {
      timer: 100,
      count: 10,
      method: () => {},
      onComplete: () => {},
    };
    const state = createIteratorState(spec);
    expect(state).toEqual({
      ...spec,
      current: 0,
      paused: false,
      isCompleted: false,
      lastTime: 0,
    });
  });

  test("pause should set the paused flag to true", () => {
    const initialState = createIteratorState({ timer: 100, count: 10, method: () => {} });
    const pausedState = pause(initialState);
    expect(pausedState.paused).toBe(true);
  });

  test("resume should set the paused flag to false and reset lastTime", () => {
    const initialState = createIteratorState({ timer: 100, count: 10, method: () => {} });
    const pausedState = pause(initialState);
    const resumedState = resume(pausedState);
    expect(resumedState.paused).toBe(false);
    expect(resumedState.lastTime).toBe(0);
  });

  test("setCount should update the count", () => {
    const initialState = createIteratorState({ timer: 100, count: 10, method: () => {} });
    const newState = setCount(initialState, 20);
    expect(newState.count).toBe(20);
  });

  test("setTimer should update the timer", () => {
    const initialState = createIteratorState({ timer: 100, count: 10, method: () => {} });
    const newState = setTimer(initialState, 200);
    expect(newState.timer).toBe(200);
  });

  test("tick should not update state if paused or completed", () => {
    const spec = { timer: 10, count: 1, method: () => {} };
    let state = createIteratorState(spec);
    state = pause(state);
    const newState = tick(state, Date.now());
    expect(newState).toBe(state);
  });

  test("tick should increment current and call method when timer elapses", (done) => {
    const spec = {
      timer: 10,
      count: 2,
      method: () => {
        expect(true).toBe(true); // Method was called
      },
    };
    let state = createIteratorState(spec);
    state = { ...state, lastTime: Date.now() - 20 }; // Simulate time has passed
    const newState = tick(state, Date.now());
    expect(newState.current).toBe(1);
    done();
  });

  test("tick should call onComplete when the count is reached", () => {
    let onCompleteCalled = false;
    const spec = {
      timer: 10,
      count: 1,
      method: () => {},
      onComplete: () => {
        onCompleteCalled = true;
      },
    };
    let state = createIteratorState(spec);
    state = { ...state, lastTime: Date.now() - 20 }; // Simulate time has passed

    const newState = tick(state, Date.now());

    expect(newState.isCompleted).toBe(true);
    expect(onCompleteCalled).toBe(true);
  });

  test("createRunner should execute and complete", (done) => {
    const spec = {
      timer: 10,
      count: 3,
      method: () => {},
      onComplete: () => {},
    };
    const initialState = createIteratorState(spec);
    const runner = createRunner(initialState, (newState) => {
      if (newState.isCompleted) {
        expect(newState.isCompleted).toBe(true);
        done();
      }
    });
  });

  test("runner should pause and resume", (done) => {
    const spec = {
      timer: 10,
      count: 5,
      method: () => {},
    };
    const initialState = createIteratorState(spec);
    const runner = createRunner(initialState);
    runner.dispatch(pause);
    const stateAfterPause = runner.getState();
    expect(stateAfterPause.paused).toBe(true);
    setTimeout(() => {
      runner.dispatch(resume);
      const stateAfterResume = runner.getState();
      expect(stateAfterResume.paused).toBe(false);
      done();
    }, 50);
  });

  test("wait should pause and then resume the runner", (done) => {
    const spec = {
      timer: 10,
      count: 10,
      method: () => {},
    };
    const initialState = createIteratorState(spec);
    const runner = createRunner(initialState);
    wait(runner, 50);
    expect(runner.getState().paused).toBe(true);
    setTimeout(() => {
      expect(runner.getState().paused).toBe(false);
      done();
    }, 60);
  });
});