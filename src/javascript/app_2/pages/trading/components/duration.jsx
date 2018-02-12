import React from 'react';
import InputField from './form/input_field.jsx';
import Dropdown from './form/dropdown.jsx';
import ClockHeader from './elements/clock_header.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const Duration = ({
    expiry_type,
    duration,
    duration_unit,
    duration_units_list,
    server_time,
    onChange,
}) => (
        <fieldset>
            <ClockHeader className='row-1 col-100' time={server_time} header={localize('Trade Duration')} />
            <Dropdown
                list={[
                    { text: localize('Duration'), value: 'duration' },
                    { text: localize('End Time'), value: 'endtime' },
                ]}
                value={expiry_type}
                name='expiry_type'
                onChange={onChange}
            />

            {expiry_type === 'duration' ?
                <React.Fragment>
                    <div className='duration-container'>
                        <InputField
                            type='number'
                            name='duration'
                            value={duration}
                            onChange={onChange}
                        />
                        <Dropdown
                            list={duration_units_list}
                            value={duration_unit}
                            name='duration_unit'
                            onChange={onChange}
                        />
                    </div>
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
        server_time        : trade.server_time,
        onChange           : trade.handleChange,
    })
)(Duration);
