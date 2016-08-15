var expect = require('chai').expect;
var format_money = require('../currency_to_symbol').format_money;


describe('format_money', function() {
	it('works as expected', function() {
		expect(format_money('USD', '123.00')).to.eq('$123.00');
		expect(format_money('GBP', '123.00')).to.eq('£123.00');
		expect(format_money('EUR', '123.00')).to.eq('€123.00');
		expect(format_money('AUD', '123.00')).to.eq('A$123.00');
	});

	it('works for unexpected currencies', function() {
		expect(format_money('WTV', '123.00')).to.eq('WTV 123.00');
	});
});
