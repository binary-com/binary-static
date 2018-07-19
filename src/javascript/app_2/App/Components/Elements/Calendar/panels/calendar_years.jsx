import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import CalendarPanelTypes from './types';

export function CalendarYears({ calendar_date, isPeriodDisabled, onClick, selected_date }) {
    const is_active    = moment(selected_date).year();
    const current_year = moment(calendar_date).year();
    const years = [];
    for (let year = current_year - 1; year < current_year + 11; year++) {
        years.push(year);
    }
    return (
        <div className='calendar-year-panel'>
            {years.map((year, idx) => {
                const dates       = moment(calendar_date).year(year);
                const is_disabled = isPeriodDisabled(dates, 'year');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar-year', {
                            disabled: is_disabled,
                            active  : year === is_active,
                        })}
                        onClick={onClick.year}
                        data-year={year}
                    >
                        {year}
                    </span>
                );
            })}
        </div>
    );
}

CalendarYears.propTypes = { ...CalendarPanelTypes };
