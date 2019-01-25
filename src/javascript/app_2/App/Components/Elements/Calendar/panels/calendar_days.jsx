import classNames            from 'classnames';
import React                 from 'react';
import { padLeft }           from '_common/string_util';
import {
    addDays,
    addMonths,
    subDays,
    subMonths,
    toMoment }               from 'Utils/Date';
import CalendarPanelTypes    from './types';
import { week_headers_abbr } from '../constants';

const getDays = ({
    calendar_date,
    date_format,
    isPeriodDisabled,
    start_date,
    selected_date,
    updateSelected,
    // sessions, // TODO: check expiry date sessions. e.g. disable days if market closes on weekend
}) => {
    // adjust Calendar week by 1 day so that Calendar week starts on Monday
    // change to zero to set Calendar week to start on Sunday
    const day_offset = 1;

    const dates = [];
    const days  = [];
    const moment_today       = toMoment().startOf('day');
    const moment_cur_date    = toMoment(calendar_date);
    const num_of_days        = moment_cur_date.daysInMonth() + 1;
    const moment_month_start = moment_cur_date.clone().startOf('month');
    const moment_month_end   = moment_cur_date.clone().endOf('month');
    const moment_selected    = toMoment(selected_date);

    // populate previous months' dates
    const end_of_prev_month = subMonths(moment_cur_date, 1).endOf('month').day();
    for (let i = end_of_prev_month; i > 0; i--) {
        dates.push(subDays(moment_month_start, i).format(date_format));
    }
    // populate current months' dates
    for (let idx = 1; idx < num_of_days; idx += 1) {
        dates.push(moment_cur_date.clone().format(date_format.replace('DD', padLeft(idx, 2, '0'))));
    }
    // populate next months' dates
    const start_of_next_month = addMonths(moment_cur_date, 1).startOf('month').day();
    if (start_of_next_month - day_offset > 0 || dates.length <= 28) {
        // if start_of_next_month doesn't falls on Monday, append rest of the week
        for (let i = 1; i <= 7 - start_of_next_month + day_offset; i++) {
            dates.push(addDays(moment_month_end, i, 'day').format(date_format));
        }
    } else if (!start_of_next_month) {
        // if start_of_next_month falls on Sunday, append 1 day
        dates.push(addDays(moment_month_end, 1).format(date_format));
    }

    const moment_start_date = toMoment(start_date).startOf('day');

    dates.map((date) => {
        const moment_date = toMoment(date).startOf('day');
        const is_active   = selected_date && moment_date.isSame(moment_selected);
        const is_today    = moment_date.isSame(moment_today, 'day');
        const is_disabled = isPeriodDisabled(moment_date, 'day') ||
            // for forward starting accounts, only show same day as start date and the day after
            (start_date && (moment_date.isBefore(moment_start_date) ||
            moment_date.isAfter(addDays(moment_start_date, 1))));

        // show 'disabled' style for dates that is not in the same calendar month,
        // but the date should still be clickable
        const is_other_month = moment_date.month() !== moment_cur_date.month();

        days.push(
            <span
                key={date}
                className={classNames('calendar__cell', {
                    'calendar__cell--active'  : is_active && !is_disabled,
                    'calendar__cell--today'   : is_today,
                    'calendar__cell--disabled': is_disabled,
                    'calendar__cell--other'   : is_other_month,
                })}
                onClick={is_disabled ? undefined : (e) => updateSelected(e, 'day') }
                data-date={date}
            >
                {moment_date.date()}
            </span>
        );
    });

    return days;
};

export const CalendarDays = (props) => {
    const days = getDays(props).map(day => day);

    return (
        <div className='calendar__body calendar__body--date'>
            {Object.keys(week_headers_abbr).map((item, idx) => (<span key={idx} className='calendar__text calendar__text--bold'>{week_headers_abbr[item]}</span>))}
            {days}
        </div>
    );
};

CalendarDays.propTypes = { ...CalendarPanelTypes };
