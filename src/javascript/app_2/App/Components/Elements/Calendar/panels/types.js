import PropTypes from 'prop-types';

export const CalendarPanelTypes = {
    calendarDate    : PropTypes.string, 
    dateFormat      : PropTypes.string, 
    isPeriodDisabled: PropTypes.func,
    maxDate         : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    minDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    onClick     : PropTypes.object,
    selectedDate: PropTypes.string,
    view        : PropTypes.string,
};