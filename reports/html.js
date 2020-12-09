const Analytics = require("../analytics");
const fs = require("fs");

const [node, script, logA, outfile] = process.argv;

function genStatsTable(stats) {

    return `<table class="styled-table">
        <thead>
            <tr>
                <td>Function Name</td>
                <td>Min (ms)</td>
                <td>Avg (ms)</td>
                <td>Max (ms)</td>
                <td>Complexity (lower / upper bound)</td>
                <td>Usage</td>
            </tr>
        </thead>
        <tbody>${
        stats.map(({ fn, min, max, avg, oClassification: [a, b], usagePercentage }) => {
            // const [a, b] = oClassification;

            const col = `<td>${fn}</td>\n` +
                `<td>${min.toFixed(2)}</td>\n` +
                `<td>${avg.toFixed(2)}</td>\n` +
                `<td>${max.toFixed(2)}</td>\n` +
                `<td>${a.o}${b ? " / " + b.o : ""}</td>\n` +
                `<td>${Math.round(usagePercentage * 100)}%</td>\n`

            return `<tr>${col}</tr>`
        }).join("\n")}
        </tbody>
        </table>`
        ;
}

function getStyles() {
    return `
        .styled-table {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            margin: 0 auto;
        }

        .styled-table thead tr {
            background-color: #009879;
            color: #ffffff;
            text-align: left;
        }

        .styled-table th,
        .styled-table td {
            padding: 12px 15px;
        }

        .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }
        
        .styled-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }
        
        .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
        }
    `;
}

function genHtml(name, report) {
    const table = genStatsTable(report.stats);

    return `
        <!DOCTYPE html>
        <html>
        <style>${getStyles()}</style>
        <head>
        <title>${name}</title>
        </head>
        <body>
            ${table}
        </body>
        </html> 
    `;
}

fs.readFile(logA, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    const logs = JSON.parse(data);
    const report = Analytics.analyze(logs);

    fs.writeFile(outfile.replace(".html", "") + ".html", genHtml(logA, report), err => {
        if (err) {
            console.log(err);
        }
    });

});

