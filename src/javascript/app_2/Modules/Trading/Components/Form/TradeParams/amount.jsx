import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import {
    addComma,
    getDecimalPlaces }           from '_common/base/currency_base';
import ButtonToggleMenu          from 'App/Components/Form/ButtonToggleMenu';
import Dropdown                  from 'App/Components/Form/DropDown';
import Fieldset                  from 'App/Components/Form/fieldset.jsx';
import InputField                from 'App/Components/Form/InputField';
import AllowEquals               from './allow-equals.jsx';

const Amount = ({
    amount,
    basis,
    basis_list,
    contract_start_type,
    contract_type,
    contract_types_list,
    currencies_list,
    currency,
    duration_unit,
    expiry_type,
    is_equal,
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

    const input =
        <InputField
            className='trade-container__amount'
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
        />;

    return (
        <Fieldset className='trade-container__fieldset'>
            <ButtonToggleMenu
                buttons_arr={basis_list}
                className='dropdown--no-margin'
                is_animated={true}
                name='basis'
                onChange={onChange}
                value={basis}
            />
            {!is_single_currency ?
                <div className='trade-container__currency-options'>
                    <Dropdown
                        className={classNames({ 'trade-container__currency-options-dropdown': !is_single_currency })}
                        classNameDisplay='trade-container__currency-options--display'
                        has_symbol
                        is_alignment_left
                        is_nativepicker={false}
                        list={currencies_list}
                        name='currency'
                        value={currency}
                        onChange={onChange}
                    />
                    {input}
                </div>
                :
                input

            }
            <AllowEquals
                contract_start_type={contract_start_type}
                contract_type={contract_type}
                contract_types_list={contract_types_list}
                duration_unit={duration_unit}
                expiry_type={expiry_type}
                onChange={onChange}
                value={parseInt(is_equal)}
            />
        </Fieldset>
    );
};

Amount.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    basis              : PropTypes.string,
    basis_list         : MobxPropTypes.arrayOrObservableArray,
    contract_start_type: PropTypes.string,
    contract_type      : PropTypes.string,
    contract_types_list: MobxPropTypes.observableObject,
    currencies_list    : MobxPropTypes.observableObject,
    currency           : PropTypes.string,
    duration_unit      : PropTypes.string,
    expiry_type        : PropTypes.string,
    is_equal           : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    is_minimized      : PropTypes.bool,
    is_nativepicker   : PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange          : PropTypes.func,
    validation_errors : PropTypes.object,
};

export default observer(Amount);
