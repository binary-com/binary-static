import React from 'react';
import moment from 'moment';
import { localize } from '../../../../../_common/localize';

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

        const { startDate, minDate } = {...props};

        const current_date = moment(startDate || minDate).format(this.props.dateFormat);

        this.state = {
            date         : current_date, // calendar dates reference
            selected_date: current_date, // selected date
        };
    }

    componentWillMount() {
        this.setState({ active_view: 'date' });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const should_update = (this.state.active_view !== nextState.active_view)
            || (this.state.date !== nextState.date) || (this.state.selected_date !== nextState.selected_date);
        return should_update || false;
    }

    setToday() {
        const now = moment().format(this.props.dateFormat);
        this.setState({
            date         : now,
            selected_date: now,
            active_view  : 'date',
        });
        this.props.handleDateChange(now, true);
    }

    updateDate(value, unit, is_add) {
        this.setState({ date: moment(this.state.date)[is_add ? 'add' : 'subtract'](value, unit).format(this.props.dateFormat) });
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
        this.updateDate(10, 'years', true);
    }

    nextCentury() {
        this.updateDate(100, 'years', true);
    }

    previousCentury() {
        this.updateDate(100, 'years', true);
    }

    setActiveView(active_view) {
        this.setState({ active_view });
    }

    handleDateSelected(e) {
        const current_date = moment(this.state.date);
        const date         = moment(e.target.dataset.date);
        const min_date     = moment(this.props.minDate).format(this.props.dateFormat);
        const max_date     = moment(this.props.maxDate).format(this.props.dateFormat);

        const is_before     = date.isBefore(min_date);
        const is_today      = date.isSame(min_date);
        const is_after      = date.isAfter(max_date);
        const is_prev_month = date.month() < current_date.month();
        const is_next_month = date.month() > current_date.month();

        if (is_prev_month && !is_before) {
            this.previousMonth();
        }
        if (is_next_month) {
            this.nextMonth();
        }

        if ((!is_before && !is_after)|| is_today) {
            const formatted_date = date.format(this.props.dateFormat);
            this.setState({
                date         : formatted_date,
                selected_date: formatted_date,
            });
            this.props.handleDateChange(formatted_date);
        }
    }

    updateSelected(e, type) {
        const active_view = {
            month : 'date',
            year  : 'month',
            decade: 'year',
        };
        const date = moment(this.state.date)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(this.props.dateFormat);
        this.setState({
            date,
            selected_date: date,
            active_view  : active_view[type],
        });
        this.props.handleDateChange(date, true);
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
        const value = e.target.value;
        this.setState({ selected_date: value }); // update calendar input

        if (moment(value, 'YYYY-MM-DD', true).isValid() || !value) {
            this.props.handleDateChange(value, true);

            if (!value) {
                const { startDate, minDate } = {...this.props};
                const currentDate = moment(startDate || minDate).format(this.props.dateFormat);
                this.setState({ date: currentDate });
            } else {
                this.setState({ date: moment(value).format(this.props.dateFormat) }); // update calendar dates
            }
        }
    }

    resetCalendar() {
        const date = moment(this.props.minDate).format(this.props.dateFormat);
        this.setState({
            date,
            selected_date: date,
        });
    }

    getDays() {
        const dates = [];
        const days  = [];
        const num_of_days    = moment(this.state.date).daysInMonth() + 1;
        const start_of_month = moment(this.state.date).startOf('month').format(this.props.dateFormat);
        const end_of_month   = moment(this.state.date).endOf('month').format(this.props.dateFormat);
        const first_day = moment(start_of_month).day();
        const last_day  = moment(end_of_month).day();

        const pad = (value) => (`0${value}`).substr(-2); // pad zero

        for (let i = first_day; i > 0; i--) {
            dates.push(moment(start_of_month).subtract(i, 'day').format(this.props.dateFormat));
        }
        for (let idx = 1; idx < num_of_days; idx += 1) {
            dates.push(moment(this.state.date).format(this.props.dateFormat.replace('DD', pad(idx))));
        }
        for (let i = 1; i <= 6 - last_day; i++) {
            dates.push(moment(end_of_month).add(i, 'day').format(this.props.dateFormat));
        }

        dates.forEach((date) => {
            const is_disabled = moment(date).isBefore(moment(start_of_month))
                || moment(date).isAfter(moment(end_of_month))
                || moment(date).isBefore(moment(this.props.minDate).subtract(1, 'day'))
                || moment(date).isAfter(moment(this.props.maxDate));
            const is_active = moment(date).isSame(moment(this.state.date));
            const is_today  = moment(date).isSame(moment().utc(), 'day');

            days.push(
                <span
                    key={date}
                    className={`calendar-date${is_active ? ' active' : ''}${is_today ? ' today' : ''}${is_disabled ? ' disabled' : ''}`}
                    onClick={this.handleDateSelected}
                    data-date={date}
                >
                    {moment(date).date()}
                </span>
            );
        });

        return days;
    }

    getDates() {
        const days = this.getDays().map(day => day);
        const week_headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return (
            <div className='calendar-date-panel'>
                {week_headers.map((item, idx) => (<span key={idx} className='calendar-date-header'>{localize(item)}</span>))}
                {days}
            </div>
        );
    }

    getMonths() {
        const is_active     = moment(this.state.selected_date).month();
        const month_headers = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
            <div className='calendar-month-panel'>
                {month_headers.map((item, idx) => (
                    <span
                        key={idx}
                        className={`calendar-month${idx === is_active ? ' active' : ''}`}
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
        const is_active    = moment(this.state.selected_date).year();
        const current_year = moment(this.state.date).year();
        const years = [];
        for (let year = current_year - 1; year < current_year + 11; year++) {
            years.push(year);
        }
        return (
            <div className='calendar-year-panel'>
                {years.map((year, idx) => (
                    <span
                        key={idx}
                        className={`calendar-year${(idx === 0 || idx === 11 ) ? ' disabled' : ''}${year === is_active ? ' active' : ''}`}
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
        const is_active    = moment(this.state.selected_date).year();
        const current_year = moment(this.state.date).year();
        const decades      = [];
        let min_year       = current_year - 10;

        for (let i = 0; i < 12; i++) {
            const max_year = min_year + 9;
            const range = `${min_year}-${max_year}`;
            decades.push(range);
            min_year = max_year + 1;
        }

        return (
            <div className='calendar-decade-panel'>
                {decades.map((range, idx) => (
                    <span
                        key={idx}
                        className={`calendar-decade${(idx === 0 || idx === 11) ? ' disabled' : ''}${range.split('-')[0] === is_active ? 'active' : ''}`}
                        onClick={this.handleDecadeSelected}
                        data-decade={range}
                    >
                        {range}
                    </span>
                ))}
            </div>
        );
    }

    render() {
        const view = this.state.active_view;

        const is_date_view   = (view === 'date');
        const is_month_view  = (view === 'month');
        const is_year_view   = (view === 'year');
        const is_decade_view = (view === 'decade');

        const BtnPrevMonth = (is_date_view && <span type='button' className='calendar-next-month-btn' onClick={this.nextMonth} />);
        const BtnNextMonth = (is_date_view && <span type='button' className='calendar-prev-month-btn' onClick={this.previousMonth} />);

        const BtnPrevYear = (
            <span
                type='button'
                className='calendar-prev-year-btn'
                onClick={() => (((is_date_view || is_month_view) && this.previousYear())
                    || (is_year_view && this.previousDecade()) || (is_decade_view && this.previousCentury()) )}
            />
        );

        const BtnNextYear = (
            <span
                type='button'
                className='calendar-next-year-btn'
                onClick={() => (((is_date_view || is_month_view) && this.nextYear())
                    || (is_year_view && this.nextDecade()) || (is_decade_view && this.nextCentury()) )}
            />
        );

        const SelectMonth = (is_date_view &&
            <span type='button' className='calendar-select-month-btn' onClick={() => this.setActiveView('month')}>
                { moment(this.state.date).format('MMM') }
            </span>
        );

        const SelectYear = (
            <span
                type='button'
                className='calendar-select-year-btn'
                onClick={() => ((is_date_view || is_month_view) ? this.setActiveView('year') : this.setActiveView('decade'))}
            >
                { moment(this.state.date).year() }
                { is_year_view   && `-${moment(this.state.date).add(9, 'years').year()}`  }
                { is_decade_view && `-${moment(this.state.date).add(99, 'years').year()}` }
            </span>
        );

        const PanelCalendar = ((is_date_view && this.getDates()) || (is_month_view && this.getMonths())
            || (is_year_view && this.getYears()) || (is_decade_view && this.getDecades())
        );

        return (
            <div className='calendar'>
                <input
                    type='text'
                    placeholder='Select date'
                    value={this.state.selected_date}
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
    minDate   : moment().utc().subtract(120, 'y').format('YYYY-MM-DD'), // by default, minDate is set to 120 years before today
    maxDate   : moment().utc().add(120, 'y').format('YYYY-MM-DD'),      // by default, maxDate is set to 120 years after today
};


const getDayDifference = (date) => {
    const diff = moment(date).diff(moment().utc(), 'days');
    return (!date || diff < 0) ? 1 : diff + 1;
};

class DatePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleVisibility   = this.handleVisibility.bind(this);
        this.handleDateChange   = this.handleDateChange.bind(this);
        this.handleMouseEnter   = this.handleMouseEnter.bind(this);
        this.handleMouseLeave   = this.handleMouseLeave.bind(this);

        this.clearDateInput = this.clearDateInput.bind(this);
        this.getPickerValue = this.getPickerValue.bind(this);
        this.setPickerValue = this.setPickerValue.bind(this);

        this.state = {
            selected_date       : moment(this.props.minDate).format(this.props.dateFormat),
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
        if (!moment(value).isValid) {
            value = '';
        }

        this.setState({
            selected_date: value,
            is_calendar_visible,
        });

        this.setPickerValue(value);
    }

    clearDateInput() {
        this.setState({ selected_date: '' });
        this.setPickerValue();
        this.calendar.resetCalendar();
    }

    getPickerValue() {
        return this.props.displayFormat === 'd' ? getDayDifference(this.state.selected_date) : this.state.selected_date;
    }

    setPickerValue(value) {
        const val = this.props.displayFormat === 'd' ? getDayDifference(value) : value;
        this.props.onChange({ target: { name: this.props.name, value: val } });
    }

    render() {
        const value = this.getPickerValue();
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
                        placeholder={localize('Select date')}
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={`picker-calendar-icon ${this.state.is_close_btn_visible ? '': 'show'}`}
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={`close-circle-icon ${this.state.is_close_btn_visible ? 'show': ''}`}
                        onClick={this.clearDateInput}
                    />
                </div>
                <div className={`datepicker-calendar ${this.state.is_calendar_visible ? 'show' : ''}`}>
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
    dateFormat   : 'YYYY-MM-DD',
    displayFormat: 'date',
};

export default DatePicker;
