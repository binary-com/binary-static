/* eslint-disable */
const colors = require('colors');
const fs = require('fs');

exports.root_path = require('app-root-path').path;

exports.pages = require('./pages.js').map(p => ({
    save_as  : p[0],
    tpl_path : p[1],
    layout   : p[2],
    title    : p[3],
    excludes : p[4],
    only_ja  : p[4] && /^NOT-ja,en$/.test(p[4]),
    current_route: p[0].replace(/^(.+)\//, ''),
}));

exports.languages = ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'TH', 'VI', 'JA', 'ZH_CN', 'ZH_TW'];

exports.print = (text) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text);
};

exports.readFile = (path) => new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, result) => {
        if(err) { reject(err); }
        else resolve(result);
    });
})
exports.writeFile = (path, data) => new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
        if(err) { reject(err); }
        else resolve();
    });
})