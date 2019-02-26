import { expect }                  from 'chai';
import React                       from 'react';
import { formatPortfolioPosition } from '../format-response';

describe('formatPortfolioPosition', () => {
    const portfolio_pos = {
        buy_price     : 2500.5,
        contract_id   : 1234,
        contract_type : 'ASIANU',
        expiry_time   : 123456789,
        longcode      : 'test \n test \n test',
        payout        : 3500.1,
        transaction_id: 5678,
    };

    it('should return an object with values in object passed as argument', () => {
        expect(formatPortfolioPosition(portfolio_pos)).to.eql({
            details      :'test <br /> test <br /> test',
            expiry_time  : 123456789,
            id           : 1234,
            indicative   : 0,
            payout       : 3500.1,
            purchase     : 2500.5,
            reference    : +5678,
            type         : 'ASIANU',
        });
    });
});
