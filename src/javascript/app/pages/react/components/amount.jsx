import React from 'react';
import { TextField } from './form/text_field.jsx';
import Client from '../../../base/client';
import { connect } from '../store/connect';

const Amount = ({
    basis,
    currency,
    currencies,
    amount,
    onBasisChange,
    onAmountChange,
    onCurrencyChange,
}) => (
        <fieldset>
            <select name='basis' value={basis} onChange={onBasisChange}>
                <option value='payout'>Payout</option>
                <option value='stake'>Stake</option>
            </select>

            {Client.get('currency') ?
                <span className={`symbols ${currency.toLowerCase()}`}></span> :
                <select name='currency' value={currency || currencies[0]} onChange={onCurrencyChange}>
                    {currencies.map((cur, idx) => (
                        <option key={idx} value={cur}>{cur}</option>
                    ))}
                </select>
            }

            <TextField name='amount' value={amount} onChange={onAmountChange} />
        </fieldset>
);

export default connect(
    ({trade}) => ({
        basis           : trade.basis,
        currency        : trade.currency,
        currencies      : ['USD', 'AUD', 'GBP', 'BTC'],
        amount          : trade.amount,
        onBasisChange   : trade.handleChange,
        onAmountChange  : trade.handleChange,
        onCurrencyChange: trade.handleChange,
    })
)(Amount);
