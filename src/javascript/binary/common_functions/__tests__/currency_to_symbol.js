const expect      = require('chai').expect;
const formatMoney = require('../currency_to_symbol').formatMoney;


describe('formatMoney', function() {
    it('works as expected', function() {
        expect(formatMoney('USD', '123.55')).to.eq('$123.55');
        expect(formatMoney('GBP', '123.55')).to.eq('£123.55');
        expect(formatMoney('EUR', '123.55')).to.eq('€123.55');
        expect(formatMoney('AUD', '123.55')).to.eq('A$123.55');
        expect(formatMoney('JPY', '123.55')).to.eq('¥124');
        expect(formatMoney('JPY', '1234.55')).to.eq('¥1,235');
    });

    it('works for unexpected currencies', function() {
        expect(formatMoney('WTV', '123.55')).to.eq('WTV123.55');
    });
});
