import { expect } from 'chai';
import { formatMoney } from '../currency_to_symbol';

describe('formatMoney', () => {
    it('works as expected', () => {
        expect(formatMoney('USD', '123.55')).to.eq('$123.55');
        expect(formatMoney('GBP', '123.55')).to.eq('£123.55');
        expect(formatMoney('EUR', '123.55')).to.eq('€123.55');
        expect(formatMoney('AUD', '123.55')).to.eq('A$123.55');
        expect(formatMoney('JPY', '123.55')).to.eq('¥124');
        expect(formatMoney('JPY', '1234.55')).to.eq('¥1,235');
    });

    it('works for unexpected currencies', () => {
        expect(formatMoney('WTV', '123.55')).to.eq('WTV123.55');
    });
});
