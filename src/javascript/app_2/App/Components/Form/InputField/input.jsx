import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';

const Input = ({
                   checked,
                   has_error,
                   is_disabled,
                   name,
                   data_value,
                   data_tip,
                   fractional_digits,
                   id,
                   max_length,
                   is_incrementable,
                   onKeyPressed,
                   changeValue,
                   onClick,
                   placeholder,
                   is_read_only,
                   required,
                   type,
                   display_value,
                   is_autocomplete_disabled,
               }) => {
    return (
        <input
            checked={checked ? 'checked' : ''}
            className={classNames({ error: has_error })}
            disabled={is_disabled}
            data-for={`error_tooltip_${name}`}
            data-value={data_value}
            data-tip={data_tip}
            id={id}
            maxLength={fractional_digits ? max_length + fractional_digits + 1 : max_length}
            name={name}
            onKeyDown={is_incrementable ? onKeyPressed : undefined}
            onChange={changeValue}
            onClick={onClick}
            placeholder={placeholder || undefined}
            readOnly={is_read_only}
            required={required || undefined}
            type={type === 'number' ? 'text' : type}
            value={display_value || ''}
            autoComplete={is_autocomplete_disabled ? 'off' : undefined}
        />
    );
};

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
Input.propTypes = {
    has_error              :PropTypes.bool,
    data_value             : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    data_tip                : PropTypes.string,
    onKeyPressed            : PropTypes.func,
    changeValue             : PropTypes.func,
    display_value           : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    checked                 : PropTypes.number,
    fractional_digits       : PropTypes.number,
    id                      : PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled             : PropTypes.string,
    is_incrementable        : PropTypes.bool,
    is_read_only            : PropTypes.bool,
    max_length              : PropTypes.number,
    name                    : PropTypes.string,
    onClick                 : PropTypes.func,
    placeholder             : PropTypes.string,
    required                : PropTypes.bool,
    type                    : PropTypes.string,
    value                   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(Input);
