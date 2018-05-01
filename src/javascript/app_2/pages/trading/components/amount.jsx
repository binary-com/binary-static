import React from 'react';
import classNames from 'classnames';
import Dropdown from '../../../components/form/dropdown.jsx';
import Fieldset from '../../../components/form/fieldset.jsx';
import InputField from '../../../components/form/input_field.jsx';
import Client from '../../../../app/base/client';
import { connect } from '../../../store/connect';
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
}) => {
    const has_currency = Client.get('currency');
    const amount_container_class = classNames('amount-container', {
        'has-currency': has_currency,
    });
    return (
        <Fieldset
            header={localize('Invest Amount')}
            icon='invest-amount'
            tooltip={localize('Text for Invest Amount goes here.')}
        >
            <div className={amount_container_class}>
                <Dropdown
                    list={basis_list}
                    value={basis}
                    name='basis'
                    onChange={onChange}
                />
                {!has_currency &&
                    <Dropdown
                        list={currencies_list}
                        value={currency}
                        name='currency'
                        onChange={onChange}
                    />
                }
                <InputField
                    type='number'
                    name='amount'
                    value={amount}
                    onChange={onChange}
                    is_currency
                    prefix={currency}
                />
            </div>
        </Fieldset>
    );
};

export default connect(
    ({trade}) => ({
        basis          : trade.basis,
        currency       : trade.currency,
        currencies_list: trade.currencies_list,
        amount         : trade.amount,
        onChange       : trade.handleChange,
    })
)(Amount);
