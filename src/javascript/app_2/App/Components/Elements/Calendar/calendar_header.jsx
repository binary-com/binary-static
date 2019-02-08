import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    IconChevronDoubleLeft,
    IconChevronDoubleRight,
    IconChevronLeft,
    IconChevronRight }      from 'Assets/Common';
import {
    addMonths,
    addYears,
    subMonths,
    subYears,
    toMoment }              from 'Utils/Date';
import CalendarButton       from './calendar_button.jsx';
import { month_headers }    from './constants';
import {
    getCentury,
    getDecade }             from './helper';

const CalendarHeader = ({
    calendar_date,
    calendar_view,
    isPeriodDisabled,
    navigateTo,
    switchView,
    disabled_selector = [],
}) => {
    const is_date_view   = calendar_view === 'date';
    const is_month_view  = calendar_view === 'month';
    const is_year_view   = calendar_view === 'year';
    const is_decade_view = calendar_view === 'decade';
    const moment_date    = toMoment(calendar_date);

    let num_of_years = 1;
    if (is_year_view)   num_of_years = 10;
    if (is_decade_view) num_of_years = 100;

    const century = getCentury(moment_date.clone());
    const decade  = getDecade(moment_date.clone());
    const end_of_decade = (is_year_view ? decade : century).split('-')[1];

    const is_prev_month_disabled  = isPeriodDisabled(subMonths(moment_date, 1), 'month');
    const is_prev_year_disabled   = isPeriodDisabled(subYears(moment_date, num_of_years), 'month');
    const is_next_month_disabled  = isPeriodDisabled(addMonths(moment_date, 1), 'month');
    const is_next_year_disabled   = isPeriodDisabled(addYears(moment_date, num_of_years), 'month');
    const is_select_year_disabled = isPeriodDisabled(moment_date.clone().year(end_of_decade), 'year') || disabled_selector.some(selector => selector === 'year');

    return (
        <div className='calendar__header'>
            <CalendarButton
                className={classNames('calendar__nav calendar__nav--prev-year', {
                    'calendar__nav--disabled': is_prev_year_disabled,
                })}
                onClick={is_prev_year_disabled ? undefined : () => navigateTo(subYears(calendar_date, num_of_years))}
            >
                <IconChevronDoubleLeft />
            </CalendarButton>
            <CalendarButton
                className={classNames('calendar__nav calendar__nav--prev-month', {
                    'calendar__nav--disabled': is_prev_month_disabled,
                })}
                is_hidden={!is_date_view}
                onClick={is_prev_month_disabled ? undefined : () => navigateTo(subMonths(calendar_date, 1))}
            >
                <IconChevronLeft />
            </CalendarButton>

            <React.Fragment>
                { is_date_view &&
                    <CalendarButton
                        className='calendar__btn calendar__btn--select'
                        is_hidden={!is_date_view}
                        label={month_headers[moment_date.format('MMM')]}
                        onClick={() => switchView('month')}
                    />
                }
                { (is_date_view || is_month_view) &&
                    <CalendarButton
                        className={classNames('calendar__btn calendar__btn--select', {
                            'calendar__btn--disabled': is_select_year_disabled,
                        })}
                        label={moment_date.format('YYYY')}
                        onClick={() => is_select_year_disabled ? undefined : switchView('year')}
                    />
                }
                { (is_year_view || is_decade_view) &&
                    <CalendarButton
                        className={classNames('calendar__btn calendar__btn--select', {
                            'calendar__btn--disabled': is_select_year_disabled,
                        })}
                        onClick={is_select_year_disabled ? undefined : () => switchView('decade')}
                    >
                        { is_year_view   && `${decade}`  }
                        { is_decade_view && `${century}` }
                    </CalendarButton>
                }
            </React.Fragment>

            <CalendarButton
                className={classNames('calendar__nav calendar__nav--next-month', {
                    'calendar__nav--disabled': is_next_month_disabled,
                })}
                is_hidden={!is_date_view}
                onClick={is_next_month_disabled ? undefined : () => navigateTo(addMonths(calendar_date, 1))}
            >
                <IconChevronRight />
            </CalendarButton>
            <CalendarButton
                className={classNames('calendar__nav calendar__nav--next-year', {
                    'calendar__nav--disabled': is_next_year_disabled,
                })}
                onClick={is_next_year_disabled ? undefined : () => navigateTo(addYears(calendar_date, num_of_years))}
            >
                <IconChevronDoubleRight />
            </CalendarButton>
        </div>
    );
};

CalendarHeader.propTypes = {
    calendar_date   : PropTypes.string,
    calendar_view   : PropTypes.string,
    isPeriodDisabled: PropTypes.func,
    navigateTo      : PropTypes.func,
    switchView      : PropTypes.func,
};

export default CalendarHeader;
