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
