# Perf Metrics
Get performance metrics of js classes/functions with simple metrics reports.

# How to use

First you will need to install the lib to get some metrics:

```
  npm install @perfmetrics/lib
```

Next just call the lib from your code:

```javascript
const perfMetrics = require("@perfmetrics/lib");
```

The perfMetrics is a function that takes two arguments:
  * target: class, function, object, anything that can be used with proxy. 
  * log, a callback (by default = console.log)  with the arguments: (name, start, end, duration) => ... 
     * name: the name of function, or ClassName.NameFunc
     * start: start time (higth resolution time in milliseconds)
     * end: end time (higth resolution time in milliseconds)
     * duraction: time that takes to execute the function (higth resolution time in milliseconds)
  
  
  
Now lets track a function:

```javascript
const perfMetrics = require("@perfmetrics/lib");

function quadraticTime(n) { // n^2
    let r = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            r.push([i, j]);
        }
    }
}

const quadraticTimePerf = perfMetrics(quadraticTime);

// Now when you call quadraticTimePerf will track all the execution time
// In this case it will be logged to console.log

for (let i = 0; i < 100; i++) {
  quadraticTimePerf(1000 + i);
}

```

Its easy to implement a new logger, but we can use the filestats logger, just install 

```
npm install @perfmetrics/filestats
```

Then we can change the code to use the logger like this:

```javascript
const perfMetrics = require("@perfmetrics/lib");

function quadraticTime(n) { // n^2
    let r = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            r.push([i, j]);
        }
    }
}

// Output, save file every 1 second
const fsLogger = fileStats("./stats.log", 1000);
const quadraticTimePerf = perfMetrics(quadraticTime, fsLogger);

// Now when you call quadraticTimePerf will track all the execution time
// In this case it will be logged to console.log

for (let i = 0; i < 100; i++) {
  quadraticTimePerf(1000 + i);
}

```

Afther running the code we will get a stats.log file. To generate a report we first install package:

```
npm install @perfmetrics/cli --global
```

And finally just run:

```
perfmetrics -s stats.log --html stats
```
This will generate a stats.html report like this one: https://fsvieira.github.io/perfmetrics/

To get more information on how to use the cli, just run 

```
perfmetrics -h
```

For more information check out the examples on the examples folder of this repo.


## How it works ?

Using a proxy perfMetrics will try to keep track of the execution time of all functions generated from the proxy funcion/class, the time statistics and 
function information is logged using a callback function on perfMetrics, currently there in this package there is only a file logger.

Using reporter like `node reports/html.js stats.log stats` will create a stats.html report. 

### Complexity calculation

The complexity is calculated using regressions functions (https://github.com/Tom-Alexander/regression-js) on the collected data. 
It goes like this:

  * Order the duraction data ascending,
  * Run multiple methods and choose the 2 (if they exist) with the best r-square score.

This means that more data will give better results. It also means that a function may not correspond to code classification but that can be a good thing, 
why spending time otimizing functions that never reach the worst case in real cenario usage.

## Notes

This is still a work in progress, but alredy a working beta. 

What I would like to do in the future:
  * Add and improve loggers: using webworker compatible api, rest-api. 
  * Add more reports, including a live webapp using a rest-api server.
  * Compare two reports of same funcitions so that we can understand if there is improvements.
  
