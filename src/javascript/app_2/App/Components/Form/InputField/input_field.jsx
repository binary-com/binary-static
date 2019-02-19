import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import { isCryptocurrency }      from '_common/base/currency_base';
import ExpandableInput           from './expandable_input.jsx';
import IncrementButtons          from './increment_buttons.jsx';
import Input                     from './input.jsx';
import Tooltip                   from '../../Elements/tooltip.jsx';

const InputField = ({
    checked,
    className,
    classNameInput,
    classNamePrefix,
    currency,
    data_tip,
    data_value,
    error_messages,
    fractional_digits,
    helper,
    id,
    is_autocomplete_disabled,
    is_disabled,
    is_expandable,
    is_float,
    is_incrementable,
    is_negative_disabled,
    is_read_only = false,
    is_signed = false,
    is_unit_at_right = false,
    label,
    max_length,
    max_value,
    min_value,
    name,
    onChange,
    onClick,
    placeholder,
    prefix,
    required,
    type,
    unit,
    value,
}) => {
    const has_error       = error_messages && !!error_messages.length;
    let has_valid_length  = true;
    const max_is_disabled = max_value && +value >= +max_value;
    const min_is_disabled = min_value && +value <= +min_value;

    const changeValue = (e) => {
        if (unit) {
            e.target.value = e.target.value.replace(unit, '').trim();
        }

        if (e.target.value === value && type !== 'checkbox') {
            return;
        }

        if (type === 'number') {
            const is_empty = !e.target.value || e.target.value === '' || e.target.value === '  ';
            const signed_regex = is_signed ? '[\+\-\.0-9]$' : '^';

            const is_number = new RegExp(`${signed_regex}(\\d*)?${is_float ? '(\\.\\d+)?' : ''}$`)
                .test(e.target.value);

            const is_not_completed_number = is_float && new RegExp(`${signed_regex}(\\.|\\d+\\.)?$`)
                .test(e.target.value);

            // This regex check whether there is any zero at the end of fractional part or not.
            const has_zero_at_end = new RegExp(`${signed_regex}(\\d+)?\\.(\\d+)?[0]+$`)
                .test(e.target.value);

            const is_scientific_notation = /e/.test(`${+e.target.value}`);

            if (max_length && fractional_digits) {
                has_valid_length = new RegExp(`${signed_regex}(\\d{0,${max_length}})(\\.\\d{0,${fractional_digits}})?$`)
                    .test(e.target.value);
            }

            if ((is_number || is_empty) && has_valid_length) {
                e.target.value = is_empty || is_signed || has_zero_at_end || is_scientific_notation
                    ? e.target.value
                    : +e.target.value;
            } else if (!is_not_completed_number) {
                e.target.value = value;
                return;
            }
        }

        onChange(e);
    };

    const incrementValue = () => {
        if (max_is_disabled) return;
        let increment_value;
        const is_crypto = isCryptocurrency(currency);
        if (is_crypto) {
            const new_value = parseFloat(+value) + parseFloat(1 * 10 ** (0 - fractional_digits));
            increment_value =
                parseFloat(new_value).toFixed(fractional_digits);
        } else {
            increment_value =
                parseFloat((+value) + 1).toFixed(fractional_digits);
        }
        onChange({ target: { value: increment_value, name } });
    };

    const decrementValue = () => {
        if (!value || min_is_disabled) return;
        let decrement_value;
        const is_crypto = isCryptocurrency(currency);
        if (is_crypto) {
            const new_value = parseFloat(+value) - parseFloat(1 * 10 ** (0 - fractional_digits));
            decrement_value = parseFloat(new_value).toFixed(fractional_digits);
        } else {
            decrement_value = parseFloat((+value) - 1).toFixed(fractional_digits);
        }
        if (is_negative_disabled && decrement_value < 0) return;
        onChange({ target: { value: decrement_value, name } });
    };

    const onKeyPressed = (e) => {
        if (e.keyCode === 38) incrementValue(); // up-arrow pressed
        if (e.keyCode === 40) decrementValue(); // down-arrow pressed
    };

    let display_value = value;

    if (unit) {
        display_value = is_unit_at_right ? `${value} ${unit}` : `${unit} ${value}`;
    }

    const input =
        <Input
            changeValue={changeValue}
            checked={checked}
            className={classNameInput}
            data_tip={data_tip}
            data_value={data_value}
            display_value={display_value}
            fractional_digits={fractional_digits}
            has_error={has_error}
            id={id}
            is_autocomplete_disabled={is_autocomplete_disabled}
            is_disabled={is_disabled}
            is_incrementable={is_incrementable}
            is_read_only={is_read_only}
            max_length={max_length}
            name={name}
            onClick={onClick}
            onKeyPressed={onKeyPressed}
            placeholder={placeholder}
            required={required}
            type={type}
        />;

    const increment_buttons =
        <div className='input-wrapper'>
            <IncrementButtons
                max_is_disabled={max_is_disabled}
                incrementValue={incrementValue}
                min_is_disabled={min_is_disabled}
                decrementValue={decrementValue}
            />
            {!is_expandable && input }
        </div>;

    const input_tooltip =
        <Tooltip alignment='left' message={has_error ? error_messages[0] : null }>
            {!!label &&
            <label htmlFor={name} className='input-label'>{label}</label>
            }
            {!!prefix &&
            <span className={classNames(classNamePrefix, 'symbols', prefix.toLowerCase(), { 'expandable-symbols': is_expandable })} />
            }
            {!!helper &&
            <span className='input-helper'>{helper}</span>
            }
            {!is_expandable &&
            (is_incrementable && type === 'number' ? <React.Fragment>{increment_buttons}</React.Fragment> : input)
            }
            {is_expandable &&
            <ExpandableInput
                input_class={`expandable-${name}`}
                input_resizer_class={`expandable-${name}-resizer`}
            >
                {input}
            </ExpandableInput>
            }
        </Tooltip>;

    const expandableInputWrapper = (<label htmlFor={id} className='expandable-input-wrapper'>{input_tooltip}</label>);

    return (
        <div
            className={`input-field ${className || ''} ${is_expandable ? (has_error ? 'expandable-input-container error' : 'expandable-input-container') : null}`}
        >
            {is_incrementable && type === 'number' && is_expandable && increment_buttons}
            {is_expandable ? expandableInputWrapper : input_tooltip}
        </div>
    );
};

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
InputField.propTypes = {
    checked                 : PropTypes.number,
    className               : PropTypes.string,
    classNameInput          : PropTypes.string,
    classNamePrefix         : PropTypes.string,
    currency                : PropTypes.string,
    error_messages          : MobxPropTypes.arrayOrObservableArray,
    fractional_digits       : PropTypes.number,
    helper                  : PropTypes.string,
    id                      : PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled             : PropTypes.string,
    is_expandable           : PropTypes.bool,
    is_float                : PropTypes.bool,
    is_incrementable        : PropTypes.bool,
    is_negative_disabled    : PropTypes.bool,
    is_read_only            : PropTypes.bool,
    is_signed               : PropTypes.bool,
    is_unit_at_right        : PropTypes.bool,
    label                   : PropTypes.string,
    max_length              : PropTypes.number,
    name                    : PropTypes.string,
    onChange                : PropTypes.func,
    onClick                 : PropTypes.func,
    placeholder             : PropTypes.string,
    prefix                  : PropTypes.string,
    required                : PropTypes.bool,
    type                    : PropTypes.string,
    unit                    : PropTypes.string,
    value                   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(InputField);
