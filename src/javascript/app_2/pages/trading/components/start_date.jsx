import React from 'react';
import Dropdown from './form/dropdown.jsx';
import Fieldset from './elements/fieldset.jsx';
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
    <Fieldset
        time={server_time}
        header={localize('Start time')}
        icon='start-time'
        tooltip={localize('Text for Start Time goes here.')}
    >
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
    </Fieldset>
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
