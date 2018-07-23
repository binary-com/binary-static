import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import CalendarPanelTypes from './types';
import { localize }       from '../../../../../../_common/localize';

const month_headers = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const CalendarMonths = ({ calendar_date, isPeriodDisabled, onClick, selected_date }) => {
    const moment_date    = moment.utc(calendar_date);
    const selected_month = moment.utc(selected_date).month();
    return (
        <div className='calendar-month-panel'>
            {month_headers.map((month, idx) => (
                <span
                    key={idx}
                    className={classNames('calendar-month', {
                        active  : idx === selected_month,
                        disabled: isPeriodDisabled(moment_date.month(month), 'month'),
                    })}
                    onClick={onClick.month}
                    data-month={idx}
                >
                    {localize(month)}
                </span>
            ))}
        </div>
    );
};

CalendarMonths.propTypes = { ...CalendarPanelTypes };
