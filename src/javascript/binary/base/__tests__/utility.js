var expect  = require('chai').expect;
var utility = require('../utility');

describe('template', function() {
    it('works as expected', function() {
        expect(utility.template('abc [_1] abc', ['2'])).to.eq('abc 2 abc');
        expect(utility.template('[_1] [_2]', ['1', '2'])).to.eq('1 2');
    });

    it('does not replace twice', function() {
        expect(utility.template('[_1] [_2]', ['[_2]', 'abc'])).to.eq('[_2] abc');
    });
});

describe('objectNotEmpty', function() {
    it('returns true for empty objects', function() {
        expect(utility.objectNotEmpty({})).to.eq(false);
        expect(utility.objectNotEmpty({notEmpty: true})).to.eq(true);
    });

    it('returns false for non objects', function() {
        expect(utility.objectNotEmpty(1)).to.eq(false);
        expect(utility.objectNotEmpty(undefined)).to.eq(false);
        expect(utility.objectNotEmpty(null)).to.eq(false);
        expect(utility.objectNotEmpty(false)).to.eq(false);
        expect(utility.objectNotEmpty(true)).to.eq(false);
        expect(utility.objectNotEmpty('')).to.eq(false);
    });
});
