import React from 'react';

const DatePicker = ({
    name,
    onChange,
}) => (
    // TO-DO: Return amount of days instead of time
    <input type='date' name={name} onChange={onChange} />
);

const TimePicker = ({
    name,
    onChange,
}) => (
    <input type='time' name={name} onChange={onChange} />
);

module.exports = {
    Select,
    DatePicker,
    TimePicker,
};
