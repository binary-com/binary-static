import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import { localize }       from '_common/localize';
import CalendarPanelTypes from './types';

const getMonthHeaders = () => ({
    Jan: localize('Jan'),
    Feb: localize('Feb'),
    Mar: localize('Mar'),
    Apr: localize('Apr'),
    May: localize('May'),
    Jun: localize('Jun'),
    Jul: localize('Jul'),
    Aug: localize('Aug'),
    Sep: localize('Sep'),
    Oct: localize('Oct'),
    Nov: localize('Nov'),
    Dec: localize('Dec'),
});

export const CalendarMonths = ({ calendar_date, isPeriodDisabled, onClick, selected_date }) => {
    const moment_date    = moment.utc(calendar_date);
    const selected_month = moment.utc(selected_date).month();
    const month_headers  = getMonthHeaders();

    return (
        <div className='calendar-month-panel'>
            {Object.keys(month_headers).map((month, idx) => (
                <span
                    key={idx}
                    className={classNames('calendar-month', {
                        active  : idx === selected_month,
                        disabled: isPeriodDisabled(moment_date.month(month), 'month'),
                    })}
                    onClick={onClick.month}
                    data-month={idx}
                >
                    {month_headers[month]}
                </span>
            ))}
        </div>
    );
};

CalendarMonths.propTypes = { ...CalendarPanelTypes };
