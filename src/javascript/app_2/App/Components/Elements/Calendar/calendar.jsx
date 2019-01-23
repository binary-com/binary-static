import PropTypes      from 'prop-types';
import React          from 'react';
import { toMoment }   from 'Utils/Date';
import CalendarBody   from './calendar_body.jsx';
import CalendarFooter from './calendar_footer.jsx';
import CalendarHeader from './calendar_header.jsx';

class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        const { date_format, start_date } = props;
        const current_date = toMoment(start_date).format(date_format);
        this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: '',           // selected date
            calendar_view: 'date',
        };
    }

    switchView = (e, view) => {
        if (e) e.stopPropagation();
        this.setState({ calendar_view: view });
    };

    navigateTo = (e, value, unit, is_add) => {
        if (e) e.stopPropagation();

        const { date_format, max_date, min_date } = this.props;

        let new_date = toMoment(this.state.calendar_date)[is_add ? 'add' : 'subtract'](value, unit).format(date_format);

        if (unit === 'month' && this.isPeriodDisabled(new_date, 'month')) return;

        if (unit === 'year'  && this.isPeriodDisabled(new_date, 'year')) {
            new_date = is_add ? max_date : min_date;
        }

        this.setState({ calendar_date: toMoment(new_date).format(date_format) }); // formatted date
    };

    updateSelectedDate = (e) => {
        const { date_format, max_date, min_date, onSelect } = this.props;

        const moment_date = toMoment(e.target.dataset.date).startOf('day');
        const is_before   = moment_date.isBefore(toMoment(min_date));
        const is_after    = moment_date.isAfter(toMoment(max_date));

        if (is_before || is_after) {
            return;
        }

        const formatted_date = moment_date.format(date_format);
        this.setState({
            calendar_date: formatted_date,
            selected_date: formatted_date,
        });

        if (onSelect) {
            onSelect(formatted_date);
        }
    };

    updateSelected = (e, type) => {
        if (e) e.stopPropagation();

        if (type === 'day') {
            this.updateSelectedDate(e);
            return;
        }

        const view_map = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        const date = toMoment(this.state.calendar_date)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.date_format);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState({
            calendar_date: date,
            calendar_view: view_map[type],
        });
    };

    resetCalendar = () => {
        const { date_format, start_date } = this.props;

        const default_date = toMoment(start_date).format(date_format);
        this.setState({
            calendar_date: default_date,
            selected_date: '',
            calendar_view: 'date',
        });
    };

    setToday = () => {
        const { date_format, onSelect } = this.props;

        const now = toMoment().format(date_format);
        this.setState({
            calendar_date: now,
            selected_date: now,
            calendar_view: 'date',
        });

        if (onSelect) {
            onSelect(now, true);
        }
    };

    isPeriodDisabled = (date, unit) => {
        const { max_date, min_date } = this.props;

        const start_of_period = toMoment(date).clone().startOf(unit);
        const end_of_period   = toMoment(date).clone().endOf(unit);
        return end_of_period.isBefore(toMoment(min_date))
            || start_of_period.isAfter(toMoment(max_date));
    };

    render() {
        const { children, date_format, footer, has_today_btn, id, start_date } = this.props;
        const { calendar_date, calendar_view, selected_date  } = this.state;

        return (
            <div id={id} className='calendar' data-value={selected_date}>
                { children }
                <CalendarHeader
                    calendar_date={calendar_date}
                    calendar_view={calendar_view}
                    isPeriodDisabled={this.isPeriodDisabled}
                    navigateTo={this.navigateTo}
                    switchView={this.switchView}
                />
                <CalendarBody
                    calendar_date={calendar_date}
                    calendar_view={calendar_view}
                    date_format={date_format}
                    isPeriodDisabled={this.isPeriodDisabled}
                    start_date={start_date}
                    selected_date={selected_date}
                    updateSelected={this.updateSelected}
                />
                <CalendarFooter
                    footer={footer}
                    has_today_btn={has_today_btn}
                    onClick={this.setToday}
                />
            </div>
        );
    }
}

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date   : toMoment().format('YYYY-MM-DD'),               // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date   : toMoment().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
};

Calendar.propTypes = {
    children       : PropTypes.object,
    date_format    : PropTypes.string,
    footer         : PropTypes.string,
    has_today_btn  : PropTypes.bool,
    id             : PropTypes.string,
    is_nativepicker: PropTypes.bool,
    max_date       : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    min_date: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    onSelect  : PropTypes.func,
    start_date: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Calendar;
