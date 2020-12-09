# perfmetrics
Profile your js classes/functions with simple metrics reports.

## How it works ?

Using a proxy perfMetrics will try to keep track of the execution time of all functions generated from that funcion/class, the time statistics and 
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
There are examples on the examples folder of this repo. 
There is an example output here https://fsvieira.github.io/perfmetrics/

What I would like to do in the future:
  * Release a version on npm,
  * Make usage documentation,
  * Allow cli tools to generate report,
  * Add and improve loggers: using webworker compatible api, rest-api. 
  * Add more reports, including a live webapp using a rest-api server.
  * Compare two reports of same funcitions so that we can understand if there is improvements.
  
