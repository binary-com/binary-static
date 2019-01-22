import React from 'react';

export const PickerInput = ({
    onClick,
    onChange,
    placeholder,
    value,
}) => (
    <InputField
        className='datepicker__input'
        data-tip={false}
        data-value={value || undefined}
        error_messages={this.props.validation_errors}
        is_read_only={this.props.is_read_only}
        name={this.props.name}
        onClick={onClick}
        onChange={onChange || undefined} // TODO: handle duration == days
        placeholder={placeholder}
        type='number'
        value={value}
    />
);