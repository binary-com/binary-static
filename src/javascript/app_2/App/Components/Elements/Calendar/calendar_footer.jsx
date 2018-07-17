import PropTypes      from 'prop-types';
import React          from 'react';
import CalendarButton from './calendar_button.jsx';
import { localize }   from '../../../../../_common/localize';

export default function CalendarFooter({ footer, showTodayBtn, onClick }) {
    return (
        <div className='calendar-footer'>
            { footer && <span className='calendar-footer-extra'>{footer}</span> }
            { showTodayBtn &&
                <CalendarButton className='calendar-footer-btn'>
                    <a role='button' onClick={onClick}>{localize('Today')}</a>
                </CalendarButton>
            }
        </div>
    );
} 

CalendarFooter.propTypes = {
    footer      : PropTypes.string,
    onClick     : PropTypes.func,
    showTodayBtn: PropTypes.bool,
};