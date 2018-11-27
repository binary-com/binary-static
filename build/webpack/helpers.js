const fs    = require('fs');
const path  = require('path');
const PATHS = require('./paths');

const getDirsSync = (path_to_dir) => (
    fs.readdirSync(path_to_dir)
        .filter(f => (
            fs.statSync(path.join(path_to_dir, f)).isDirectory()
        ))
);

const getApp2Aliases = () => {
    const app_2_path = path.resolve(PATHS.SRC, 'javascript/app_2');

    return getDirsSync(app_2_path)
        .filter(d => !/documents/i.test(d))
        .reduce(
            (aliases, folder_name) => ({
                ...aliases,
                [folder_name]: path.resolve(app_2_path, folder_name),
            }),
            {}
        );
};

const makeCacheGroup = (name, priority, ...matches) => ({
    [name]: {
        name,
        priority,
        chunks : 'initial',
        enforce: true,
        test   : new RegExp(`^${matches.map(m => `(?=.*${m})`).join('')}`),
    },
});

module.exports = {
    getApp2Aliases,
    makeCacheGroup,
};
