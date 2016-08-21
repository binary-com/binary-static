var expect  = require('chai').expect;
var utility = require('../utility');

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

describe('parseLoginIDList', function() {
    it('works for empty strings', function() {
        var res = utility.parseLoginIDList('');
        var expected = [];
        expect(res).to.deep.equal(expected);
    });
    it('works correctly', function() {
        var res = utility.parseLoginIDList('MF3101:R:E+VRTC759728:V:E');
        var expected = [
            {disabled: false, financial: true,  non_financial: false, id: 'MF3101', real: true},
            {disabled: false, financial: false, non_financial: false, id: 'VRTC759728', real: false},
        ];
        expect(res).to.deep.equal(expected);
    });
});
