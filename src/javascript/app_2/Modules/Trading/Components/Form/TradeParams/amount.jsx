import classNames               from 'classnames';
import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import PropTypes                from 'prop-types';
import React                    from 'react';
import Dropdown                 from '../../../../../App/Components/Form/dropdown.jsx';
import Fieldset                 from '../../../../../App/Components/Form/fieldset.jsx';
import InputField               from '../../../../../App/Components/Form/input_field.jsx';
import Client                   from '../../../../../../_common/base/client_base';
import { addComma }             from '../../../../../../_common/base/currency_base';
import { localize }             from '../../../../../../_common/localize';

const Amount = ({
    amount,
    basis,
    basis_list,
    currencies_list,
    currency,
    is_minimized,
    is_nativepicker,
    onChange,
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
    amount         : PropTypes.number,
    basis          : PropTypes.string,
    basis_list     : MobxPropTypes.arrayOrObservableArray,
    currencies_list: PropTypes.object,
    currency       : PropTypes.string,
    is_minimized   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    onChange       : PropTypes.func,
};

export default observer(Amount);
