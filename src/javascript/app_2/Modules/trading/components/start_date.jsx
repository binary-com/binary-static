import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import Dropdown                       from '../../../components/form/dropdown.jsx';
import Fieldset                       from '../../../components/form/fieldset.jsx';
import TimePicker                     from '../../../components/form/time_picker.jsx';
import { connect }                    from '../../../Stores/connect';
import { localize }                   from '../../../../_common/localize';

/* TODO:
    1. update sessions list when the selected one doesn’t have any enabled time
*/

const StartDate = ({
    start_date,
    start_dates_list,
    start_time,
    onChange,
    is_nativepicker,
    is_minimized,
    sessions,
}) => {
    // Number(0) refers to 'now'
    const is_today = start_date === Number(0);
    let current_date_config = '';
    if (!is_today) {
        current_date_config = start_dates_list.find(o => o.value === +start_date) || {};
    }
    if (is_minimized) {
        return (
            <div className='fieldset-minimized start-date'>
                <span className='icon start-time' />
                {is_today ? localize('Now') : `${current_date_config.text}\n${start_time}`}
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
                is_nativepicker={is_nativepicker}
            />
            {!is_today &&
                <React.Fragment>
                    <TimePicker
                        onChange={onChange}
                        name='start_time'
                        value={start_time}
                        placeholder='12:00'
                        start_date={start_date}
                        sessions={sessions}
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
    start_date      : PropTypes.number,
    start_dates_list: MobxPropTypes.arrayOrObservableArray,
    start_time      : PropTypes.string,
    sessions        : MobxPropTypes.arrayOrObservableArray,
};

export default connect(
    ({ modules }) => ({
        start_date      : modules.trade.start_date,
        start_dates_list: modules.trade.start_dates_list,
        start_time      : modules.trade.start_time,
        sessions        : modules.trade.sessions,
        onChange        : modules.trade.handleChange,
    })
)(StartDate);
