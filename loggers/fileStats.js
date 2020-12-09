const fs = require("fs");

/**
 * TODO make this run on webworker compatible framework
 * 
 */

module.exports = (filename, saveTime = 500) => {
    const stats = {};
    let save;

    return (name, start, end, duration) => {
        const n = stats[name] = stats[name] || { durations: [] };

        n.durations.push({
            name,
            start,
            end,
            duration
        });

        clearTimeout(save);
        save = setTimeout(() => {
            fs.writeFile(filename, JSON.stringify(stats, null, '  '), err => {
                if (err) {
                    console.log(err);
                }
            });
        }, saveTime);
    }
};