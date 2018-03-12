import React from 'react';
import InputField from './form/input_field.jsx';
import Dropdown from './form/dropdown.jsx';
import { connect } from '../store/connect';
import Client from '../../../../app/base/client';
import { localize } from '../../../../_common/localize';

const basis_list = [
    { text: localize('Payout'), value: 'payout' },
    { text: localize('Stake'),  value: 'stake' },
];

const Amount = ({
    basis,
    currency,
    currencies_list,
    amount,
    onChange,
    is_nativepicker,
}) => (
        <fieldset>
            <div className='fieldset-header'>
                <span className='field-info left'>{localize('Invest Amount')}</span>
            </div>
            <div className='amount-container'>
                <Dropdown
                    list={basis_list}
                    value={basis}
                    name='basis'
                    onChange={onChange}
                    is_nativepicker={is_nativepicker}
                />
                <InputField
                    type='number'
                    name='amount'
                    value={amount}
                    onChange={onChange}
                    is_currency
                    prefix={currency}
                />
            </div>

            {!Client.get('currency') &&
                <Dropdown
                    list={currencies_list}
                    value={currency}
                    name='currency'
                    onChange={onChange}
                    is_nativepicker={is_nativepicker}
                />
            }
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
