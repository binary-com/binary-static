import PropTypes             from 'prop-types';
import React                 from 'react';
import { localize }          from '_common/localize';
import { IconCalendarToday } from 'Assets/Common';
import CalendarButton        from './calendar_button.jsx';

export default function CalendarFooter({ footer, has_today_btn, onClick }) {
    return (
        <div className='calendar__footer'>
            { footer && <span className='calendar__footer__extra'>{footer}</span> }
            { has_today_btn &&
            <React.Fragment>
                <CalendarButton className='calendar__footer__btn'>
                    <a role='button' onClick={onClick}>{localize('Today')}</a>
                </CalendarButton>
                <IconCalendarToday
                    className='calendar__footer__icon calendar__footer__icon--today'
                    onClick={onClick}
                />
            </React.Fragment>
            }
        </div>
    );
}

CalendarFooter.propTypes = {
    footer       : PropTypes.string,
    has_today_btn: PropTypes.bool,
    onClick      : PropTypes.func,
};
