import React from 'react';
import { InputField } from './form/text_field.jsx';
import Dropdown from './form/selectbox.jsx';
import Datepicker from './form/datepicker.jsx';
import ClockHeader from './elements/clock_header.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const Duration = ({
    expiry_type,
    duration,
    duration_unit,
    duration_units_list,
    onChange,
    onSelectChange,
}) => (
        <fieldset>
            <ClockHeader header={localize('Trade Duration')} />
            <Dropdown list={[{name: localize('Duration'), value: 'duration'},
                             {name: localize('End Time'),  value: 'endtime'}]}
                      selected={expiry_type}
                      value={expiry_type}
                      name='expiry_type'
                      on_change={onSelectChange}
            />

            {expiry_type === 'duration' ?
                <React.Fragment>
                    <InputField type='number' name='duration' value={duration} on_change={onChange} />
                    <select name='duration_unit' value={duration_unit} onChange={onChange}>
                        {Object.keys(duration_units_list).map((u) => (
                            <option key={u} value={u}>{duration_units_list[u]}</option>
                        ))}
                    </select>
                </React.Fragment> :
                <React.Fragment>
                    <Datepicker
                        name='expiry_date'
                        onChange={onChange}
                        showTodayBtn={true}
                        minDate={new Date()}
                    />
                    {/*
                        <input type='date' name='expiry_date' onChange={onChange} />
                    */}
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
        onSelectChange     : trade.handleDropDownChange,
    })
)(Duration);
