import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    IconChevronDoubleLeft,
    IconChevronDoubleRight,
    IconChevronLeft,
    IconChevronRight }      from 'Assets/Common';
import { toMoment }         from 'Utils/Date';
import CalendarButton       from './calendar_button.jsx';

const CalendarHeader = ({
    calendar_date,
    calendar_view,
    isPeriodDisabled,
    onClick,
    onSelect,
}) => {
    const is_date_view   = calendar_view === 'date';
    const is_month_view  = calendar_view === 'month';
    const is_year_view   = calendar_view === 'year';
    const is_decade_view = calendar_view === 'decade';
    const moment_date    = toMoment(calendar_date);

    return (
        <div className='calendar__header'>
            <CalendarButton
                className={classNames('calendar__header__nav calendar__header__nav--prev-year', {
                    'calendar__header__nav--is-disabled': isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month'),
                })}
                onClick={() => (
                    (is_date_view || is_month_view) && onClick.previousYear())
                    || (is_year_view   && onClick.previousDecade())
                    || (is_decade_view && onClick.previousCentury()
                    )
                }
            >
                <IconChevronDoubleLeft />
            </CalendarButton>
            <CalendarButton
                className={classNames('calendar__header__nav calendar__header__nav--prev-month', {
                    'calendar__header__nav--is-disabled': isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month'),
                })}
                is_hidden={!is_date_view}
                onClick={onClick.previousMonth}
            >
                <IconChevronLeft />
            </CalendarButton>

            <div className='calendar__header__select'>
                { is_date_view &&
                    <CalendarButton
                        className='calendar__header__select__btn'
                        is_hidden={!is_date_view}
                        label={moment_date.format('MMM')}
                        onClick={onSelect.month}
                    />
                }
                <CalendarButton
                    className={classNames('calendar__header__select__btn', {
                        'calendar__header__select__btn--is-decade': is_decade_view,
                    })}
                    onClick={() => ((is_date_view || is_month_view) ? onSelect.year() : onSelect.decade())}
                >
                    { (is_date_view || is_month_view) && moment_date.year() }
                    { is_year_view   && `${moment_date.clone().year()}-${moment_date.clone().add(9, 'years').year()}`  }
                    { is_decade_view && `${moment_date.clone().year()}-${moment_date.clone().add(99, 'years').year()}` }
                </CalendarButton>
            </div>

            <CalendarButton
                className={classNames('calendar__header__nav calendar__header__nav--next-month', {
                    'calendar__header__nav--is-disabled': isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month'),
                })}
                is_hidden={!is_date_view}
                onClick={onClick.nextMonth}
            >
                <IconChevronRight />
            </CalendarButton>
            <CalendarButton
                className={classNames('calendar__header__nav calendar__header__nav--next-year', {
                    'calendar__header__nav--is-disabled': isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month'),
                })}
                onClick={() => (
                    ((is_date_view || is_month_view) && onClick.nextYear())
                    || (is_year_view   && onClick.nextDecade())
                    || (is_decade_view && onClick.nextCentury())
                )}
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
    onClick         : PropTypes.object,
    onSelect        : PropTypes.object,
};

export default CalendarHeader;
