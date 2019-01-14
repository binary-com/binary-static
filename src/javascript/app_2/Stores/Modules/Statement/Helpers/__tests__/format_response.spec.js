import { expect }                       from 'chai';
import { formatStatementTransaction }   from '../format_response.js';

describe('formatStatementTransaction', () => {
    let transaction = {
        action_type     : 'Buy',
        transaction_time: 123456789,
        transaction_id  : 1234,
        payout          : 1000,
        amount          : 2000,
        balance_after   : 3000,
        longcode        : 'test \n test \n test',
        contract_id     : 1234,
        app_id          : 1234,
    };
    const currency = 'USD';

    it('should return an object with values of object passed as argument', () => {
        expect(formatStatementTransaction(transaction, currency)).to.eql({
            action  : 'Buy',
            date    : '1973-11-29\n21:33:09 GMT',
            refid   : 1234,
            payout  : '1,000.00',
            amount  : '2,000.00',
            balance : '3,000.00',
            desc    : 'test <br /> test <br /> test',
            id      : 1234,
            app_id  : 1234,
        });
    });

    it('should return payout, amount and balance as -', () => {
        transaction.payout = NaN;
        transaction.amount = NaN;
        transaction.balance_after = NaN;

        expect(formatStatementTransaction(transaction, currency)).to.eql({
            action  : 'Buy',
            date    : '1973-11-29\n21:33:09 GMT',
            refid   : 1234,
            payout  : '-',
            amount  : '-',
            balance : '-',
            desc    : 'test <br /> test <br /> test',
            id      : 1234,
            app_id  : 1234,
        })
    });

});
