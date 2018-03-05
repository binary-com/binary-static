import React from 'react';

const Select = ({
    name,
    value,
    list,
    onChange,
}) => (
    <select name={name} value={value} onChange={onChange}>
        {Array.isArray(list) ?
          list.map((item, idx) => (
              <option key={idx} value={item.value}>{item.text}</option>
          ))
        :
        Object.keys(list).map(key => (
            <React.Fragment key={key}>
                <optgroup label={key}></optgroup>
                {list[key].map((item, idx) => (
                    <option key={idx} value={item.value}>{item.text}</option>
                ))}
            </React.Fragment>
        ))}
    </select>
);

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
