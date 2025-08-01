import { test, expect, describe } from "bun:test";
import inBetweenTime from "../src";

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
    
    expect(instance.getInterations()).toEqual(1);
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
    const iterations = instance.getInterations();
    expect(instance.getInterations()).toBe(iterations);
    await new Promise(resolve => setTimeout(resolve, 110));
    expect(instance.getInterations()).toBeGreaterThan(iterations);
  });

  test('Should stop after completing all iterations', async () => {
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {}
    });
    instance.iterator();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getInterations()).toBe(3);
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
    expect(instance.getInterations()).toBe(3);
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
    expect(instance.getInterations()).toBe(0);
    instance.iterator();
    instance.pause();
    const currentCount = instance.getInterations();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getInterations()).toBe(currentCount);
  });

  test('resume() should start iterations again', async () => {
    const instance = inBetweenTime({
      count: 3,
      timer: 10,
      method: () => {
        console.log('abc');
      }
    });
    expect(instance.getInterations()).toBe(0);
    instance.iterator();
    instance.pause();
    const currentCount = instance.getInterations();
    await new Promise(resolve => setTimeout(resolve, 100));
    instance.resume();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(instance.getInterations()).toBeGreaterThan(currentCount);
  });
});

