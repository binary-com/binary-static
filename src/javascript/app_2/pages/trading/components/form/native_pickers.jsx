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
        Object.keys(list).map((group, idx) => (
            <React.Fragment key={idx}>
                <optgroup key={idx} label={group}></optgroup>
                {list[group].map(v => (
                    <option key={v} value={v}>{v}</option>
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
