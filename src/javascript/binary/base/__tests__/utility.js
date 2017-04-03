const expect  = require('chai').expect;
const utility = require('../utility');

describe('template', function() {
    it('works as expected', function() {
        expect(utility.template('abc [_1] abc', ['2'])).to.eq('abc 2 abc');
        expect(utility.template('[_1] [_2]', ['1', '2'])).to.eq('1 2');
        expect(utility.template('[_1] [_1]', ['1'])).to.eq('1 1');
    });

    it('does not replace twice', function() {
        expect(utility.template('[_1] [_2]', ['[_2]', 'abc'])).to.eq('[_2] abc');
    });
});

describe('isEmptyObject', function() {
    it('returns true for empty objects', function() {
        expect(utility.isEmptyObject({})).to.eq(true);
        expect(utility.isEmptyObject({ notEmpty: true })).to.eq(false);
    });

    it('returns false for non objects', function() {
        expect(utility.isEmptyObject(1)).to.eq(true);
        expect(utility.isEmptyObject(undefined)).to.eq(true);
        expect(utility.isEmptyObject(null)).to.eq(true);
        expect(utility.isEmptyObject(false)).to.eq(true);
        expect(utility.isEmptyObject(true)).to.eq(true);
        expect(utility.isEmptyObject('')).to.eq(true);
    });
});
