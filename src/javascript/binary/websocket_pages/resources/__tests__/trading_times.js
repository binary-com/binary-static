const trading_times = require('../trading_times');
const { api, expect } = require('../../../common_functions/tests');

describe('Trading Times', function() {
    let trading_times_res,
        active_symbols_res;
    before(function(done) {
        this.timeout(10000);
        api.getTradingTimes(new Date()).then(function(response) {
            trading_times_res = response.trading_times;
            if (active_symbols_res) done();
        });
        api.getActiveSymbolsBrief().then(function(response) {
            active_symbols_res = response.active_symbols;
            if (trading_times_res) done();
        });
    });

    it('Should have all functions that are being tested', function() {
        expect(trading_times).to.have.all.of.keys(['getSubmarketInfo', 'getSymbolInfo']);
    });

    it('Should trading_times and getSubmarketInfo() have all expected data', function() {
        expect(trading_times_res).to.be.an('object')
            .that.have.property('markets');
        expect(trading_times_res.markets).to.be.an('array');
        trading_times_res.markets.forEach(function(market) {
            expect(market).to.be.an('object')
                .that.have.property('name')
                .that.is.a('string');
            expect(market).to.have.property('submarkets')
                .that.is.an('array');

            market.submarkets.forEach(function(submarket) {
                expect(submarket).to.be.an('object')
                    .that.have.property('name')
                    .that.is.a('string');
                expect(submarket).to.have.property('symbols')
                    .that.is.an('array');

                const submarket_info = trading_times.getSubmarketInfo(active_symbols_res, submarket.name);
                expect(submarket_info).to.be.an('array');
                submarket_info.forEach(function(info) {
                    expect(info).to.be.an('object')
                        .that.have.property('market')
                        .that.is.a('string');
                    expect(info).to.have.property('submarket')
                        .that.is.an('string');
                });

                submarket.symbols.forEach(function(symbol) {
                    expect(symbol).to.be.an('object')
                        .that.have.property('name')
                        .that.is.a('string');
                    expect(symbol).to.have.property('symbol')
                        .that.is.an('string');
                });
            });
        });
    });
});
