import { expect }                                  from 'chai';
import React                                       from 'react';
import { buildCurrenciesList, getDefaultCurrency } from '../currency';

describe('buildCurrenciesList', () => {
    const payout_currencies = [
        "AUD",
        "BTC",
        "ETH",
        "EUR",
        "LTC",
        "USD"
    ];

    it('It Returns the desired currencies', () => {
        expect(buildCurrenciesList(payout_currencies)).to.eql({
            Fiat: [{
                "text": "AUD",
                "value": "AUD"
            },
            {
                "text": "EUR",
                "value": "EUR"
            },
            {
                "text": "USD",
                "value": "USD"
            }],
            Crypto: [{
                "text": "BTC",
                "value": "BTC"
            },
            {
                "text": "ETH",
                "value": "ETH"
            },
            {
                "text": "LTC",
                "value": "LTC"
            }],
        });
    });

    it('Returns correct default currency when currency is passed', () => {
        const currencies_list = buildCurrenciesList(payout_currencies);
        expect(getDefaultCurrency(currencies_list, 'EUR')).to.eql({
            "currency": "EUR",
        });
    });

    it('Returns first currency in currencies list when currency is not passed', () => {
        const currencies_list = buildCurrenciesList(payout_currencies);
        expect(getDefaultCurrency(currencies_list)).to.eql({
            "currency": "AUD",
        });
    });
});
