import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import CalendarPanelTypes from './types';
import { localize }       from '../../../../../../_common/localize';

const getDays = ({ calendar_date, date_format, max_date, min_date, onClick, selected_date }) => {
    const dates = [];
    const days  = [];
    const num_of_days    = moment(calendar_date).daysInMonth() + 1;
    const start_of_month = moment(calendar_date).startOf('month').format(date_format);
    const end_of_month   = moment(calendar_date).endOf('month').format(date_format);
    const first_day = moment(start_of_month).day();
    const last_day  = moment(end_of_month).day();

    const pad = (num) => (`0${num}`).substr(-2); // pad zero

    for (let i = first_day; i > 0; i--) {
        dates.push(moment(start_of_month).subtract(i, 'day').format(date_format));
    }
    for (let idx = 1; idx < num_of_days; idx += 1) {
        dates.push(moment(calendar_date).format(date_format.replace('DD', pad(idx))));
    }
    for (let i = 1; i <= 6 - last_day; i++) {
        dates.push(moment(end_of_month).add(i, 'day').format(date_format));
    }

    dates.map((date) => {
        const is_disabled = moment(date).isBefore(moment(min_date))
            || moment(date).isAfter(moment(max_date));
        const is_other_month = moment(date).isBefore(moment(start_of_month))
            || moment(date).isAfter(moment(end_of_month));
        const is_active = selected_date && moment(date).isSame(moment(selected_date));
        const is_today  = moment(date).isSame(moment().utc(), 'day');

        days.push(
            <span
                key={date}
                className={classNames('calendar-date', {
                    active  : is_active && !is_disabled,
                    today   : is_today,
                    disabled: is_disabled,
                    hidden  : is_other_month,
                })}
                onClick={onClick.date}
                data-date={date}
            >
                {moment(date).date()}
            </span>
        );
    });

    return days;
};

export function CalendarDays(props) {
    const days = getDays(props).map(day => day);
    const week_headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className='calendar-date-panel'>
            {week_headers.map((item, idx) => (<span key={idx} className='calendar-date-header'>{localize(item)}</span>))}
            {days}
        </div>
    );
}

CalendarDays.propTypes = { ...CalendarPanelTypes };
