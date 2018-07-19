import classNames     from 'classnames';
import moment         from 'moment';
import PropTypes      from 'prop-types';
import React          from 'react';
import CalendarButton from './calendar_button.jsx';

export default function CalendarHeader({ calendar_date, isPeriodDisabled, onClick, onSelect, calendar_view }) {
    const is_date_view   = calendar_view === 'date';
    const is_month_view  = calendar_view === 'month';
    const is_year_view   = calendar_view === 'year';
    const is_decade_view = calendar_view === 'decade';
    const moment_date    = moment.utc(calendar_date);
    
    return (
        <div className='calendar-header'>
            <CalendarButton 
                className={classNames('calendar-prev-year-btn', {
                    hidden: isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month'),
                })}
                onClick={() => (
                    (is_date_view || is_month_view) && onClick.previousYear())
                    || (is_year_view   && onClick.previousDecade()) 
                    || (is_decade_view && onClick.previousCentury()
                )}
            />
            <CalendarButton 
                className={classNames('calendar-prev-month-btn', {
                    hidden: isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month'),
                })}
                is_hidden={!is_date_view}
                onClick={onClick.previousMonth}
            />

            <div className='calendar-select'>
                { is_date_view &&
                    <CalendarButton 
                        className='calendar-select-month-btn'
                        is_hidden={!is_date_view}
                        label={moment_date.format('MMM')}
                        onClick={onSelect.month}
                    />
                }
                <CalendarButton
                    className='calendar-select-year-btn'
                    onClick={() => ((is_date_view || is_month_view) ? onSelect.year() : onSelect.decade())}
                >
                    { (is_date_view || is_month_view) && moment_date.year() }
                    { is_year_view   && `${moment_date.clone().subtract(1, 'years').year()}-${moment_date.clone().add(10, 'years').year()}`  }
                    { is_decade_view && `${moment_date.clone().subtract(10, 'years').year()}-${moment_date.clone().add(109, 'years').year()}` }
                </CalendarButton>
            </div>

            <CalendarButton 
                className={classNames('calendar-next-month-btn', {
                    hidden: isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month'),
                })}
                is_hidden={!is_date_view}
                onClick={onClick.nextMonth}
            />
            <CalendarButton 
                className={classNames('calendar-next-year-btn', {
                    hidden: isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month'),
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
    calendar_date   : PropTypes.string,
    calendar_view   : PropTypes.string,
    isPeriodDisabled: PropTypes.func,
    onClick         : PropTypes.object,
    onSelect        : PropTypes.object,
};
