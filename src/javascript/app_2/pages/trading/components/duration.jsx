import React from 'react';
import { TextField } from './form/text_field.jsx';
import { connect } from '../store/connect';

const Duration = ({
    expiry_type,
    duration,
    duration_unit,
    duration_units_list,
    onChange,
}) =>  (
        <fieldset>
            <select name='expiry_type' value={expiry_type} onChange={onChange}>
                <option value='duration'>Duration</option>
                <option value='endtime'>End Time</option>
            </select>

            {expiry_type === 'duration' ?
                <React.Fragment>
                    <TextField name='duration' value={duration} onChange={onChange} />
                    <select name='duration_unit' value={duration_unit} onChange={onChange}>
                        {Object.keys(duration_units_list).map((u) => (
                            <option key={u} value={u}>{duration_units_list[u]}</option>
                        ))}
                    </select>
                </React.Fragment> :
                <React.Fragment>
                    <input type='date' name='expiry_date' onChange={onChange} />
                    <input type='time' name='expiry_time' onChange={onChange} />
                </React.Fragment>
            }
        </fieldset>
);

export default connect(
    ({trade}) => ({
        expiry_type        : trade.expiry_type,
        duration           : trade.duration,
        duration_unit      : trade.duration_unit,
        duration_units_list: trade.duration_units_list,
        onChange           : trade.handleChange,
    })
)(Duration);
