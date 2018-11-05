const path = require('path');
const fs   = require('fs');
const expect = require('chai').expect;

describe('check svg file format', () => {

    it('should be valid svgs', () => {
        function fetchSvgs(dir) {
            const directory = fs.readdirSync(dir);
            return directory.map(file => {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    return fetchSvgs(path.join(dir, file));
                }
                return file.match(/.*\.(svg)$/ig) ? path.join(dir, file) : false;
            });
        }

        const flatten = arr => {
            let index;
            while ((index = arr.findIndex(el => Array.isArray(el))) > -1) { //eslint-disable-line
                arr.splice(index, 1, ...arr[index]);
            }
            return arr;
        };
        const svgs    = fetchSvgs(path.resolve(__dirname, '../../src/images'));

        flatten(svgs)
            .filter(item => !!item)
            .forEach(item => {
                const stats = fs.statSync(path.resolve(item));
                if (stats.isSymbolicLink()) return;
                const file = fs.readFileSync(path.resolve(item), 'utf-8');
                expect(file).to.be.a('string');
                expect(file).to.match(/(?!\n)(<svg)(.*)(>).*(<\/\s?svg)>/i, `unoptimized svg at ${item}\n Please run the following command on your terminal and commit the result: \n svgo ${item} \n`);
            });
    });
});
