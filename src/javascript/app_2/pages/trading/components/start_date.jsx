import React from 'react';
import Dropdown from '../../../components/form/dropdown.jsx';
import Fieldset from '../../../components/form/fieldset.jsx';
import TimePicker from '../../../components/form/time_picker.jsx';
import { connect } from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const StartDate = ({
    start_date,
    start_dates_list,
    start_time,
    server_time,
    onChange,
    is_nativepicker,
    is_minimized,
}) => {
    if (is_minimized) {
        return (
            <div className='fieldset-minimized start-date'>
                <span className='icon start-time' />
                {start_date === 'now'
                    ? localize('Now')
                    : `${(start_dates_list.find(o => o.value === +start_date) || {}).text}\n${start_time}`
                }
            </div>
        );
    }
    return (
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
                is_nativepicker={is_nativepicker}
            />
            {start_date !== 'now' &&
                <React.Fragment>
                    <TimePicker
                        onChange={onChange}
                        name='start_time'
                        value={start_time}
                        placeholder='12:00 pm'
                        is_nativepicker={is_nativepicker}
                    />
                </React.Fragment>
            }
        </Fieldset>
    );
};

export default connect(
    ({trade}) => ({
        start_date      : trade.start_date,
        start_dates_list: trade.start_dates_list,
        start_time      : trade.start_time,
        server_time     : trade.server_time,
        onChange        : trade.handleChange,
    })
)(StartDate);
