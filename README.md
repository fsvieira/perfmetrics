# perfmetrics
Profile your js classes/functions with simple metrics reports

## How it works ?

Using a proxy perfMetrics will try to keep track of the execution time of all functions generated from that funcion/class, the time statistics and 
function information is logged using a callback function on perfMetrics, currently there in this package there is only a file logger.

Using reporter like `node reports/html.js stats.log stats` will create a stats.html report. 

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
  
  
