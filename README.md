# Inbetween-time.js

Iterator that returns after certain conditions are met.

### Coming

* await/waitforSeconds/pause -- pause iterations for a certain amount of  time

### Usage
https://cdn.rawgit.com/gilbertfrausto/inbetween-time/6b439ace/inbetween-time.js

### Fiddle
https://jsfiddle.net/e95jh54t/

#Repo
https://github.com/gilbertfrausto/inbetween-time

### Examples

```javascript
/**
*   Create Inbetween-Time Instance Via Constructor
*   @param  {Object} spec take four properties
*   @property {Number} timer Time in ms between each Iteration
*   @property {Number} count Max number of iterations
*   @property {Function} method Method to be called during each iteration
* 	@return {Object}
*   @property {Function} iterator will call the spec.method property @return {void}
*   @property {Function} wait take one argument and this is the amount of time the iterator will be stopped in milliseconds @return {void}
*   @property {Function} getCount get the count of iteration set to happen @return {number}
*   @property {Function} setCount change the amount of iterations set to happen @return {void}
*   @property {Function} getInterations get the iterations number @return {number}
*   @param  {Number} yieldTime  amount of time iterator will yield.
    *       
**/

let myInstance = t_t({
    timer: 1000,
    count: 5,
    method: () => {
        console.log(`Will fire ${myInstance.getCount()} times!, Iteration count ${myInstance.getInterations() + 1}`);
    }
});

myInstance.iterator(); // Start iterator
myInstance.wait(2000);// Pause Iteration

```
