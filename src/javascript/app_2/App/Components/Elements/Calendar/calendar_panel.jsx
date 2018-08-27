import PropTypes      from 'prop-types';
import React          from 'react';
import {
    CalendarDays,
    CalendarMonths, 
    CalendarYears,
    CalendarDecades } from './panels';

export default function CalendarPanel(props) {
    const calendar_panel = {
        date  : <CalendarDays    {...props} />,
        month : <CalendarMonths  {...props} />,
        year  : <CalendarYears   {...props} />,
        decade: <CalendarDecades {...props} />,
    };

    return (
        <div className='calendar-panel'>
            { calendar_panel[props.calendar_view] }
        </div>
    );
} 

CalendarPanel.propTypes = {
    calendar_view: PropTypes.string,
};