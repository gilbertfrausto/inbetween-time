# Inbetween-time.js
Iteration tool Similar to Unity coruotine

### Coming

* await/waitforSeconds/pause -- pause iterations for a certain amount of  time

### Usage
https://cdn.rawgit.com/gilbertfrausto/inbetween-time/6b439ace/inbetween-time.js

### Fiddle
https://jsfiddle.net/e95jh54t/

### Repo
https://github.com/gilbertfrausto/inbetween-time

### Examples

## Inbetween time constructor and instance
##### constructor t_t({}) takes and Object with these options
| Option | Description |
| ------ | ----------- |
| timer  | timer Time in ms between each Iteration. |
| count  | Max number of iterations. |
| method | Method to be called during each iteration |

##### Inbetween time  Instance
| Methods | Description |
| ------ | ----------- |
| iterator  | will call the method property passed into the constructor @return {void}. |
| wait      |take one argument and this is the amount of time the iterator will be stopped in milliseconds @return {void} |
| getCount | get the count of iteration set to happen @return {number} |
| setCount | change the amount of iterations set to happen @return {void} |
| getInterations |getInterations get the iterations number @return {number} |

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

myInstance.iterator(); // Start iterator
myInstance.wait(2000);// Pause Iteration
```

