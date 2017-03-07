const expect    = require('chai').expect;
const statement = require('../statement');
const ws        = require('ws');
const LiveApi   = require('binary-live-api').LiveApi;

const api = new LiveApi({ websocket: ws });

describe('Statement', function() {
    let statement_ws;
    before(function(done) {
        this.timeout(10000);
        // this is a read token, even if other people take it, won't be able to do any harm
        api.authorize('hhh9bfrbq0G3dRf').then(function() {
            api.getStatement({ limit: 1, description: 1, offset: 0 }).then(function(response) {
                statement_ws = response.statement;
                done();
            });
        });
    });
    it('Should have all expected data', function() {
        const statement_data = statement.getStatementData(statement_ws.transactions[0]);
        expect(statement_data).to.be.an('Object')
            .and.to.have.property('date')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('ref')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('payout')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('action')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('amount')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('balance')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('desc')
            .and.to.be.a('string');
        expect(statement_data).to.have.property('id')
            .and.to.be.a('string');
    });
});
