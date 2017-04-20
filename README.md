# Inbetween-time.js

Iterator that returns after certain conditions are met.

### Coming

* await/waitforSeconds/pause -- pause iterations for a certain amount of time

### Examples

```javascript
let repeater = () => {
    console.log('this needs to run four Times!');
};

let ropes = t_t({
    timer: 1000,
    count: 4,
    method: repeater
});

console.log(ropes.iterator());
```
