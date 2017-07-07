const expect        = require('chai').expect;
const formatMoney   = require('../currency').formatMoney;
const setCurrencies = require('../currency').setCurrencies;


describe('formatMoney', () => {
    setCurrencies({ currencies_config: { AUD: { fractional_digits: 2, type: 'fiat' }, EUR: { fractional_digits: 2, type: 'fiat' }, GBP: { fractional_digits: 2, type: 'fiat' }, JPY: { fractional_digits: 2, type: 'fiat' }, USD: { fractional_digits: 2, type: 'fiat' } } });

    it('works as expected', () => {
        expect(formatMoney('USD', '123.55')).to.eq('$123.55');
        expect(formatMoney('GBP', '123.55')).to.eq('£123.55');
        expect(formatMoney('EUR', '123.55')).to.eq('€123.55');
        expect(formatMoney('AUD', '123.55')).to.eq('A$123.55');
        expect(formatMoney('JPY', '123.55')).to.eq('¥124');
        expect(formatMoney('JPY', '1234.55')).to.eq('¥1,235');
        expect(formatMoney('BTC', '0.005432110')).to.eq('₿0.00543211');
        expect(formatMoney('BTC', '0.005432116')).to.eq('₿0.00543212');
    });

    it('works for unexpected currencies', () => {
        expect(formatMoney('WTV', '123.55')).to.eq('WTV 123.55000000');
    });
});
