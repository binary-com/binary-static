import { expect }                  from 'chai';
import React                       from 'react';
import { formatPositionsPosition } from '../format_response';

describe('formatPositionsPosition', () => {
    const positions_pos = {
        contract_id   : 1234,
        transaction_id: 5678,
        contract_type : 'ASIANU',
        longcode      : 'test \n test \n test',
        payout        : 3500.1,
        buy_price     : 2500.5,
        expiry_time   : 123456789,
    };

    it('should return an object with values in object passed as argument', () => {
        expect(formatPositionsPosition(positions_pos)).to.eql({
            reference  : +5678,
            type       : 'ASIANU',
            details    :'test <br /> test <br /> test',
            payout     : 3500.1,
            purchase   : 2500.5,
            expiry_time: 123456789,
            id         : 1234,
            indicative : 0,
        });
    });
});