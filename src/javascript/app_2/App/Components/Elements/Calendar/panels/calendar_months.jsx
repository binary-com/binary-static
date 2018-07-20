import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import CalendarPanelTypes from './types';
import { localize }       from '../../../../../../_common/localize';

export function CalendarMonths({ calendar_date, isPeriodDisabled, onClick, selected_date }) {
    const is_active     = moment(selected_date).month();
    const month_headers = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
        <div className='calendar-month-panel'>
            {month_headers.map((item, idx) => {
                const dates       = moment(calendar_date).month(item);
                const is_disabled = isPeriodDisabled(dates, 'month');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar-month', {
                            active  : idx === is_active,
                            disabled: is_disabled,
                        })}
                        onClick={onClick.month}
                        data-month={idx}
                    >
                        {localize(item)}
                    </span>
                );
            })}
        </div>
    );
}

CalendarMonths.propTypes = { ...CalendarPanelTypes };
