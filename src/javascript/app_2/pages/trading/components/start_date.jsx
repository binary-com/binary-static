import React        from 'react';
import PropTypes    from 'prop-types';
import Dropdown     from '../../../components/form/dropdown.jsx';
import Fieldset     from '../../../components/form/fieldset.jsx';
import TimePicker   from '../../../components/form/time_picker.jsx';
import { connect }  from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const StartDate = ({
    start_date,
    start_dates_list,
    start_time,
    onChange,
    is_nativepicker,
    is_minimized,
}) => {
    // Number(0) refers to 'now'
    if (is_minimized) {
        return (
            <div className='fieldset-minimized start-date'>
                <span className='icon start-time' />
                {start_date === Number(0)
                    ? localize('Now')
                    : `${(start_dates_list.find(o => o.value === +start_date) || {}).text}\n${start_time}`
                }
            </div>
        );
    }
    return (
        <Fieldset
            header={localize('Start time')}
            icon='start-time'
        >
            <Dropdown
                name='start_date'
                value={start_date}
                list={start_dates_list}
                onChange={onChange}
                type='date'
                is_nativepicker={is_nativepicker}
            />
            {start_date !== Number(0) &&
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

StartDate.propTypes = {
    is_minimized    : PropTypes.bool,
    is_nativepicker : PropTypes.bool,
    onChange        : PropTypes.func,
    server_time     : PropTypes.object,
    start_date      : PropTypes.number,
    start_dates_list: PropTypes.array,
    start_time      : PropTypes.string,
};

export default connect(
    ({ trade }) => ({
        start_date      : trade.start_date,
        start_dates_list: trade.start_dates_list,
        start_time      : trade.start_time,
        onChange        : trade.handleChange,
    })
)(StartDate);
