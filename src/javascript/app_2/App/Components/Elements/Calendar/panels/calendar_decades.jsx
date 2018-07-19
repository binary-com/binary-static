import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import CalendarPanelTypes from './types';

export function CalendarDecades({ calendar_date, isPeriodDisabled, onClick, selected_date }) {
    const is_active    = moment(selected_date).year();
    const current_year = moment(calendar_date).year();
    const decades      = [];
    let min_year       = current_year - 10;

    for (let i = 0; i < 12; i++) {
        const max_year = min_year + 9;
        const range    = `${min_year}-${max_year}`;
        decades.push(range);
        min_year = max_year + 1;
    }

    return (
        <div className='calendar-decade-panel'>
            {decades.map((range, idx) => {
                const [start_year, end_year] = range.split('-');
                const start_date = moment(calendar_date).year(start_year);
                const end_date   = moment(calendar_date).year(end_year);
                const is_disabled = isPeriodDisabled(start_date, 'year')
                                 && isPeriodDisabled(end_date, 'year');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar-decade', {
                            disabled: is_disabled,
                            active  : start_year === is_active,
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
}

CalendarDecades.propTypes = { ...CalendarPanelTypes };
