import React from 'react';
import ClockHeader from './elements/clock_header.jsx';
import Dropdown from './form/dropdown.jsx';
import TimePicker from './form/time_picker.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const StartDate = ({
    start_date,
    start_dates_list,
    start_time,
    server_time,
    onChange,
}) => (
    <fieldset>
        <ClockHeader time={server_time} header={localize('Start time')} />
        <Dropdown
            name='start_date'
            value={start_date}
            list={start_dates_list}
            onChange={onChange}
            type='date'
        />
        {start_date !== 'now' &&
            <React.Fragment>
                <TimePicker onChange={onChange} name='start_time' value={start_time} placeholder='12:00 pm'/>
            </React.Fragment>
        }
    </fieldset>
);

export default connect(
    ({trade}) => ({
        start_date      : trade.start_date,
        start_dates_list: trade.start_dates_list,
        start_time      : trade.start_time,
        server_time     : trade.server_time,
        onChange        : trade.handleChange,
    })
)(StartDate);
