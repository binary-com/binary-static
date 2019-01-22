import classNames         from 'classnames';
import React              from 'react';
import { toMoment }       from 'Utils/Date';
import CalendarPanelTypes from './types';

export const CalendarDecades = ({
    calendar_date,
    isPeriodDisabled,
    onClick,
    selected_date,
}) => {
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
            { decades.map((range, idx) => {
                const [start, end] = range.split('-');
                const is_active    = +start === selected_year;
                const is_disabled  = isPeriodDisabled(moment_date.year(start), 'year') &&
                    isPeriodDisabled(moment_date.year(end), 'year');
                const is_other_century = idx === 0 || idx === 11;
                return (
                    <span
                        key={idx}
                        className={classNames('calendar__cell', {
                            'calendar__cell--active'  : is_active,
                            'calendar__cell--disabled': is_disabled,
                            'calendar__cell--other'   : is_other_century,
                        })}
                        onClick={onClick.decade}
                        data-decade={range}
                    >
                        {range}
                    </span>
                );
            })
            }
        </div>
    );
};

CalendarDecades.propTypes = { ...CalendarPanelTypes };
