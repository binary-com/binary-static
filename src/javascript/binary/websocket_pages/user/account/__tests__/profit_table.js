const expect      = require('chai').expect;
const profitTable = require('../profit_table');
const ws          = require('ws');
const LiveApi     = require('binary-live-api').LiveApi;

const api = new LiveApi({ websocket: ws });

describe('Profit Table', function() {
    let profit_table;
    before(function(done) {
        this.timeout(10000);
        // this is a read token, even if other people take it, won't be able to do any harm
        api.authorize('hhh9bfrbq0G3dRf').then(function() {
            api.getProfitTable({ limit: 1, description: 1, offset: 0 }).then(function(response) {
                profit_table = response.profit_table;
                done();
            });
        });
    });
    it('Should have all expected data', function() {
        const profit_table_data = profitTable.getProfitTabletData(profit_table.transactions[0]);
        expect(profit_table_data).to.be.an('Object')
            .and.to.have.property('buyDate')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('ref')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('payout')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('buyPrice')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('sellDate')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('sellPrice')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('pl')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('desc')
            .and.to.be.a('string');
        expect(profit_table_data).to.have.property('id')
            .and.to.be.a('string');
    });
});
