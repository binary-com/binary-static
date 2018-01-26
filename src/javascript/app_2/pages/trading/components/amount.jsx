import React from 'react';
import { MdcTextField } from './form/text_field.jsx';
import { MdcSelect } from './form/select_box.jsx';
import { connect } from '../store/connect';
import Client from '../../../../app/base/client';

const Amount = ({
    basis,
    currency,
    currencies,
    amount,
    onBasisChange,
    onAmountChange,
    onCurrencyChange,
}) => (
        <fieldset className='shadow-1'>
            <div className='gr-row'>
                <div className='gr-12'>
                    <MdcSelect name='basis' default_value={basis} on_change={onBasisChange}>
                        <option value='payout'>Payout</option>
                        <option value='stake'>Stake</option>
                    </MdcSelect>
                </div>
                <div className='gr-6'>
                {Client.get('currency') ?
                    <span className={`symbols ${currency.toLowerCase()}`}></span> :
                    <MdcSelect name='currency' default_value={currency || currencies[0]} on_change={onCurrencyChange}>
                        {currencies.map((cur, idx) => (
                            <option key={idx} value={cur}>{cur}</option>
                        ))}
                    </MdcSelect>
                }
                </div>
                <div className='gr-6'>
                    <MdcTextField type='text' name='amount' value={amount} on_change={onAmountChange} />
                </div>
            </div>
        </fieldset>
);

export default connect(
    ({trade}) => ({
        basis           : trade.basis,
        currency        : trade.currency,
        currencies      : trade.currencies,
        amount          : trade.amount,
        onBasisChange   : trade.handleChange,
        onAmountChange  : trade.handleChange,
        onCurrencyChange: trade.handleChange,
    })
)(Amount);
