const regression = require("regression");
/*
const perfMetrics = require("./perfmetrics");
const fileStats = require("./loggers/fileStats");
const fsLogger = fileStats("./regression.log", 10);
const regression = perfMetrics(regressionP, fsLogger);
*/

function oClassification(data) {
    const linear = regression.linear(data);
    const exponential = regression.exponential(data);
    const logarithmic = regression.logarithmic(data);
    const power = regression.power(data);
    const polynomial = regression.polynomial(data);

    const o = ["O(n)", "O(log n)", "O(2^n)", "2^(O(log n))", "O(n^k)"]
    const tests = [linear, logarithmic, exponential, polynomial, power].map(({ string, r2, equation }, index) => ({
        string, r2, equation, o: o[index], complexity: index + 1
    })).filter(({ r2 }) => !isNaN(r2)).sort((a, b) => a.r2 - b.r2);

    const ts = tests.slice(0, 2).sort((a, b) => a.complexity - b.complexity);

    if (ts.length === 0) {
        return [{ o: "O(1)", complexity: 1 }];
    }

    return ts;
}

function simpleStats(data) {
    const r = data.reduce((acc, d) => ({
        min: d < acc.min ? d : acc.min,
        max: d > acc.min ? d : acc.max,
        sum: acc.sum + d
    }), { min: Infinity, max: 0, sum: 0 });

    r.avg = r.sum / data.length;

    return r;
}

function analyze(data) {
    const report = { stats: [], totalTime: 0 };

    for (let fn in data) {
        const durations = data[fn].durations.map(({ duration }) => duration);
        const ds = durations.map(d => Math.round(d * 10)).sort().map((d, index) => [index, d]);

        const ss = simpleStats(durations);
        ss.fn = fn;
        ss.oClassification = oClassification(ds);

        report.stats.push(ss);
        report.totalTime += ss.sum;
    }

    // calc time percentage
    const stats = report.stats;
    for (let i = 0; i < stats.length; i++) {
        const s = stats[i];
        s.usagePercentage = s.sum / report.totalTime;
    }

    return report;
}

/*
fs.readFile("./stats.log", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    const logs = JSON.parse(data);

    const report = analyze(logs);

    console.log(report);

});
*/

module.exports = {
    analyze
}
