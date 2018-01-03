const color  = require('cli-color');
const expect = require('chai').expect;
const texts  = require('../generate-static-data').texts;

describe('generate-static-data.js', () => {
    const all        = {};
    const duplicates = {};

    before(() => {
        texts.forEach((str) => {
            if (all[str]) {
                duplicates[str] = (duplicates[str] || 1) + 1;
            } else {
                all[str] = 1;
            }
        });
    });

    it('strings should not be duplicated', () => {
        expect(Object.keys(duplicates)).to.have.lengthOf(0);
    });

    after(() => {
        const keys = Object.keys(duplicates);
        if (keys.length) {
            console.log(color.yellow('\tDuplicates:'));
            keys.forEach((key) => {
                console.log(color.red('\t  -'), color.yellow(`[${duplicates[key]}]`), `'${key}'`);
            });
        }
    });
});
