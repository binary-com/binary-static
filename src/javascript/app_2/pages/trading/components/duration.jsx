import React from 'react';
import { TextField } from './form/text_field.jsx';
import { connect } from '../store/connect';

const Duration = ({
    expiry_type,
    duration,
    duration_unit,
    units,
    onExpiryTypeChange,
    onExpiryDateChange,
    onExpiryTimeChange,
    onDurationChange,
    onDurationUnitChange,
}) =>  (
        <fieldset>
            <select name='expiry_type' value={expiry_type} onChange={onExpiryTypeChange}>
                <option value='duration'>Duration</option>
                <option value='endtime'>End Time</option>
            </select>

            {expiry_type === 'duration' ?
                <React.Fragment>
                    <TextField name='duration' value={duration} onChange={onDurationChange} />
                    <select name='duration_unit' value={duration_unit} onChange={onDurationUnitChange}>
                        {Object.keys(units).map((u) => (
                            <option key={u} value={u}>{units[u]}</option>
                        ))}
                    </select>
                </React.Fragment> :
                <React.Fragment>
                    <input type='date' name='expiry_date' onChange={onExpiryDateChange} />
                    <input type='time' name='expiry_time' onChange={onExpiryTimeChange} />
                </React.Fragment>
            }
        </fieldset>
);

export default connect(
    ({trade}) => ({
        expiry_type  : trade.expiry_type,
        duration     : trade.duration,
        duration_unit: trade.duration_unit,
        units        : {
            t: 'ticks',
            s: 'seconds',
            m: 'minutes',
            h: 'hours',
            d: 'days',
        },
        onExpiryTypeChange  : trade.handleChange,
        onExpiryDateChange  : trade.handleChange,
        onExpiryTimeChange  : trade.handleChange,
        onDurationChange    : trade.handleChange,
        onDurationUnitChange: trade.handleChange,
    })
)(Duration);
