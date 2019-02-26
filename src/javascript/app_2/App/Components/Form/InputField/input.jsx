import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const Input = ({
    changeValue,
    checked,
    className,
    data_value,
    data_tip,
    display_value,
    fractional_digits,
    id,
    is_autocomplete_disabled,
    is_disabled,
    is_incrementable,
    is_read_only,
    max_length,
    name,
    onClick,
    onKeyPressed,
    placeholder,
    required,
    type,
}) => (
    <input
        autoComplete={is_autocomplete_disabled ? 'off' : undefined}
        checked={checked ? 'checked' : ''}
        className={className}
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
    />
);

Input.propTypes = {
    changeValue: PropTypes.func,
    checked    : PropTypes.number,
    className  : PropTypes.string,
    data_tip   : PropTypes.string,
    data_value : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    display_value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    fractional_digits       : PropTypes.number,
    id                      : PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled             : PropTypes.string,
    is_incrementable        : PropTypes.bool,
    is_read_only            : PropTypes.bool,
    max_length              : PropTypes.number,
    name                    : PropTypes.string,
    onClick                 : PropTypes.func,
    onKeyPressed            : PropTypes.func,
    placeholder             : PropTypes.string,
    required                : PropTypes.bool,
    type                    : PropTypes.string,
    value                   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(Input);
