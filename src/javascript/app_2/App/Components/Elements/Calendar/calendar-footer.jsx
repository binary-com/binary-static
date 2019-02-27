import PropTypes             from 'prop-types';
import React                 from 'react';
import { IconCalendarToday } from 'Assets/Common';
import { toMoment }          from 'Utils/Date';

const CalendarFooter = ({
    footer,
    has_today_btn,
    has_range_selection,
    duration_date,
    onClick,
    selected_date,
}) => {
    const moment_today = toMoment().startOf('day');
    const moment_selected = toMoment(selected_date);
    const default_duration = moment_selected.diff(moment_today, 'days');
    const default_message = `${default_duration} ${default_duration === 1 ? 'Day' : 'Days'}`;

    return (
        <React.Fragment>
            {(has_today_btn || footer) &&
                <div className='calendar__footer'>
                    {footer && <span className='calendar__text'>{`${footer} ${has_range_selection ? (duration_date || default_message) : ''}`}</span>}
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
};

CalendarFooter.propTypes = {
    footer       : PropTypes.string,
    has_today_btn: PropTypes.bool,
    onClick      : PropTypes.func,
};

export default CalendarFooter;
