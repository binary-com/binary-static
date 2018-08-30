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
    helper,
    is_disabled,
    is_float,
    is_signed = false,
    label,
    max_length,
    name,
    onChange,
    placeholder,
    prefix,
    required,
    step = '0.01',
    type,
    value,
}) => {
    const has_error = error_messages && error_messages.length;

    const changeValue = (e) => {
        if (type === 'number') {
            const is_empty = !e.target.value || e.target.value === '';
            const signed_regex = is_signed ? '[\\+-]?' : '';

            const is_number = new RegExp(`^${signed_regex}(\\d*)?${is_float ? '(\\.\\d+)?' : ''}(?<=\\d)(?<!-0)$`)
                .test(e.target.value);

            const is_not_completed_number = is_float && new RegExp(`^${signed_regex}(\\.|\\d+\\.)?$`)
                .test(e.target.value);

            // This regex check whether there is any zero at the end of fractional part or not.
            const has_zero_at_end = new RegExp(`^${signed_regex}(\\d+)?\\.(\\d+)?[0]+$`)
                .test(e.target.value);

            if (is_number || is_empty) {
                e.target.value = is_empty || is_signed || has_zero_at_end ? e.target.value : +e.target.value;
            } else if (!is_not_completed_number) {
                e.target.value = value;
                return;
            }
        }

        onChange(e);
    };

    const input =
        <input
            className={classNames({error: has_error})}
            disabled={is_disabled}
            data-for={`error_tooltip_${name}`}
            data-tip
            maxLength={max_length}
            name={name}
            onChange={changeValue}
            placeholder={placeholder || undefined}
            required={required || undefined}
            step={is_float ? step : undefined}
            type={type === 'number' ? 'text' : type}
            value={value}
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
    className     : PropTypes.string,
    error_messages: MobxPropTypes.arrayOrObservableArray,
    helper        : PropTypes.bool,
    is_float      : PropTypes.bool,
    is_disabled   : PropTypes.string,
    is_signed     : PropTypes.bool,
    label         : PropTypes.string,
    max_length    : PropTypes.number,
    name          : PropTypes.string,
    onChange      : PropTypes.func,
    placeholder   : PropTypes.string,
    prefix        : PropTypes.string,
    required      : PropTypes.bool,
    step          : PropTypes.string,
    type          : PropTypes.string,
    value         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(InputField);
