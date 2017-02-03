const expect = require('chai').expect;
const format_money = require('../currency_to_symbol').format_money;


describe('format_money', function() {
    it('works as expected', function() {
        expect(format_money('USD', '123.55')).to.eq('$123.55');
        expect(format_money('GBP', '123.55')).to.eq('£123.55');
        expect(format_money('EUR', '123.55')).to.eq('€123.55');
        expect(format_money('AUD', '123.55')).to.eq('A$123.55');
        expect(format_money('JPY', '123.55')).to.eq('¥124');
        expect(format_money('JPY', '1234.55')).to.eq('¥1,235');
    });

    it('works for unexpected currencies', function() {
        expect(format_money('WTV', '123.55')).to.eq('WTV123.55');
    });
});
