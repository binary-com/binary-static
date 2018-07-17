import classNames     from 'classnames';
import moment         from 'moment';
import PropTypes      from 'prop-types';
import React          from 'react';
import CalendarButton from './calendar_button.jsx';

export default function CalendarHeader({ calendarDate: date, isPeriodDisabled, onClick, onSelect, view }) {
    const is_date_view   = (view === 'date');
    const is_month_view  = (view === 'month');
    const is_year_view   = (view === 'year');
    const is_decade_view = (view === 'decade');
    
    return (
        <div className='calendar-header'>
            <CalendarButton 
                className={classNames('calendar-prev-year-btn', {
                    hidden: isPeriodDisabled(moment(date).subtract(1, 'month'), 'month'),
                })}
                onClick={() => (
                    (is_date_view || is_month_view) && onClick.previousYear())
                    || (is_year_view   && onClick.previousDecade()) 
                    || (is_decade_view && onClick.previousCentury()
                )}
            />
            <CalendarButton 
                className={classNames('calendar-prev-month-btn', {
                    hidden: isPeriodDisabled(moment(date).subtract(1, 'month'), 'month'),
                })}
                is_hidden={!is_date_view}
                onClick={onClick.previousMonth}
            />

            <div className='calendar-select'>
                { is_date_view &&
                    <CalendarButton 
                        className='calendar-select-month-btn'
                        is_hidden={!is_date_view}
                        label={moment(date).format('MMM')}
                        onClick={onSelect.month}
                    />
                }
                <CalendarButton
                    className='calendar-select-year-btn'
                    onClick={() => ((is_date_view || is_month_view) ? onSelect.year() : onSelect.decade())}
                >
                    { (is_date_view || is_month_view) && moment(date).year() }
                    { is_year_view   && `${moment(date).subtract(1, 'years').year()}-${moment(date).add(10, 'years').year()}`  }
                    { is_decade_view && `${moment(date).subtract(10, 'years').year()}-${moment(date).add(109, 'years').year()}` }
                </CalendarButton>
            </div>

            <CalendarButton 
                className={classNames('calendar-next-month-btn', {
                    hidden: isPeriodDisabled(moment(date).add(1, 'month'), 'month'),
                })}
                is_hidden={!is_date_view}
                onClick={onClick.nextMonth}
            />
            <CalendarButton 
                className={classNames('calendar-next-year-btn', {
                    hidden: isPeriodDisabled(moment(date).add(1, 'month'), 'month'),
                })}
                onClick={() => (
                    ((is_date_view || is_month_view) && onClick.nextYear())
                    || (is_year_view   && onClick.nextDecade()) 
                    || (is_decade_view && onClick.nextCentury()) 
                )}
            />
        </div>
    );
} 

CalendarHeader.propTypes = {
    calendarDate    : PropTypes.string,
    view            : PropTypes.string,
    onClick         : PropTypes.object,
    onSelect        : PropTypes.object,
    isPeriodDisabled: PropTypes.func,
};