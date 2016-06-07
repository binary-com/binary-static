var expect = require('chai').expect;
var activeSymbols = require('../activeSymbols');
var ws = require('ws');
var LiveApi = require('binary-live-api').LiveApi;
var api = new LiveApi({ websocket: ws });

/* 
	There is a market called forex, which has a submarket called major_pairs, which has a symbol called frxEURUSD
*/

describe('ActiveSymbols', function() {
	var active_symbols;
	before(function(done){
		api.getActiveSymbolsBrief().then(function(response){
			active_symbols = response.active_symbols;
			done();
		});
	});
	it('Should have all functions that are being tested', function() {
		expect(activeSymbols).to.have.any.of.keys(['getMarkets', 'getSubmarkets', 'getMarketsList', 'getTradeUnderlyings', 'getSymbolNames']);
	});
	it('Should getMarkets have forex as a key', function() {
		var markets = activeSymbols.getMarkets(active_symbols);
		expect(markets).to.be.an('Object')
			.and.to.have.property('forex');
		expect(markets.forex).to.have.property('name')
			.and.to.be.a('String');
		expect(markets.forex).to.have.property('is_active')
			.and.to.be.a('Number');
		expect(markets.forex).to.have.property('submarkets')
			.and.to.be.an('Object');
	});
	it('Should getSubmarkets have major_pairs as a key, but not forex', function() {
		var submarkets = activeSymbols.getSubmarkets(active_symbols);
		expect(submarkets).to.be.an('Object')
			.and.to.have.any.of.key('major_pairs')
			.and.not.to.have.any.of.key('forex');
	});
	it('Should getMarketsList have major_pairs and forex as keys', function() {
		var marketList = activeSymbols.getMarketsList(active_symbols);
		expect(marketList).to.be.an('Object')
			.and.to.have.any.of.keys(['forex', 'major_pairs']);
	});
	it('Should getTradeUnderlyings have major_pairs and forex as keys and symbols as values', function() {
		var tradeUnderlyings = activeSymbols.getTradeUnderlyings(active_symbols);
		expect(tradeUnderlyings).to.be.an('Object')
			.and.to.have.property('forex')
			.and.to.have.property('frxEURUSD')
			.and.to.have.any.of.keys(['is_active', 'display', 'market', 'submarket']);
		expect(tradeUnderlyings).to.have.property('major_pairs')
			.and.to.have.property('frxEURUSD')
			.and.to.have.any.of.keys(['is_active', 'display', 'market', 'submarket']);
	});
	it('Should getSymbolNames have all symbol names', function() {
		var names = activeSymbols.getSymbolNames(active_symbols);
		expect(names).to.be.an('Object')
			.and.to.have.property('frxEURUSD');
	});
});
