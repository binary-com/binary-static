import classNames         from 'classnames';
import React              from 'react';
import { toMoment }       from 'Utils/Date';
import CalendarPanelTypes from './types';

export const CalendarDecades = ({ calendar_date, isPeriodDisabled, onClick, selected_date }) => {
    const selected_year = toMoment(selected_date).year();
    const moment_date   = toMoment(calendar_date);

    const decades = [];
    let min_year  = moment_date.year() - 10;
    for (let i = 0; i < 12; i++) {
        const max_year = min_year + 9;
        const range    = `${min_year}-${max_year}`;
        decades.push(range);
        min_year = max_year + 1;
    }

    return (
        <div className='calendar__body calendar__body--decade'>
            {decades.map((range, idx) => {
                const [start_year, end_year] = range.split('-');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar__body__cell', {
                            'calendar__body__cell--is-active'  : start_year === selected_year,
                            'calendar__body__cell--is-disabled': isPeriodDisabled(moment_date.year(start_year), 'year')
                                && isPeriodDisabled(moment_date.year(end_year), 'year'),
                        })}
                        onClick={onClick.decade}
                        data-decade={range}
                    >
                        {range}
                    </span>
                );
            })}
        </div>
    );
};

CalendarDecades.propTypes = { ...CalendarPanelTypes };
