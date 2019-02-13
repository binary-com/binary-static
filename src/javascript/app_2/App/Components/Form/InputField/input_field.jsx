import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import ExpandableInput           from './expandable_input.jsx';
import IncrementButtons          from './increment_buttons.jsx';
import Input                     from './input.jsx';
import Tooltip                   from '../../Elements/tooltip.jsx';

const InputField = ({
    checked,
    className,
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
    const has_error       = error_messages && error_messages.length;
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
        console.log(value);

        const increment_value = (+value) + 1;
        onChange({ target: { value: increment_value, name } });
    };

    const decrementValue = () => {
        if (!value || min_is_disabled) return;

        const decrement_value = (+value) - 1;
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
            checked={checked}
            has_error={has_error}
            is_disabled={is_disabled}
            name={name}
            data_value={data_value}
            data_tip={data_tip}
            fractional_digits={fractional_digits}
            id={id}
            max_length={max_length}
            is_incrementable={is_incrementable}
            onKeyPressed={onKeyPressed}
            changeValue={changeValue}
            onClick={onClick}
            placeholder={placeholder}
            is_read_only={is_read_only}
            required={required}
            type={type}
            display_value={display_value}
            is_autocomplete_disabled={is_autocomplete_disabled}
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

    return (
        <div
            className={`input-field ${className || ''} ${is_expandable ? (has_error ? 'expandable-input-container error' : 'expandable-input-container') : null}`}
        >
            {is_incrementable && type === 'number' && is_expandable && increment_buttons}
            <Tooltip alignment='left' message={has_error ? error_messages[0] : null }>
                {!!label &&
                <label htmlFor={name} className='input-label'>{label}</label>
                }
                {!!prefix &&
                <span className={`symbols ${is_expandable ? 'expandable-symbols' : null} ${prefix.toLowerCase()}`} />
                }
                {!!helper &&
                <span className='input-helper'>{helper}</span>
                }
                {!is_expandable && (is_incrementable && type === 'number' ? <React.Fragment>{increment_buttons}</React.Fragment> :
                    input)
                }
                {!!is_expandable && <ExpandableInput className={`expandable-${name}`}>{input}</ExpandableInput>}
            </Tooltip>
        </div>
    );
};

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
InputField.propTypes = {
    checked                 : PropTypes.number,
    className               : PropTypes.string,
    error_messages          : MobxPropTypes.arrayOrObservableArray,
    fractional_digits       : PropTypes.number,
    helper                  : PropTypes.string,
    id                      : PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled             : PropTypes.string,
    is_expandable           : PropTypes.bool,
    is_float                : PropTypes.bool,
    is_incrementable        : PropTypes.bool,
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
