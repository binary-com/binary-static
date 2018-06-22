import React        from 'react';
import PropTypes    from 'prop-types';
import classNames   from 'classnames';
import Dropdown     from '../../../components/form/dropdown.jsx';
import Fieldset     from '../../../components/form/fieldset.jsx';
import InputField   from '../../../components/form/input_field.jsx';
import { connect }  from '../../../store/connect';
import Client       from '../../../../_common/base/client_base';
import { addComma } from '../../../../_common/base/currency_base';
import { localize } from '../../../../_common/localize';

const Amount = ({
    basis_list,
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
    const has_currency = Client.get('currency');
    const amount_container_class = classNames('amount-container', {
        'three-columns': !has_currency,
    });
    return (
        <Fieldset
            header={localize('Invest Amount')}
            icon='invest-amount'
        >
            <div className={amount_container_class}>
                <Dropdown
                    list={basis_list}
                    value={basis}
                    name='basis'
                    onChange={onChange}
                    is_nativepicker={is_nativepicker}
                />
                {!has_currency &&
                    <Dropdown
                        list={currencies_list}
                        value={currency}
                        name='currency'
                        onChange={onChange}
                        is_nativepicker={is_nativepicker}
                    />
                }
                <InputField
                    type='number'
                    name='amount'
                    value={amount}
                    onChange={onChange}
                    is_currency
                    prefix={has_currency ? currency : null}
                    is_nativepicker={is_nativepicker}
                />
            </div>
        </Fieldset>
    );
};

Amount.propTypes = {
    basis_list     : PropTypes.array,
    amount         : PropTypes.number,
    basis          : PropTypes.string,
    currencies_list: PropTypes.object,
    currency       : PropTypes.string,
    is_minimized   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    onChange       : PropTypes.func,
};

export default connect(
    ({ trade }) => ({
        basis_list     : trade.basis_list,
        basis          : trade.basis,
        currency       : trade.currency,
        currencies_list: trade.currencies_list,
        amount         : trade.amount,
        onChange       : trade.handleChange,
    })
)(Amount);
