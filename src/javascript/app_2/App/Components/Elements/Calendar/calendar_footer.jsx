import PropTypes      from 'prop-types';
import React          from 'react';
import CalendarButton from './calendar_button.jsx';
import { localize }   from '../../../../../_common/localize';

export default function CalendarFooter({ footer, has_today_btn, onClick }) {
    return (
        <div className='calendar-footer'>
            { footer && <span className='calendar-footer-extra'>{footer}</span> }
            { has_today_btn &&
                <CalendarButton className='calendar-footer-btn'>
                    <a role='button' onClick={onClick}>{localize('Today')}</a>
                </CalendarButton>
            }
        </div>
    );
} 

CalendarFooter.propTypes = {
    footer       : PropTypes.string,
    has_today_btn: PropTypes.bool,
    onClick      : PropTypes.func,
};