#!/usr/bin/env node

const htmlReport = require("./reports/html");
const mkdirp = require("mkdirp");
const arg = require('arg');
const fs = require("fs");
const Analytics = require("./analytics");
const path = require("path");

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--stats': String,
            '--html': String,
            '--help': Boolean,
            '-s': '--stats',
            '-h': '--help'
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    const stats = args['--stats'];
    const html = args['--html'];
    const help = args['--help'] || !(stats && html);


    return {
        stats,
        html,
        help
    };
}

function showHelp(error = "") {
    console.log(
        error + (error ? "\n" : "") +
        "Note: At least a stats file and report a type must be provided!\n\n" +
        "-s, --stats <filename>: path to stats file (ex. --stats stats.log)\n" +
        "--html <filename>: path to destination html result (ex. --html report)\n" +
        "-h, --help: show this help (ex. -h)"
    )
}

function cli(args) {
    let { stats, html, help } = parseArgumentsIntoOptions(args);

    if (help) { showHelp() }
    if (stats) {
        fs.readFile(stats, async (err, data) => {
            if (err) {
                showHelp(err);
            }
            else {
                const logs = JSON.parse(data);
                const report = Analytics.analyze(logs);

                if (html) {
                    const filename = html.replace(".html", "") + ".html";
                    const dirname = path.dirname(filename);

                    console.log(dirname);
                    await mkdirp(dirname);

                    fs.writeFile(filename, htmlReport(stats, report), { encoding: 'utf8', flag: 'w' }, err => {
                        if (err) {
                            showHelp(err);
                        }
                        else {
                            console.log(`Report ${filename} generated!`);
                        }
                    });
                }
            }

        });

    }
}

cli(process.argv);

/*
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
*/