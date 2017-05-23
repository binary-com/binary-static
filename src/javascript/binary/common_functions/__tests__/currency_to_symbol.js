const expect      = require('chai').expect;
const formatMoney = require('../currency_to_symbol').formatMoney;


describe('formatMoney', () => {
    it('works as expected', () => {
        expect(formatMoney('USD', '123.55')).to.eq('$123.55');
        expect(formatMoney('GBP', '123.55')).to.eq('£123.55');
        expect(formatMoney('EUR', '123.55')).to.eq('€123.55');
        expect(formatMoney('AUD', '123.55')).to.eq('A$123.55');
        expect(formatMoney('JPY', '123.55')).to.eq('¥124');
        expect(formatMoney('JPY', '1234.55')).to.eq('¥1,235');
        expect(formatMoney('XBT', '0.000001')).to.eq('₿0.000001');
        expect(formatMoney('XBT', '0.0000009')).to.eq('₿0.000001');
    });

    it('works for unexpected currencies', () => {
        expect(formatMoney('WTV', '123.55')).to.eq('WTV123.55');
    });
});
