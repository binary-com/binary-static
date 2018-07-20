import PropTypes from 'prop-types';

export const CalendarPanelTypes = {
    calendar_date   : PropTypes.string,
    calendar_view   : PropTypes.string, 
    date_format     : PropTypes.string, 
    isPeriodDisabled: PropTypes.func,
    max_date        : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    min_date: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    onClick      : PropTypes.object,
    selected_date: PropTypes.string,
};