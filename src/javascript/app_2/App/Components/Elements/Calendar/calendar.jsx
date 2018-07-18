import moment         from 'moment';
import PropTypes      from 'prop-types';
import React          from 'react';
import CalendarFooter from './calendar_footer.jsx';
import CalendarHeader from './calendar_header.jsx';
import CalendarPanel  from './calendar_panel.jsx';

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        const { dateFormat, startDate } = props;
        const current_date = (startDate ? moment(startDate) : moment()).utc().format(dateFormat);
        this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: '',           // selected date
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
        date  : (e) => { this.updateSelectedDate(e); },
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

    componentWillMount() {
        this.setState({ calendar_view: 'date' });
    }

    componentWillReceiveProps(nextProps) {
        const date = moment(this.state.calendar_date);

        if (date.isBefore(moment(nextProps.minDate))) {
            this.setState({
                date: nextProps.minDate,
            });
        } else if (date.isAfter(moment(nextProps.maxDate))) {
            this.setState({
                date: nextProps.maxDate,
            });
        }
    }

    navigateTo = (value, unit, is_add) => {
        const { dateFormat, maxDate, minDate } = this.props;

        let new_date = moment(this.state.calendar_date, dateFormat)[is_add ? 'add' : 'subtract'](value, unit).format(dateFormat);

        if (unit === 'months' && this.isPeriodDisabled(new_date, 'month')) return;

        if (unit === 'years'  && this.isPeriodDisabled(new_date, 'years')) {
            new_date = is_add ? maxDate : minDate;
        }

        this.setState({ calendar_date: moment(new_date, dateFormat).format(dateFormat) }); // formatted date
    }

    updateSelectedDate = (e) => {
        const { dateFormat, maxDate, minDate, onSelect } = this.props;

        const date      = moment(e.target.dataset.date);
        const min_date  = moment(minDate).format(dateFormat);
        const max_date  = moment(maxDate).format(dateFormat);
        const is_before = date.isBefore(min_date);
        const is_after  = date.isAfter(max_date);

        if (is_before || is_after) return;

        const formatted_date = date.format(dateFormat);
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
        const date = moment(this.state.calendar_date, this.props.dateFormat)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.dateFormat);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState({
            calendar_date: date,
            calendar_view: view_map[type],
        });
    }

    resetCalendar = () => {
        const { dateFormat, startDate } = this.props;

        const default_date = (startDate ? moment(startDate) : moment()).utc().format(dateFormat);
        this.setState({
            calendar_date: default_date,
            selected_date: '',
        });
    }

    setToday = () => {
        const { dateFormat, onSelect } = this.props;

        const now = moment().utc().format(dateFormat);
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
        const { maxDate, minDate } = this.props;

        const start_of_period = moment(date).startOf(unit);
        const end_of_period   = moment(date).endOf(unit);
        return end_of_period.isBefore(moment(minDate))
            || start_of_period.isAfter(moment(maxDate));
    }

    render() {
        const { children, dateFormat, footer, id, maxDate, minDate, showTodayBtn } = this.props;
        const { calendar_date, calendar_view, selected_date  } = this.state;

        return (
            <div id={id} className='calendar' value={selected_date}>
                { children }
                <CalendarHeader
                    calendarDate={calendar_date}
                    isPeriodDisabled={this.isPeriodDisabled}
                    onClick={this.navigators}
                    onSelect={this.calendarViews}
                    view={calendar_view}
                />
                <CalendarPanel
                    calendarDate={calendar_date}
                    dateFormat={dateFormat}
                    isPeriodDisabled={this.isPeriodDisabled}
                    maxDate={maxDate}
                    minDate={minDate}
                    onClick={this.panelSelectors}
                    selectedDate={selected_date}
                    view={calendar_view}
                />
                <CalendarFooter
                    footer={footer}
                    onClick={this.setToday}
                    showTodayBtn={showTodayBtn}
                />
            </div>
        );
    }
}

Calendar.defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    minDate   : moment(0).utc().format('YYYY-MM-DD'),              // by default, minDate is set to Unix Epoch (January 1st 1970)
    maxDate   : moment().utc().add(120, 'y').format('YYYY-MM-DD'), // by default, maxDate is set to 120 years after today
};

Calendar.propTypes = {
    children       : PropTypes.object,
    dateFormat     : PropTypes.string,
    footer         : PropTypes.string,
    onSelect       : PropTypes.func,
    id             : PropTypes.string,
    is_nativepicker: PropTypes.bool,
    maxDate        : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    minDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    showTodayBtn: PropTypes.bool,
    startDate   : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
};

export default Calendar;