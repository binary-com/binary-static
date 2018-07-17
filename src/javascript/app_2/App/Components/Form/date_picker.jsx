import classNames   from 'classnames';
import { observer } from 'mobx-react';
import moment       from 'moment';
import PropTypes    from 'prop-types';
import React        from 'react';
import ArrowHead    from '../Elements/arrowhead.jsx';
import { localize } from '../../../../_common/localize';

const month_headers = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const week_headers  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.getDays    = this.getDays.bind(this);
        this.getDates   = this.getDates.bind(this);
        this.getMonths  = this.getMonths.bind(this);
        this.getYears   = this.getYears.bind(this);
        this.getDecades = this.getDecades.bind(this);

        this.setToday      = this.setToday.bind(this);
        this.setActiveView = this.setActiveView.bind(this);

        this.nextMonth     = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);

        this.nextYear     = this.nextYear.bind(this);
        this.previousYear = this.previousYear.bind(this);

        this.nextDecade     = this.nextDecade.bind(this);
        this.previousDecade = this.previousDecade.bind(this);

        this.nextCentury     = this.nextCentury.bind(this);
        this.previousCentury = this.previousCentury.bind(this);

        this.handleDateSelected   = this.handleDateSelected.bind(this);
        this.handleMonthSelected  = this.handleMonthSelected.bind(this);
        this.handleYearSelected   = this.handleYearSelected.bind(this);
        this.handleDecadeSelected = this.handleDecadeSelected.bind(this);

        this.onChangeInput = this.onChangeInput.bind(this);
        this.resetCalendar = this.resetCalendar.bind(this);

        const { startDate, minDate, initial_value } = props;

        const current_date = moment.utc(startDate || minDate).format(this.props.dateFormat);

        this.state = {
            date         : current_date, // calendar dates reference
            selected_date: initial_value !== undefined ? initial_value : current_date, // selected date
        };
    }

    componentWillMount() {
        this.setState({ active_view: 'date' });
    }

    componentWillReceiveProps(nextProps) {
        const moment_date = moment.utc(this.state.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        if (moment_date.isBefore(moment.utc(nextProps.minDate))) {
            this.setState({
                date: nextProps.minDate,
            });
        } else if (moment_date.isAfter(moment.utc(nextProps.maxDate))) {
            this.setState({
                date: nextProps.maxDate,
            });
        }
    }

    setToday() {
        const now = moment().utc().format(this.props.dateFormat);
        this.setState({
            date         : now,
            selected_date: now,
            active_view  : 'date',
        });
        this.props.handleDateChange(now, true);
    }

    updateDate(value, unit, is_add) {
        let new_date = moment.utc(this.state.date)[is_add ? 'add' : 'subtract'](value, unit).format(this.props.dateFormat);

        if (unit === 'months' && this.isPeriodDisabled(new_date, 'month')) return;

        if (unit === 'years'  && this.isPeriodDisabled(new_date, 'month')) {
            new_date = is_add ? this.props.maxDate : this.props.minDate;
        }

        this.setState({ date: new_date });
    }

    isPeriodDisabled(date, unit) {
        const moment_date = moment.utc(date);
        return moment_date.clone().endOf(unit).isBefore(moment.utc(this.props.minDate))
            || moment_date.clone().startOf(unit).isAfter(moment.utc(this.props.maxDate));
    }

    nextMonth() {
        this.updateDate(1, 'months', true);
    }

    previousMonth() {
        this.updateDate(1, 'months', false);
    }

    nextYear() {
        this.updateDate(1, 'years', true);
    }

    previousYear() {
        this.updateDate(1, 'years', false);
    }

    nextDecade() {
        this.updateDate(10, 'years', true);
    }

    previousDecade() {
        this.updateDate(10, 'years', false);
    }

    nextCentury() {
        this.updateDate(100, 'years', true);
    }

    previousCentury() {
        this.updateDate(100, 'years', false);
    }

    setActiveView(active_view) {
        this.setState({ active_view });
    }

    handleDateSelected(e, is_disabled) {
        if (is_disabled) {
            return;
        }

        const moment_date = moment.utc(e.target.dataset.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        if (moment_date.isBefore(moment.utc(this.props.minDate)) ||
            moment_date.isAfter(moment.utc(this.props.maxDate))) {
            return;
        }

        const formatted_date = moment_date.format(this.props.dateFormat);
        this.setState({
            date         : formatted_date,
            selected_date: formatted_date,
        });
        this.props.handleDateChange(formatted_date);
    }

    updateSelected(e, type) {
        const active_view = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        const date = moment.utc(this.state.date)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.dateFormat);

        if (this.isPeriodDisabled(date, type)) return;

        this.setState({
            date,
            active_view: active_view[type],
        });
    }

    handleMonthSelected(e) {
        this.updateSelected(e, 'month');
    }

    handleYearSelected(e) {
        this.updateSelected(e, 'year');
    }

    handleDecadeSelected(e) {
        this.updateSelected(e, 'decade');
    }

    onChangeInput(e) {
        let value = e.target.value;

        if (this.props.mode === 'duration' && value) { // TODO: these kinds of logic should update store instead of just component's state
            value = moment.utc().add(value || 1, 'days');
        }

        this.setState({ selected_date: value }); // update calendar input

        if (moment.utc(value, 'YYYY-MM-DD', true).isValid() || !value) {
            this.props.handleDateChange(value, true);

            if (!value) {
                const { startDate, minDate } = {...this.props};
                const currentDate = moment.utc(startDate || minDate).format(this.props.dateFormat);
                this.setState({ date: currentDate });
            } else {
                this.setState({ date: moment.utc(value).format(this.props.dateFormat) }); // update calendar dates
            }
        }
    }

    resetCalendar() {
        const { startDate, minDate } = this.props;
        const default_date = moment.utc(startDate || minDate).format(this.props.dateFormat);
        this.setState({
            date         : default_date,
            selected_date: '',
        });
    }

    getDays() {
        const dates = [];
        const days  = [];
        const moment_today       = moment().utc();
        const moment_cur_date    = moment.utc(this.state.date);
        const moment_month_start = moment_cur_date.clone().startOf('month');
        const moment_month_end   = moment_cur_date.clone().endOf('month');
        const first_day          = moment_month_start.day();
        const last_day           = moment_month_end.day();
        const moment_min_date    = moment.utc(this.props.minDate);
        const moment_max_date    = moment.utc(this.props.maxDate);
        const moment_selected    = moment.utc(this.state.selected_date);

        const pad = (value) => (`0${value}`).substr(-2); // pad zero

        for (let i = first_day; i > 0; i--) {
            dates.push(moment_month_start.clone().subtract(i, 'day').format(this.props.dateFormat));
        }
        for (let idx = 1; idx < moment_cur_date.daysInMonth() + 1; idx += 1) {
            dates.push(moment_cur_date.clone().format(this.props.dateFormat.replace('DD', pad(idx))));
        }
        for (let i = 1; i <= 6 - last_day; i++) {
            dates.push(moment_month_end.clone().add(i, 'day').format(this.props.dateFormat));
        }

        dates.forEach((date) => {
            const moment_date    = moment.utc(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            const is_disabled    = moment_date.isBefore(moment_min_date) || moment_date.isAfter(moment_max_date);
            const is_other_month = moment_date.isBefore(moment_month_start) || moment_date.isAfter(moment_month_end);
            const is_active      = this.state.selected_date && moment_date.isSame(moment_selected);
            const is_today       = moment_date.isSame(moment_today, 'day');

            days.push(
                <span
                    key={date}
                    className={classNames('calendar-date', {
                        active  : is_active,
                        today   : is_today,
                        disabled: is_disabled,
                        hidden  : is_other_month,
                    })}
                    onClick={(e) => { this.handleDateSelected(e, is_disabled); }}
                    data-date={date}
                >
                    {moment_date.date()}
                </span>
            );
        });

        return days;
    }

    getDates() {
        const days = this.getDays().map(day => day);

        return (
            <div className='calendar-date-panel'>
                {week_headers.map((item, idx) => (<span key={idx} className='calendar-date-header'>{localize(item)}</span>))}
                {days}
            </div>
        );
    }

    getMonths() {
        const moment_date    = moment.utc(this.state.date);
        const selected_month = moment.utc(this.state.selected_date).month();
        return (
            <div className='calendar-month-panel'>
                {month_headers.map((item, idx) => (
                    <span
                        key={idx}
                        className={classNames('calendar-month', {
                            active  : idx === selected_month,
                            disabled: this.isPeriodDisabled(moment_date.month(item), 'month'),
                        })}
                        onClick={this.handleMonthSelected}
                        data-month={idx}
                    >
                        {localize(item)}
                    </span>
                ))}
            </div>
        );
    }

    getYears() {
        const selected_year = moment.utc(this.state.selected_date).year();
        const moment_date   = moment.utc(this.state.date);
        const current_year  = moment_date.year();
        const years         = [];
        for (let year = current_year - 1; year < current_year + 11; year++) {
            years.push(year);
        }
        return (
            <div className='calendar-year-panel'>
                {years.map((year, idx) => (
                    <span
                        key={idx}
                        className={classNames('calendar-year', {
                            disabled: this.isPeriodDisabled(moment_date.year(year), 'year'),
                            active  : year === selected_year,
                        })}
                        onClick={this.handleYearSelected}
                        data-year={year}
                    >
                        {year}
                    </span>
                ))}
            </div>
        );
    }

    getDecades() {
        const selected_year = moment.utc(this.state.selected_date).year();
        const moment_date   = moment.utc(this.state.date);

        const decades = [];
        let min_year  = moment_date.year() - 10;
        for (let i = 0; i < 12; i++) {
            const max_year = min_year + 9;
            const range = `${min_year}-${max_year}`;
            decades.push(range);
            min_year = max_year + 1;
        }

        return (
            <div className='calendar-decade-panel'>
                {decades.map((range, idx) => {
                    const [start_year, end_year] = range.split('-');
                    return (
                        <span
                            key={idx}
                            className={classNames('calendar-decade', {
                                disabled: this.isPeriodDisabled(moment_date.year(start_year), 'year') && this.isPeriodDisabled(moment_date.year(end_year), 'year'),
                                active  : start_year === selected_year,
                            })}
                            onClick={this.handleDecadeSelected}
                            data-decade={range}
                        >
                            {range}
                        </span>
                    );
                })}
            </div>
        );
    }

    render() {
        const view = this.state.active_view;

        const is_date_view   = (view === 'date');
        const is_month_view  = (view === 'month');
        const is_year_view   = (view === 'year');
        const is_decade_view = (view === 'decade');
        const moment_date    = moment.utc(this.state.date);

        const BtnPrevMonth = (is_date_view &&
            <span
                type='button'
                className={classNames('calendar-prev-month-btn', {
                    hidden: this.isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month'),
                })}
                onClick={this.previousMonth}
            />
        );
        const BtnNextMonth = (is_date_view &&
            <span
                type='button'
                className={classNames('calendar-next-month-btn', {
                    hidden: this.isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month'),
                })}
                onClick={this.nextMonth}
            />
        );

        const BtnPrevYear = (
            <span
                type='button'
                className={classNames('calendar-prev-year-btn', {
                    hidden: this.isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month'),
                })}
                onClick={() => (((is_date_view || is_month_view) && this.previousYear())
                    || (is_year_view && this.previousDecade()) || (is_decade_view && this.previousCentury()) )}
            />
        );

        const BtnNextYear = (
            <span
                type='button'
                className={classNames('calendar-next-year-btn', {
                    hidden: this.isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month'),
                })}
                onClick={() => (((is_date_view || is_month_view) && this.nextYear())
                    || (is_year_view && this.nextDecade()) || (is_decade_view && this.nextCentury()) )}
            />
        );

        const SelectMonth = (is_date_view &&
            <span type='button' className='calendar-select-month-btn' onClick={() => this.setActiveView('month')}>
                { moment_date.format('MMM') }
            </span>
        );

        const SelectYear = (
            <span
                type='button'
                className='calendar-select-year-btn'
                onClick={() => ((is_date_view || is_month_view) ? this.setActiveView('year') : this.setActiveView('decade'))}
            >
                { moment_date.year() }
                { is_year_view   && `-${moment_date.clone().add(9, 'years').year()}`  }
                { is_decade_view && `-${moment_date.clone().add(99, 'years').year()}` }
            </span>
        );

        const PanelCalendar = ((is_date_view && this.getDates()) || (is_month_view && this.getMonths())
            || (is_year_view && this.getYears()) || (is_decade_view && this.getDecades())
        );

        const value = this.props.mode === 'duration' ? getDayDifference(this.state.selected_date) : this.state.selected_date;

        return (
            <div className='calendar'>
                <input
                    type='text'
                    placeholder={this.props.placeholder || (this.props.mode === 'duration' ? localize('Select a duration') : localize('Select date'))}
                    value={value}
                    onChange={this.onChangeInput}
                    className='calendar-input'
                />
                <div className='calendar-header'>
                    { BtnPrevYear }
                    { BtnPrevMonth }
                    <div className='calendar-select'>
                        { SelectMonth }
                        { SelectYear }
                    </div>
                    { BtnNextMonth }
                    { BtnNextYear }
                </div>
                <div className='calendar-panel'>
                    { PanelCalendar }
                </div>
                <div className='calendar-footer'>
                    { this.props.footer && <span className='calendar-footer-extra'>{this.props.footer}</span> }
                    { this.props.showTodayBtn &&
                        <span className='calendar-footer-btn'>
                            <a role='button' onClick={this.setToday}>{localize('Today')}</a>
                        </span>
                    }
                </div>
            </div>
        );
    }
}

Calendar.defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    minDate   : moment(0).utc().format('YYYY-MM-DD'),                   // by default, minDate is set to Unix Epoch (January 1st 1970)
    maxDate   : moment().utc().add(120, 'y').format('YYYY-MM-DD'),      // by default, maxDate is set to 120 years after today
};


const getDayDifference = (date) => {
    const diff = moment.utc(date).diff(moment().utc(), 'days');
    return (!date || diff < 0) ? '' : diff + 1;
};

class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleVisibility   = this.handleVisibility.bind(this);
        this.handleDateChange   = this.handleDateChange.bind(this);
        this.handleMouseEnter   = this.handleMouseEnter.bind(this);
        this.handleMouseLeave   = this.handleMouseLeave.bind(this);

        const selected_date = props.initial_value !== undefined
            ? props.initial_value
            : moment.utc(this.props.minDate).format(this.props.dateFormat);

        this.state = {
            selected_date,
            is_calendar_visible : false,
            is_close_btn_visible: false,
        };
    }

    componentDidMount() {
        this.props.onChange({ target: { name: this.props.name, value: this.getPickerValue() } });
    }

    componentWillMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(e) {
        if (!this.mainNode.contains(e.target) && this.state.is_calendar_visible) {
            this.setState({ is_calendar_visible: false });
        }
    }

    handleVisibility() {
        this.setState({
            is_calendar_visible: !this.state.is_calendar_visible,
        });
    }

    handleMouseEnter() {
        if (this.getPickerValue()) {
            this.setState({ is_close_btn_visible: true });
        }
    }

    handleMouseLeave() {
        this.setState({ is_close_btn_visible: false });
    }

    handleDateChange(selected_date, is_calendar_visible) {
        let value = selected_date;
        if (!moment.utc(value).isValid) {
            value = '';
        }

        this.setState({
            selected_date: value,
            is_calendar_visible,
        },
        this.changeCallback);
    }

    changeCallback = () => {
        this.props.onChange({ target: { name: this.props.name, value: this.getPickerValue() } });
    };

    clearDateInput = () => {
        this.setState({ selected_date: '' }, this.changeCallback);
        this.calendar.resetCalendar();
    };

    getPickerValue = () => {
        const { mode } = this.props;
        const { selected_date } = this.state;
        return mode === 'duration' ? getDayDifference(selected_date) : selected_date;
    }


    render() {
        const value = this.getPickerValue();
        if (this.props.is_nativepicker) {
            return (
                <div ref={node => { this.mainNode = node; }} className='datepicker-container'>
                    <input
                        id={this.props.name}
                        name={this.props.name}
                        className='datepicker-display'
                        type='date'
                        value={value}
                        min={this.props.minDate}
                        max={this.props.maxDate}
                        onChange={(e) => {
                            // fix for ios issue: clear button doesn't work
                            // https://github.com/facebook/react/issues/8938
                            const target = e.nativeEvent.target;
                            function iosClearDefault() { target.defaultValue = ''; }
                            window.setTimeout(iosClearDefault, 0);

                            this.handleDateChange(e.target.value);
                        }}
                    />
                    <label className='datepicker-native-overlay' htmlFor={this.props.name}>
                        {value || this.props.placeholder}
                        <ArrowHead className='datepicker-native-overlay__arrowhead' />
                    </label>
                </div>
            );
        }
        return (
            <div ref={node => { this.mainNode = node; }} className='datepicker-container'>
                <div
                    className='datepicker-display-wrapper'
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <input
                        id={this.props.id}
                        name={this.props.name}
                        className='datepicker-display'
                        value={value}
                        readOnly
                        placeholder={this.props.placeholder || (this.props.mode === 'duration' ? localize('Select a duration') : localize('Select date'))}
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={classNames('picker-calendar-icon', {
                            show: !this.state.is_close_btn_visible,
                        })}
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={classNames('close-circle-icon', {
                            show: this.state.is_close_btn_visible,
                        })}
                        onClick={this.clearDateInput}
                    />
                </div>
                <div
                    className={classNames('datepicker-calendar', {
                        show: this.state.is_calendar_visible,
                    })}
                >
                    <Calendar
                        ref={node => { this.calendar = node; }}
                        handleDateChange={this.handleDateChange}
                        {...this.props}
                    />
                </div>
            </div>
        );
    }
}

DatePicker.defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    mode      : 'date',
};

// ToDo: Refactor Calendar and trade_store.
// Need major refactorization in helper function.
Calendar.propTypes = {
    dateFormat      : PropTypes.string,
    footer          : PropTypes.string,
    handleDateChange: PropTypes.func,
    id              : PropTypes.number,
    initial_value   : PropTypes.string,
    is_nativepicker : PropTypes.bool,
    maxDate         : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    minDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    mode        : PropTypes.string,
    placeholder : PropTypes.string,
    showTodayBtn: PropTypes.bool,
    startDate   : PropTypes.string,
};

// ToDo: Refactor DatePicker and trade_store.
// Need major refactorization in helper function.
DatePicker.propTypes = {
    dateFormat     : PropTypes.string,
    id             : PropTypes.number,
    initial_value  : PropTypes.string,
    is_nativepicker: PropTypes.bool,
    maxDate        : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    minDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    mode        : PropTypes.string,
    name        : PropTypes.string,
    onChange    : PropTypes.func,
    placeholder : PropTypes.string,
    showTodayBtn: PropTypes.bool,
};

export default observer(DatePicker);
