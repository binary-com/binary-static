import React from 'react';

export const MdcSelect = ({
    id,
    name,
    label,
    default_value,
    on_change,
    children,
}) => (
    <div id={id} className='mdc-select'>
        <select className='select-text' name={name} defaultValue={default_value} onChange={on_change}>
            {children}
        </select>
        <span className='select-highlight'></span>
        <span className='select-bar'></span>
        {label ?
        <label className='select-label'>{label}</label>
        :
        undefined
        }
    </div>

);

export default MdcSelect;
