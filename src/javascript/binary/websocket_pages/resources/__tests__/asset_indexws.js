var expect = require('chai').expect;
var asset_index = require('../asset_indexws');
var ws = require('ws');
var LiveApi = require('binary-live-api').LiveApi;
var api = new LiveApi({ websocket: ws });

describe('Asset Index', function() {
    var asset_index_res, active_symbols_res;
    before(function(done){
        this.timeout(10000);
        api.getAssetIndex().then(function(response){
            asset_index_res = response.asset_index;
            if(active_symbols_res) done();
        });
        api.getActiveSymbolsBrief().then(function(response){
            active_symbols_res = response.active_symbols;
            if(asset_index_res) done();
        });
    });

    it('Should have all functions that are being tested', function() {
        expect(asset_index).to.have.all.of.keys(['getAssetIndexData', 'getMarketColumns']);
    });

    it('Should getAssetIndexData() have all expected data', function() {
        var asset_index_data = asset_index.getAssetIndexData(asset_index_res, active_symbols_res);
        expect(asset_index_data).to.be.an('array');
        asset_index_data.forEach(function(asset_index_item) {
            expect(asset_index_item).to.be.an('array')
                .to.have.lengthOf(5);
            expect(asset_index_item[0]).to.be.a('string');
            expect(asset_index_item[1]).to.be.a('string');
            expect(asset_index_item[2]).to.be.an('array');
            expect(asset_index_item[3]).to.be.an('object')
                .and.to.have.property('market')
                .that.is.a('string');
            expect(asset_index_item[3])
                .and.to.have.property('submarket')
                .that.is.a('string');
            expect(asset_index_item[3]).to.have.property('submarket')
                .that.is.a('string');
            expect(asset_index_item[4]).to.be.an('object');
        });
    });

    it('Should getMarketColumns() have all expected data', function() {
        var market_columns = asset_index.getMarketColumns();
        expect(market_columns).to.be.an('Object');
        Object.keys(market_columns).forEach(function(market) {
            expect(market_columns[market]).to.have.property('columns')
                .that.is.an('array');
            expect(market_columns[market].columns.length).to.equal(market_columns[market].header.length);
        });
    });
});
