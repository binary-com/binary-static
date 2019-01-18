import classNames         from 'classnames';
import React              from 'react';
import { toMoment }       from 'Utils/Date';
import CalendarPanelTypes from './types';

export const CalendarYears = ({
    calendar_date,
    isPeriodDisabled,
    onClick,
    selected_date,
}) => {
    const selected_year = toMoment(selected_date).year();
    const moment_date   = toMoment(calendar_date);
    const current_year  = moment_date.year();
    const years         = [];
    for (let year = current_year - 1; year < current_year + 11; year++) {
        years.push(year);
    }
    return (
        <div className='calendar__body calendar__body--year'>
            { years.map((year, idx) => {
                const is_other_decade = idx === 0 || idx === 11;
                const is_disabled     = isPeriodDisabled(moment_date.year(year), 'year');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar__cell', {
                            'calendar__cell--is-active'      : year === selected_year,
                            'calendar__cell--is-other-decade': is_other_decade,
                            'calendar__cell--is-disabled'    : is_disabled,
                        })}
                        onClick={onClick.year}
                        data-year={year}
                    >
                        {year}
                    </span>
                );
            })
            }
        </div>
    );
};

CalendarYears.propTypes = { ...CalendarPanelTypes };
