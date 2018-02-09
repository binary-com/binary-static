import React from 'react';
import { InputField } from './form/text_field.jsx';
import Dropdown from './form/selectbox.jsx';
import { connect } from '../store/connect';
import Client from '../../../../app/base/client';
import { localize } from '../../../../_common/localize';

const Currencies = ({ list }) => (
    Object.keys(list).map((type, idx) => (
        <React.Fragment key={idx}>
            <optgroup key={idx} label={type}></optgroup>
            {list[type].map(cur => (
                <option key={cur} value={cur}>{cur}</option>
            ))}
        </React.Fragment>
    ))
);

const Amount = ({
    basis,
    currency,
    currencies_list,
    amount,
    onChange,
}) => (
        <fieldset>
            <Dropdown
                list={[{name: localize('Payout'), value: 'payout'},
                       {name: localize('Stake'),  value: 'stake'}]}
                selected={basis}
                value={basis}
                name='basis'
                onChange={onChange}
            />

            {Client.get('currency') ?
                <span className={`symbols ${currency.toLowerCase()}`}></span> :
                <select name='currency' value={currency} onChange={onChange}>
                    <Currencies list={currencies_list} />
                </select>
            }

            <InputField
                type='number'
                name='amount'
                value={amount}
                onChange={onChange}
                is_currency
            />
        </fieldset>

);

export default connect(
    ({trade}) => ({
        basis          : trade.basis,
        currency       : trade.currency,
        currencies_list: trade.currencies_list,
        amount         : trade.amount,
        onChange       : trade.handleChange,
    })
)(Amount);
