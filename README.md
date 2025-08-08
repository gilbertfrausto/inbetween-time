<img width="2160" height="1046" alt="Image" src="https://github.com/user-attachments/assets/45fccd90-fd52-417d-9529-dc185ca45a1a" />

# Inbetween-time.js
Iteration tool Similar to Unity coroutine. A tool used like you would get from `setInterval()` but with the perfomace of `requestAnimationFrame()`. With the the ability to programmatically pause the iterations and resume.

### Usage
```javascript
npm install inbetween-time
```

### Repo
https://github.com/gilbertfrausto/inbetween-time

### Examples
https://inbetween-time.web.app/

### Example code
https://github.com/gilbertfrausto/inbetween-time/blob/master/examples/index.html

## Inbetween time constructor and instance
### Options object

| Option | Description |
| ------ | ----------- |
| timer  | Time in ms between each Iteration. |
| count  | Max number of iterations. |
| method | Method to be called for each iteration. |
| onComplete | A function to be called when all iterations are complete. |

### Inbetween time Instance

| Method            | Description                                                     | Parameter(s)         | Returns   |
| ----------------- | --------------------------------------------------------------- | -------------------- | --------- |
| `iterator()`      | Kicks off the iterations.                                       | _none_               | `void`    |
| `wait()`          | Pauses the iterator for a specified time in milliseconds.       | `yieldTime` (number) | `void`    |
| `getCount()`      | Gets the total number of iterations to be performed.            | _none_               | `number`  |
| `setCount()`      | Changes the total number of iterations.                         | `changed` (number)   | `void`    |
| `getIterations()` | Gets the current number of completed iterations.                | _none_               | `number`  |
| `completed()`     | Returns `true` if the iterator has finished, otherwise `false`. | _none_               | `boolean` |
| `pause()`         | Pauses all iterations until `resume()` is called.               | _none_               | `void`    |
| `resume()`        | Resumes iterations after being paused.                          | _none_               | `void`    |

```javascript
import inBetweenTime from 'inbetween-time';

let myInstance = inBetweenTime({
	timer: 1000,
	count: 5,
	method: () => {
		console.log(`
			Will fire ${myInstance.getCount()} times!,
			Iteration count ${myInstance.getIterations() + 1}
		`);
	}
});

myInstance.iterator();  // Start iterator
myInstance.wait(2000);  // Pause iteration
myInstance.resume();    // Restarts iterations
```

## Immutable, Data-Oriented API

This version of the API is designed to be immutable and data-oriented. Instead of creating an instance that manages its own state, you create a state object and then use pure functions to transform that state. This makes the logic more predictable and easier to test.

### State Object

The state object is a plain JavaScript object that contains all the information about the iterator's state. It has the following properties:

| Property      | Description                                      |
| ------------- | ------------------------------------------------ |
| `timer`       | Time in ms between each Iteration.               |
| `count`       | Max number of iterations.                        |
| `method`      | Method to be called for each iteration.          |
| `onComplete`  | A function to be called when all iterations are complete. |
| `current`     | The current number of completed iterations.      |
| `paused`      | `true` if the iterator is paused, otherwise `false`. |
| `isCompleted` | `true` if the iterator has finished, otherwise `false`. |
| `lastTime`    | The timestamp of the last iteration.             |

### Functions

| Function                | Description                                                                 | Parameter(s)                               | Returns                      |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------- |
| `createIteratorState()` | Creates a new iterator state object.                                        | `spec` (object)                            | `Readonly<IteratorState>`    |
| `pause()`               | Pauses the iterator.                                                        | `state` (IteratorState)                    | `Readonly<IteratorState>`    |
| `resume()`              | Resumes the iterator.                                                       | `state` (IteratorState)                    | `Readonly<IteratorState>`    |
| `setCount()`            | Changes the total number of iterations.                                     | `state` (IteratorState), `newCount` (number) | `Readonly<IteratorState>`    |
| `setTimer()`            | Changes the time between iterations.                                        | `state` (IteratorState), `newTimer` (number) | `Readonly<IteratorState>`    |
| `tick()`                | The core logic of the iterator. Calculates the next state based on the current time. | `state` (IteratorState), `timestamp` (number) | `Readonly<IteratorState>`    |
| `createRunner()`        | Creates a new runner that manages the iterator's state.                     | `initialState` (IteratorState), `onStateChange` (function) | `Readonly<Runner>`           |
| `wait()`                | Pauses the iterator for a specified time in milliseconds.                   | `runner` (Runner), `yieldTime` (number)    | `void`                       |

### Example

```javascript
import {
  createIteratorState,
  createRunner,
  pause,
  resume,
  wait,
} from 'inbetween-time';

const initialState = createIteratorState({
  timer: 1000,
  count: 5,
  method: () => {
    console.log('Iteration!');
  },
  onComplete: () => {
    console.log('Completed!');
  },
});

const runner = createRunner(initialState, (newState) => {
  console.log('State changed:', newState);
});

// Pause the runner after 2 seconds
setTimeout(() => {
  runner.dispatch(pause);
}, 2000);

// Resume the runner after 4 seconds
setTimeout(() => {
  runner.dispatch(resume);
}, 4000);

// Use wait to pause for a specific duration
wait(runner, 2000);
```