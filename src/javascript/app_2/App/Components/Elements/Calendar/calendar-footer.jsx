import PropTypes             from 'prop-types';
import React                 from 'react';
import { IconCalendarToday } from 'Assets/Common';

const CalendarFooter = ({
    footer,
    has_today_btn,
    has_range_selection,
    duration_date,
    onClick,
}) => (
    <React.Fragment>
        {(has_today_btn || footer) &&
            <div className='calendar__footer'>
                {footer && <span className='calendar__text'>{`${footer} ${has_range_selection ? duration_date : ''}`}</span>}
                {has_today_btn &&
                    <IconCalendarToday
                        className='calendar__icon'
                        onClick={onClick}
                    />
                }
            </div>
        }
    </React.Fragment>
);

CalendarFooter.propTypes = {
    duration_date      : PropTypes.string,
    footer             : PropTypes.string,
    has_range_selection: PropTypes.bool,
    has_today_btn      : PropTypes.bool,
    onClick            : PropTypes.func,
};

export default CalendarFooter;
