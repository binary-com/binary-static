import classNames               from 'classnames';
import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import PropTypes                from 'prop-types';
import React                    from 'react';
import {
    addComma,
    getDecimalPlaces }          from '_common/base/currency_base';
import { localize }             from '_common/localize';
import Dropdown                 from 'App/Components/Form/DropDown';
import Fieldset                 from 'App/Components/Form/fieldset.jsx';
import InputField               from 'App/Components/Form/input_field.jsx';

const Amount = ({
    amount,
    basis,
    basis_list,
    currencies_list,
    currency,
    is_minimized,
    is_nativepicker,
    onChange,
    validation_errors,
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
    const has_currency = currency;
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
                    error_messages = {validation_errors.amount}
                    fractional_digits={getDecimalPlaces(currency)}
                    is_float
                    is_nativepicker={is_nativepicker}
                    max_length={10}
                    name='amount'
                    onChange={onChange}
                    prefix={has_currency ? currency : null}
                    type='number'
                    value={amount}
                />
            </div>
        </Fieldset>
    );
};

Amount.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    basis            : PropTypes.string,
    basis_list       : MobxPropTypes.arrayOrObservableArray,
    currencies_list  : PropTypes.object,
    currency         : PropTypes.string,
    is_minimized     : PropTypes.bool,
    is_nativepicker  : PropTypes.bool,
    onChange         : PropTypes.func,
    validation_errors: PropTypes.object,
};

export default observer(Amount);
