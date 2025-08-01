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
| timer  | timer Time in ms between each Iteration. |
| count  | Max number of iterations. |
| method | Method to be called during each iteration |
| onComplete | A function to be called when all iterations are complete. |

### Inbetween time Instance

| Methods           | Description |
| ----------------- | ----------- |
| iterator          | will call the method property passed into the constructor @return {void}. |
| wait              |take one argument and this is the amount of time the iterator will be stopped in milliseconds @return {void} |
| getCount          | get the count of iteration set to happen @return {number} |
| setCount          | change the amount of iterations set to happen @return {void} |
| getInterations    |getInterations get the iterations number @return {number} |
| completed         | returns true if the iterator has finished, otherwise false @return {boolean} |
| pause             | pauses all iterations indefintly @return {void} |
| resume            | restarts iterations @return {void} |

```javascript

let myInstance = t_t({
    timer: 1000,
    count: 5,
    method: () => {
        console.log(`
            Will fire ${myInstance.getCount()} times!,
            Iteration count ${myInstance.getInterations() + 1}
        `);
    }
});

myInstance.iterator();  // Start iterator
myInstance.wait(2000);  // Pause iteration
myInstance.resume();    // Restarts iterations
```

