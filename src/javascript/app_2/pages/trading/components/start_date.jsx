import React from 'react';
import moment from 'moment';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const StartDate = ({
    start_date,
    start_dates_list,
    start_time,
    onChange,
}) =>  (
        <fieldset>
            <label>{localize('Start time')}</label>
            <select name='start_date' value={start_date} onChange={onChange}>
                <option value='now'>{localize('Now')}</option>
                {start_dates_list.map(option => {
                    const day = moment.unix(option.open).format('ddd - DD MMM, YYYY');
                    return (
                        <option key={option.open} value={option.open} data-end={option.close}>{day}</option>
                    );
                })}
            </select>
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
        onChange        : trade.handleChange,
    })
)(StartDate);
