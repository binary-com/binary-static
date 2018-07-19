import moment         from 'moment';
import PropTypes      from 'prop-types';
import React          from 'react';
import CalendarFooter from './calendar_footer.jsx';
import CalendarHeader from './calendar_header.jsx';
import CalendarPanel  from './calendar_panel.jsx';

class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        const { date_format, start_date } = props;
        const current_date = moment.utc(start_date).format(date_format);
        this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: '',           // selected date
            calendar_view: 'date',
        };
    }

    // navigates to next or previous's month/year/decade/century
    navigators = {
        nextMonth      : () => { this.navigateTo(1,   'months', true ); },
        previousMonth  : () => { this.navigateTo(1,   'months', false); },
        nextYear       : () => { this.navigateTo(1,   'years',  true ); },
        previousYear   : () => { this.navigateTo(1,   'years',  false); },
        nextDecade     : () => { this.navigateTo(10,  'years',  true ); },
        previousDecade : () => { this.navigateTo(10,  'years',  false); },
        nextCentury    : () => { this.navigateTo(100, 'years',  true ); },
        previousCentury: () => { this.navigateTo(100, 'years',  false); },
    }

    // selects a day, a month, a year, or a decade
    panelSelectors = {
        date  : (e, is_disabled) => { this.updateSelectedDate(e, is_disabled); },
        month : (e) => { this.updateSelected(e, 'month' ); },
        year  : (e) => { this.updateSelected(e, 'year'  ); },
        decade: (e) => { this.updateSelected(e, 'decade'); },
    }

    // sets Calendar active view
    calendarViews = {
        date  : () => { this.setState({ calendar_view: 'date'   }); },
        month : () => { this.setState({ calendar_view: 'month'  }); },
        year  : () => { this.setState({ calendar_view: 'year'   }); },
        decade: () => { this.setState({ calendar_view: 'decade' }); },
    }

    navigateTo = (value, unit, is_add) => {
        const { date_format, max_date, min_date } = this.props;

        let new_date = moment.utc(this.state.calendar_date, date_format)[is_add ? 'add' : 'subtract'](value, unit).format(date_format);

        if (unit === 'months' && this.isPeriodDisabled(new_date, 'month')) return;

        if (unit === 'years'  && this.isPeriodDisabled(new_date, 'years')) {
            new_date = is_add ? max_date : min_date;
        }

        this.setState({ calendar_date: moment.utc(new_date, date_format).format(date_format) }); // formatted date
    }

    updateSelectedDate = (e, is_disabled) => {
        if (is_disabled) {
            return;
        }

        const { date_format, max_date, min_date, onSelect } = this.props;

        const moment_date = moment.utc(e.target.dataset.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const is_before   = moment_date.isBefore(moment.utc(min_date));
        const is_after    = moment_date.isAfter(moment.utc(max_date));

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
    }

    updateSelected = (e, type) => {
        const view_map = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        const date = moment.utc(this.state.calendar_date, this.props.date_format)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.date_format);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState({
            calendar_date: date,
            calendar_view: view_map[type],
        });
    }

    resetCalendar = () => {
        const { date_format, start_date } = this.props;

        const default_date = moment.utc(start_date).format(date_format);
        this.setState({
            calendar_date: default_date,
            selected_date: '',
            calendar_view: 'date',
        });
    }

    setToday = () => {
        const { date_format, onSelect } = this.props;

        const now = moment().utc().format(date_format);
        this.setState({
            calendar_date: now,
            selected_date: now,
            calendar_view: 'date',
        });

        if (onSelect) {
            onSelect(now, true);
        }
    }

    isPeriodDisabled = (date, unit) => {
        const { max_date, min_date } = this.props;

        const start_of_period = moment.utc(date).startOf(unit);
        const end_of_period   = moment.utc(date).endOf(unit);
        return end_of_period.isBefore(moment.utc(min_date))
            || start_of_period.isAfter(moment.utc(max_date));
    }

    render() {
        const { children, date_format, footer, id, max_date, min_date, has_today_btn } = this.props;
        const { calendar_date, calendar_view, selected_date  } = this.state;

        return (
            <div id={id} className='calendar' value={selected_date}>
                { children }
                <CalendarHeader
                    calendar_date={calendar_date}
                    isPeriodDisabled={this.isPeriodDisabled}
                    onClick={this.navigators}
                    onSelect={this.calendarViews}
                    calendar_view={calendar_view}
                />
                <CalendarPanel
                    calendar_date={calendar_date}
                    date_format={date_format}
                    isPeriodDisabled={this.isPeriodDisabled}
                    max_date={max_date}
                    min_date={min_date}
                    onClick={this.panelSelectors}
                    selected_date={selected_date}
                    calendar_view={calendar_view}
                />
                <CalendarFooter
                    footer={footer}
                    onClick={this.setToday}
                    has_today_btn={has_today_btn}
                />
            </div>
        );
    }
}

Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date   : moment(0).utc().format('YYYY-MM-DD'),              // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date   : moment().utc().add(120, 'y').format('YYYY-MM-DD'), // by default, max_date is set to 120 years after today
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
        PropTypes.object,
        PropTypes.string,
    ]),
};

export default Calendar;
