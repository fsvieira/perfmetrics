const perfMetrics = require("../lib/perfmetrics");
const fileStats = require("../loggers/filestats/filestats");

function constanteTime(n) {
    return n % 2 ? 'Odd' : 'Even';
}

function linearTime(n, x) { // n * x
    let r = [];
    for (let i = 0; i < n * x; i++) {
        r.push(i);
    }
}

function quadraticTime(n) { // n^2
    let r = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            r.push([i, j]);
        }
    }
}

function polynomialTime(n, x, sum = 0) {
    if (x === 0) {
        return sum;
    }
    for (let i = 0; i < n; i++) {
        sum += i;
        sum += polynomialTime(n, x - 1);
    }
}

function asyncLinearTime(n) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(n);
        }, n);
    });
}

const fsLogger = fileStats("./stats.log", 1000);

const constanteTimePerf = perfMetrics(constanteTime, fsLogger);
const linearTimePerf = perfMetrics(linearTime, fsLogger);
const quadraticTimePerf = perfMetrics(quadraticTime, fsLogger);
const polynomialTimePerf = perfMetrics(polynomialTime, fsLogger);
const asyncLinearTimePerf = perfMetrics(async function asyncLinearTimeWrap(n) { await asyncLinearTime(n) }, fsLogger);

class SimpleClass {
    hello(s) {
        return `Hello ${s} ${this.world()}`;
    }

    world() {
        return "world";
    }
}

const SimpleClassTimePerf = perfMetrics(SimpleClass, fsLogger);

async function test() {

    const sc = new SimpleClassTimePerf();

    for (let i = 0; i < 100; i++) {
        constanteTimePerf(1000 + i);
        linearTimePerf(1000 + i, 2);
        quadraticTimePerf(1000 + i);
        polynomialTimePerf(i, 2);
        await asyncLinearTimePerf(i);

        sc.hello(i);
    }
}

test();

