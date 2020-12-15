const {
    performance,
    PerformanceObserver
} = require('perf_hooks');

const getName = (target, fn, prop) => {
    try {
        const s = target ? `${target.constructor.name}.${fn.name || prop}` : fn.name || prop;

        if (s) {
            return s;
        }

        const st = fn.toString();
        return fn.toString().replace("function", "fn").slice(0, 50) + (st.length <= 50 ? "" : "...");
    } catch (e) {
        return "<NO NAME>";
    }
}

const logTime = (log, name, fn) => {
    const start = performance.now();
    const r = fn();

    const end = performance.now();
    const duration = end - start;

    setTimeout(() => log(name, start, end, duration), 0);

    return r;
}

const perfHandler = (log, classType) => ({
    construct(target, args) {
        const r = new target(...args);
        return perfTracker(r, log, target);
    },
    get: function (target, prop, receiver) {
        const r = Reflect.get(target, prop, receiver);

        if (typeof r === 'function') {
            const name = getName(target, r, prop);

            return (...args) => {
                const argsP = args.map(x => perfTracker(x, log, classType));

                const targetProxy = classType && (target instanceof classType) ? perfTracker(target, log) : target;
                const p = logTime(log, name, () => r.call(targetProxy, ...argsP));
                return perfTracker(p, log, classType);
            }
        }

        return perfTracker(r, log, classType);
    },
    apply: function (target, thisArg, argumentsList) {
        const argsP = argumentsList.map(x => perfTracker(x, log, classType));

        const r = logTime(log, getName(thisArg, target), () => target.apply(thisArg, argsP));
        return perfTracker(r, log, classType)
    }
});

function perfTracker(target, log = console.log, classType) {
    try {
        return new Proxy(target, perfHandler(log, classType));
    }
    catch (e) {
        return target;
    }
}

module.exports = perfTracker;

