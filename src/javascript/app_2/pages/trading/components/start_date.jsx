import React from 'react';
import moment from 'moment';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';
import ClockHeader from './elements/clock_header.jsx';
import Dropdown from './form/dropdown.jsx';

const StartDates = (dates) => {
    let array = [];
    if (dates) {
        const day = (date) => moment.unix(date).format('ddd - DD MMM, YYYY');
        array = Object.keys(dates).map(d => ({
            text : day(dates[d].open),
            value: dates[d].open,
            end  : dates[d].close,
        }));
    }
    array = [{value: 'now', text: localize('Now')}, ...array];
    return array;
};

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
            list={StartDates(start_dates_list)}
            onChange={onChange}
            type='date'
        />
        {start_date !== 'now' &&
            <React.Fragment>
                <input type='time' name='start_time' value={start_time} onChange={onChange} />
                <span>GMT</span>
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
