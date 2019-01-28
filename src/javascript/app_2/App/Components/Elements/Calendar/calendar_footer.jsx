import PropTypes             from 'prop-types';
import React                 from 'react';
import { IconCalendarToday } from 'Assets/Common';

const CalendarFooter = ({
    footer,
    has_today_btn,
    onClick,
}) => (
    <React.Fragment>
        { (has_today_btn || footer) &&
            <div className='calendar__footer'>
                { footer && <span className='calendar__text'>{footer}</span> }
                { has_today_btn &&
                    <IconCalendarToday
                        className='calendar__icon calendar__icon--today'
                        onClick={onClick}
                    />
                }
            </div>
        }
    </React.Fragment>
);

CalendarFooter.propTypes = {
    footer       : PropTypes.string,
    has_today_btn: PropTypes.bool,
    onClick      : PropTypes.func,
};

export default CalendarFooter;
