# Inbetween-time.js
Iteration tool Similar to Unity coroutine

### Usage
```javascript
npm install inbetween-time
```

### Fiddle
https://jsfiddle.net/e95jh54t/

### Repo
https://github.com/gilbertfrausto/inbetween-time

### Examples
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
