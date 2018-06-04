import React        from 'react';
import PropTypes    from 'prop-types';
import Dropdown     from '../../../components/form/dropdown.jsx';
import Fieldset     from '../../../components/form/fieldset.jsx';
import InputField   from '../../../components/form/input_field.jsx';
import { connect }  from '../../../store/connect';
import Client       from '../../../../_common/base/client_base';
import { addComma } from '../../../../_common/base/currency_base';
import { localize } from '../../../../_common/localize';

const basis_list = [
    { text: localize('Payout'), value: 'payout' },
    { text: localize('Stake'),  value: 'stake' },
];

// To Do: Refactor Amount.jsx
const Amount = ({
    basis,
    currency,
    currencies_list,
    amount,
    onChange,
    is_minimized,
    is_nativepicker,
}) => {
    if (is_minimized) {
        return (
            <div className='fieldset-minimized amount'>
                <span className='icon invest-amount' />
                <span className='fieldset-minimized__basis'>{(basis_list.find(o => o.value === basis) || {}).text}</span>
                &nbsp;
                <i><span className={`symbols ${(currency || '').toLowerCase()}`} /></i>
                {addComma(amount, 2)}
            </div>
        );
    }
    return (
        <Fieldset
            header={localize('Invest Amount')}
            icon='invest-amount'
            tooltip={localize('Text for Invest Amount goes here.')}
        >
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
                    is_nativepicker={is_nativepicker}
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
        </Fieldset>
    );
};

// To Do: change amount's prop type from string to number.
Amount.propTypes = {
    amount         : PropTypes.number,
    basis          : PropTypes.string,
    currencies_list: PropTypes.object,
    currency       : PropTypes.string,
    is_minimized   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    onChange       : PropTypes.func,
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
