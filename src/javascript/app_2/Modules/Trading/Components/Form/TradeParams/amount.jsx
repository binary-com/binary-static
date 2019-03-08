import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import {
    addComma,
    getDecimalPlaces }           from '_common/base/currency_base';
import ButtonToggleMenu          from 'App/Components/Form/button-toggle-menu.jsx';
import Dropdown                  from 'App/Components/Form/DropDown';
import Fieldset                  from 'App/Components/Form/fieldset.jsx';
import InputField                from 'App/Components/Form/InputField';
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
            <div className='fieldset-minimized fieldset-minimized__amount'>
                <span className='fieldset-minimized__basis'>{(basis_list.find(o => o.value === basis) || {}).text}</span>
                &nbsp;
                <i><span className={classNames('fieldset-minimized__currency', 'symbols', { [`symbols--${(currency || '').toLowerCase()}`]: currency })} /></i>
                {addComma(amount, 2)}
            </div>
        );
    }
    const amount_container_class = classNames({ 'three-columns': !is_single_currency });

    return (
        <Fieldset className='trade-container__fieldset'>
            <div className={amount_container_class}>
                <ButtonToggleMenu
                    buttons_arr={basis_list}
                    className='dropdown--no-margin'
                    name='basis'
                    onChange={onChange}
                    value={basis}
                />
                {!is_single_currency &&
                <Dropdown
                    className={classNames('no-margin', { 'trade-container__currency-options': !is_single_currency })}
                    classNameDisplay='trade-container__currency-options--display'
                    has_symbol
                    is_alignment_left
                    is_nativepicker={false}
                    list={currencies_list}
                    name='currency'
                    value={currency}
                    onChange={onChange}
                />
                }
                <InputField
                    className={classNames('trade-container__amount', { 'trade-container__amount--has-currency-options': !is_single_currency })}
                    classNameInlinePrefix='trade-container__currency'
                    classNameInput='trade-container__input'
                    currency={currency}
                    error_messages={validation_errors.amount}
                    fractional_digits={getDecimalPlaces(currency)}
                    id='amount'
                    inline_prefix={is_single_currency ? currency : null}
                    is_autocomplete_disabled
                    is_float
                    is_incrementable
                    is_nativepicker={is_nativepicker}
                    is_negative_disabled
                    max_length={10}
                    name='amount'
                    onChange={onChange}
                    type='tel'
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
