# Inbetween-time.js

Iterator that returns after certain conditions are met.

### Coming

* await/waitforSeconds/pause -- pause iterations for a certain amount of time

### Usage
* https://cdn.rawgit.com/gilbertfrausto/inbetween-time/6b439ace/inbetween-time.js

### Examples

```javascript
/**
    *   Create Inbetween-Time Instance Via Constructor
    *   @param spec {Object} take four properties
    *   timer {number} Time in ms between each Iteration
    *   count {number} Max number of iterations
    *   method {Function} Method to be called during each iteration
    *   @return {Object} iterator, wait
    *
    *   iterator {function} will call the spec.method property
    *   @return void
    *
    *   wait{Function} take one argument and this is the amount of time the iterator will be stopped in milliseconds
    *   @param yieldTime {number} amount of time iterator will yield.
    *       
**/

let myInstance = t_t({
    timer: 1000,
    count: 5,
    method: () => {
        console.log('this needs to run three Times!');
    }
});

myInstance.iterator(); // Start iterator
myInstance.wait(2000);// Pause Iterations


// Full working example
let repeater = () => {
    console.log(`this needs to run ${count} Times!`);
};

let ropes = t_t({
    timer: 1000,
    count: 4,
    method: repeater
});


ropes.iterator();

setTimeout(() => {
	ropes.wait(1000);
}, 2000);
```
