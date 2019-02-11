import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const Input = ({
    changeValue,
    checked,
    data_tip,
    data_value,
    fractional_digits,
    has_error,
    id,
    is_autocomplete_disabled,
    is_disabled,
    is_float,
    is_incrementable,
    is_read_only,
    is_signed,
    is_unit_at_right,
    max_length,
    name,
    onClick,
    onKeyPressed,
    placeholder,
    required,
    type,
    unit,
    unit_label,
    value,
}) => {
    let display_value = value;

    if (unit) {
        display_value = is_unit_at_right ? `${value} ${unit}` : `${unit} ${value}`;
    }

    const props = {
        className: classNames({ error: has_error, 'unit-label': !!unit_label }),
    };

    const input =
        <input
            autoComplete={is_autocomplete_disabled ? 'off' : undefined}
            checked={checked ? 'checked' : ''}
            data-for={`error_tooltip_${name}`}
            data-tip={data_tip}
            data-value={data_value}
            disabled={is_disabled}
            id={id}
            maxLength={fractional_digits ? max_length + fractional_digits + 1 : max_length}
            name={name}
            onChange={changeValue}
            onClick={onClick}
            onKeyDown={is_incrementable ? onKeyPressed : undefined}
            placeholder={placeholder || undefined}
            readOnly={is_read_only}
            required={required || undefined}
            type={type === 'number' ? 'text' : type}
            value={display_value || ''}
            {...props}
        />;


    return (
        <React.Fragment>
            {!!unit_label && <label id={`${name}-label`} htmlFor={name} {...props}>{unit_label} {input}</label> }
            {!unit_label && input }
        </React.Fragment>
    );
};

Input.propTypes = {
    changeValue             : PropTypes.func,
    checked                 : PropTypes.string,
    data_tip                : PropTypes.string,
    data_value              : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    fractional_digits       : PropTypes.number,
    has_error               : PropTypes.bool,
    id                      : PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled             : PropTypes.bool,
    is_float                : PropTypes.bool,
    is_incrementable        : PropTypes.bool,
    is_read_only            : PropTypes.bool,
    is_signed               : PropTypes.bool,
    is_unit_at_right        : PropTypes.bool,
    max_length              : PropTypes.number,
    name                    : PropTypes.string,
    onClick                 : PropTypes.func,
    onKeyPressed            : PropTypes.func,
    placeholder             : PropTypes.string,
    required                : PropTypes.bool,
    type                    : PropTypes.string,
    unit                    : PropTypes.string,
    unit_label              : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    value                   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Input;
