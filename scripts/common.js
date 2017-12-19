/* eslint-disable no-unused-vars, import/no-extraneous-dependencies */
const colors = require('colors');
const fs     = require('fs');
const Path   = require('path');
const util   = require('util');

exports.root_path = require('app-root-path').path;

exports.pages = require('./pages.js').map(p => ({
    save_as      : p[0],
    tpl_path     : p[1],
    layout       : p[2],
    title        : p[3],
    excludes     : p[4],
    only_ja      : p[4] && /^NOT-ja,en$/.test(p[4]),
    current_route: p[0].replace(/^(.+)\//, ''),
}));

exports.languages = ['EN', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'TH', 'VI', 'JA', 'ZH_CN', 'ZH_TW'];

exports.print = (text) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text);
};


const exitsAsync = util.promisify(fs.exists);
const mkdirAsync = util.promisify(fs.mkdir);

const ensureDirectoryExistence = async (filePath) => {
    const dirname = Path.dirname(filePath);
    if (await exitsAsync(dirname)) {
        return;
    }
    await ensureDirectoryExistence(dirname);
    await mkdirAsync(dirname);
};

const readFileAsync = util.promisify(fs.readFile);
exports.readFile = (path) => readFileAsync(path, 'utf8');

const writefileAsync = util.promisify(fs.writeFile);
exports.writeFile = async (path, data) => {
    await ensureDirectoryExistence(path);
    return await writefileAsync(path, data);
};