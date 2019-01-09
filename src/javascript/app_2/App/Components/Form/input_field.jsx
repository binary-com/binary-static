import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import Tooltip                   from '../Elements/tooltip.jsx';

const InputField = ({
    className,
    error_messages,
    fractional_digits,
    helper,
    is_disabled,
    is_float,
    is_read_only = false,
    is_signed = false,
    label,
    max_length,
    name,
    onChange,
    onClick,
    placeholder,
    prefix,
    required,
    type,
    value,
}) => {
    const has_error = error_messages && error_messages.length;
    let has_valid_length = true;

    const changeValue = (e) => {
        if (type === 'number') {
            const is_empty = !e.target.value || e.target.value === '';
            const signed_regex = is_signed ? '(?!^([-+]0)$|^[-+]?$)^[+-]?' : '^';

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

    const input =
        <input
            className={classNames({ error: has_error })}
            disabled={is_disabled}
            data-for={`error_tooltip_${name}`}
            data-tip
            maxLength={fractional_digits ? max_length + fractional_digits + 1 : max_length}
            name={name}
            onChange={changeValue}
            onClick={onClick}
            placeholder={placeholder || undefined}
            readOnly={is_read_only}
            required={required || undefined}
            type={type === 'number' ? 'text' : type}
            value={value || ''}
        />;

    return (
        <div
            className={`input-field ${className || ''}`}
        >
            <Tooltip alignment='left' message={has_error ? error_messages[0] : null }>
                {!!label &&
                    <label htmlFor={name} className='input-label'>{label}</label>
                }
                {!!prefix &&
                    <i><span className={`symbols ${prefix.toLowerCase()}`} /></i>
                }
                {!!helper &&
                    <span className='input-helper'>{helper}</span>
                }
                { input }
            </Tooltip>
        </div>
    );
};

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
InputField.propTypes = {
    className        : PropTypes.string,
    error_messages   : MobxPropTypes.arrayOrObservableArray,
    fractional_digits: PropTypes.number,
    helper           : PropTypes.bool,
    is_disabled      : PropTypes.string,
    is_float         : PropTypes.bool,
    is_read_only     : PropTypes.bool,
    is_signed        : PropTypes.bool,
    label            : PropTypes.string,
    max_length       : PropTypes.number,
    name             : PropTypes.string,
    onChange         : PropTypes.func,
    onClick          : PropTypes.func,
    placeholder      : PropTypes.string,
    prefix           : PropTypes.string,
    required         : PropTypes.bool,
    type             : PropTypes.string,
    value            : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(InputField);
