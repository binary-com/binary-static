import React from 'react';
import moment from 'moment';
import InputField from './form/input_field.jsx';
import Dropdown from './form/dropdown.jsx';
import Datepicker from './form/date_picker.jsx';
import TimePicker from './form/time_picker.jsx';
import ClockHeader from './elements/clock_header.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const expiry_list = [
    { text: localize('Duration'), value: 'duration' },
    { text: localize('End Time'), value: 'endtime' },
];

const Duration = ({
    expiry_type,
    expiry_time,
    duration,
    duration_unit,
    duration_units_list,
    server_time,
    onChange,
}) => (
        <fieldset>
            <ClockHeader time={server_time} header={localize('Trade Duration')} />
            <Dropdown
                list={expiry_list}
                value={expiry_type}
                name='expiry_type'
                onChange={onChange}
            />

            {expiry_type === 'duration' ?
                <React.Fragment>
                    <div className='duration-container'>
                        {duration_unit === 'd' ?
                            <Datepicker
                                name='duration'
                                minDate={moment(server_time).add(1, 'd')}
                                maxDate={moment(server_time).add(365, 'd')}
                                displayFormat='d'
                                onChange={onChange}
                            /> :
                            <InputField
                                type='number'
                                name='duration'
                                value={duration}
                                onChange={onChange}
                            />
                        }
                        <Dropdown
                            list={duration_units_list}
                            value={duration_unit}
                            name='duration_unit'
                            onChange={onChange}
                        />
                    </div>
                </React.Fragment> :
                <React.Fragment>
                    <Datepicker
                        name='expiry_date'
                        showTodayBtn={true}
                        minDate={moment(server_time)}
                        onChange={onChange}
                    />
                    <TimePicker onChange={onChange} name='expiry_time' value={expiry_time} placeholder='12:00 pm' />
                </React.Fragment>
            }
        </fieldset>
);

export default connect(
    ({trade}) => ({
        expiry_type        : trade.expiry_type,
        expiry_time        : trade.expiry_time,
        duration           : trade.duration,
        duration_unit      : trade.duration_unit,
        duration_units_list: trade.duration_units_list,
        server_time        : trade.server_time,
        onChange           : trade.handleChange,
    })
)(Duration);
