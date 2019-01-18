import PropTypes             from 'prop-types';
import React                 from 'react';
import { localize }          from '_common/localize';
import { IconCalendarToday } from 'Assets/Common';
import CalendarButton        from './calendar_button.jsx';

const CalendarFooter = ({
    footer,
    has_today_btn,
    onClick,
}) => (
    <React.Fragment>
        { (has_today_btn || footer) &&
            <div className='calendar__footer'>
                { footer && <span className='calendar__text calendar__text--bold'>{footer}</span> }
                { has_today_btn &&
                    <React.Fragment>
                        <CalendarButton className='calendar__btn'>
                            <a onClick={onClick}>{localize('Today')}</a>
                        </CalendarButton>
                        <IconCalendarToday
                            className='calendar__icon calendar__icon--today'
                            onClick={onClick}
                        />
                    </React.Fragment>
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
