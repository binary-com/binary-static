import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import {
    addComma,
    getDecimalPlaces }           from '_common/base/currency_base';
import Dropdown                  from 'App/Components/Form/DropDown';
import Fieldset                  from 'App/Components/Form/fieldset.jsx';
import InputField                from 'App/Components/Form/input_field.jsx';
import AllowEquals               from './allow-equals.jsx';

const Amount = ({
    amount,
    basis,
    basis_list,
    currencies_list,
    currency,
    is_allow_equal,
    is_equal_checked,
    is_minimized,
    is_nativepicker,
    is_single_currency,
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
    const amount_container_class = classNames({ 'three-columns': !is_single_currency });

    return (
        <Fieldset className='trade-container__fieldset'>
            <div className={amount_container_class}>
                <Dropdown
                    is_alignment_left
                    is_nativepicker={is_nativepicker}
                    list={basis_list}
                    name='basis'
                    value={basis}
                    onChange={onChange}
                    className='no-margin'
                />
                {!is_single_currency &&
                    <Dropdown
                        is_alignment_left
                        is_nativepicker={is_nativepicker}
                        list={currencies_list}
                        name='currency'
                        value={currency}
                        onChange={onChange}
                    />
                }
                <InputField
                    classNameInput='trade-container__input'
                    classNamePrefix='trade-container__currency'
                    error_messages={validation_errors.amount}
                    fractional_digits={getDecimalPlaces(currency)}
                    is_autocomplete_disabled
                    is_float
                    is_nativepicker={is_nativepicker}
                    max_length={10}
                    name='amount'
                    onChange={onChange}
                    prefix={is_single_currency ? currency : null}
                    type='number'
                    value={amount}
                />
            </div>
            <AllowEquals is_allow_equal={is_allow_equal} onChange={onChange} checked={is_equal_checked} />
        </Fieldset>
    );
};

Amount.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    basis             : PropTypes.string,
    basis_list        : MobxPropTypes.arrayOrObservableArray,
    currencies_list   : MobxPropTypes.observableObject,
    currency          : PropTypes.string,
    is_allow_equal    : PropTypes.bool,
    is_equal_checked  : PropTypes.number,
    is_minimized      : PropTypes.bool,
    is_nativepicker   : PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange          : PropTypes.func,
    validation_errors : PropTypes.object,
};

export default observer(Amount);
