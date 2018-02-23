import React from 'react';
import moment from 'moment';

class Calendar extends React.Component {
    CALENDAR_VIEWS = {
        DATE  : 'date',
        MONTH : 'month',
        YEAR  : 'year',
        DECADE: 'decade',
    };

    constructor(props) {
        super(props);

        this.getDays = this.getDays.bind(this);
        this.getDates = this.getDates.bind(this);
        this.getMonths = this.getMonths.bind(this);
        this.getYears = this.getYears.bind(this);
        this.getDecades = this.getDecades.bind(this);

        this.setToday = this.setToday.bind(this);

        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);

        this.nextYear = this.nextYear.bind(this);
        this.previousYear = this.previousYear.bind(this);

        this.nextDecade = this.nextDecade.bind(this);
        this.previousDecade = this.previousDecade.bind(this);

        this.nextCentury = this.nextCentury.bind(this);
        this.previousCentury = this.previousCentury.bind(this);

        this.selectView = this.selectView.bind(this);
        this.getActiveView = this.getActiveView.bind(this);

        this.handleDateSelected = this.handleDateSelected.bind(this);
        this.handleMonthSelected = this.handleMonthSelected.bind(this);
        this.handleYearSelected = this.handleYearSelected.bind(this);
        this.handleDecadeSelected = this.handleDecadeSelected.bind(this);

        this.onChangeInput = this.onChangeInput.bind(this);

        this.state = {
            date        : this.props.minDate, // calendar dates reference
            selectedDate: this.props.minDate, // selected date
        };
    }

    componentWillMount() {
        this.setState({ activeView: this.CALENDAR_VIEWS.DATE });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const shouldUpdate = (this.state.activeView !== nextState.activeView)
            || (this.state.date !== nextState.date)
            || (this.state.selectedDate !== nextState.selectedDate);
        return shouldUpdate || false;
    }

    setToday() {
        const now = moment().format(this.props.dateFormat);
        this.setState({
            date        : now,
            selectedDate: now,
            activeView  : this.CALENDAR_VIEWS.DATE,
        });
        this.props.handleDateChange(now, true);
    }

    nextMonth() {
        this.setState({ date: moment(this.state.date).add(1, 'months').format(this.props.dateFormat) });
    }

    previousMonth() {
        this.setState({ date: moment(this.state.date).subtract(1, 'months').format(this.props.dateFormat) });
    }

    nextYear() {
        this.setState({ date: moment(this.state.date).add(1, 'years').format(this.props.dateFormat) });
    }

    previousYear() {
        this.setState({ date: moment(this.state.date).subtract(1, 'years').format(this.props.dateFormat) });
    }

    nextDecade() {
        this.setState({ date: moment(this.state.date).add(10, 'years').format(this.props.dateFormat) });
    }

    previousDecade() {
        this.setState({ date: moment(this.state.date).subtract(10, 'years').format(this.props.dateFormat) });
    }

    nextCentury() {
        this.setState({ date: moment(this.state.date).add(100, 'years').format(this.props.dateFormat) });
    }

    previousCentury() {
        this.setState({ date: moment(this.state.date).subtract(100, 'years').format(this.props.dateFormat) });
    }

    selectView(activeView) {
        this.setState({ activeView });
    }

    handleDateSelected(e) {
        const currentDate = moment(this.state.date);
        const date        = moment(e.target.dataset.date);
        const minDate     = moment(this.props.minDate).format(this.props.dateFormat);
        const maxDate     = moment(this.props.maxDate).format(this.props.dateFormat);
        
        const dateBefore = date.isBefore(minDate);
        const dateToday  = date.isSame(minDate);
        const dateAfter  = date.isAfter(maxDate);
        const prevMonth  = date.month() < currentDate.month();
        const nextMonth  = date.month() > currentDate.month();

        if ((!dateBefore && !dateAfter)|| dateToday) {
            this.setState({
                date        : date.format(this.props.dateFormat),
                selectedDate: date.format(this.props.dateFormat),
            });
            this.props.handleDateChange(date.format(this.props.dateFormat));
        }

        if (prevMonth && !dateBefore) {
            this.previousMonth();
        }
        if (nextMonth) {
            this.nextMonth();
        }
    }

    handleMonthSelected(e) {
        const date = moment(this.state.date).month(e.target.dataset.month).format(this.props.dateFormat);
        this.setState({
            date,
            selectedDate: date,
            activeView  : this.CALENDAR_VIEWS.DATE,
        });
        this.props.handleDateChange(date, true);
    }

    handleYearSelected(e) {
        const date = moment(this.state.date).year(e.target.dataset.year).format(this.props.dateFormat);
        this.setState({
            date,
            selectedDate: date,
            activeView  : this.CALENDAR_VIEWS.MONTH,
        });
        this.props.handleDateChange(date, true);
    }

    handleDecadeSelected(e) {
        const year = e.target.dataset.decade.split('-')[0];
        const date = moment(this.state.date).year(year).format(this.props.dateFormat);
        this.setState({
            date,
            selectedDate: date,
            activeView  : this.CALENDAR_VIEWS.YEAR,

        });
        this.props.handleDateChange(date, true);
    }

    onChangeInput(e) {
        const value = e.target.value;
        this.setState({
            selectedDate: value, // update calendar input
        });
        this.props.handleDateChange(value, true);

        if (value.length < 10) return; // don't update calendar dates

        this.setState({
            date: moment(value).format(this.props.dateFormat),
        });
    }

    getDays() {
        const dates = [];
        const days  = [];
        const numOfDays    = moment(this.state.date).daysInMonth() + 1;
        const startOfMonth = moment(this.state.date).startOf('month').format(this.props.dateFormat);
        const endOfMonth   = moment(this.state.date).endOf('month').format(this.props.dateFormat);
        const firstDay = moment(startOfMonth).day();
        const lastDay  = moment(endOfMonth).day();

        const pad = (value, length) => {
            let val = value;
            if (value.toString().length < length) {
                val = `0${value}`;
            }
            return val;
        };

        for (let i = firstDay; i > 0; i--) {
            dates.push(moment(startOfMonth).subtract(i, 'day').format(this.props.dateFormat));
        }
        for (let idx = 1; idx < numOfDays; idx += 1) {
            dates.push(moment(this.state.date).format(this.props.dateFormat.replace('DD', pad(idx, 2))));
        }
        for (let i = 1; i <= 6 - lastDay; i++) {
            dates.push(moment(endOfMonth).add(i, 'day').format(this.props.dateFormat));
        }

        dates.forEach((date) => {
            const isDisabled = moment(date).isBefore(moment(startOfMonth))
                || moment(date).isAfter(moment(endOfMonth))
                || moment(date).isBefore(moment(this.props.minDate))
                || moment(date).isAfter(moment(this.props.maxDate));
            const isActive = moment(date).isSame(moment(this.state.date));
            const isToday  = moment(date).isSame(moment(), 'day');

            days.push(
                <span
                    key={date}
                    className={`calendar-date${isActive ? ' calendar-date-active' : ''}${isToday ? ' calendar-date-today' : ''}${isDisabled ? ' calendar-date-disabled' : ''}`}
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
        const weekHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return (
            <div className='calendar-date-panel'>
                {weekHeaders.map((item, idx) => (<span key={idx} className='calendar-date-header'>{item}</span>))}
                {days}
            </div>
        );
    }

    getMonths() {
        const isActive     = moment(this.state.selectedDate).month();
        const monthHeaders = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
            <div className='calendar-month-panel'>
                {monthHeaders.map((item, idx) => (
                    <span
                        key={idx}
                        className={`calendar-month${idx === isActive ? ' calendar-month-active' : ''}`}
                        onClick={this.handleMonthSelected}
                        data-month={idx}
                    >
                    {item}
                    </span>
                ))}
            </div>
        );
    }

    getYears() {
        const isActive    = moment(this.state.selectedDate).year();
        const currentYear = moment(this.state.date).year();
        const years = [];
        for (let year = currentYear - 1; year < currentYear + 11; year++) {
            years.push(year);
        }
        return (
            <div className='calendar-year-panel'>
                {years.map((year, idx) => (
                    <span
                        key={idx}
                        className={`calendar-year${(idx === 0 || idx === 11 ) ? ' calendar-year-disabled' : ''}${year === isActive ? ' calendar-year-active' : ''}`}
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
        const isActive    = moment(this.state.selectedDate).year();
        const currentYear = moment(this.state.date).year();
        const decades = [];
        let minYear = currentYear - 10;
        for (let i = 0; i < 12; i++) {
            const maxYear = minYear + 9;
            const range = `${minYear}-${maxYear}`;
            decades.push(range);
            minYear = maxYear + 1;
        }
        return (
            <div className='calendar-decade-panel'>
                {decades.map((range, idx) => (
                    <span
                        key={idx}
                        className={`calendar-decade${(idx === 0 || idx === 11) ? ' calendar-decade-disabled' : ''}${range.split('-')[0] === isActive ? 'calendar-decade-active' : ''}`}
                        onClick={this.handleDecadeSelected}
                        data-decade={range}
                    >
                        {range}
                    </span>
                ))}
            </div>
        );
    }

    getActiveView() {
        return this.state.activeView;
    }

    render() {
        const isDateView   = (this.getActiveView() === this.CALENDAR_VIEWS.DATE);
        const isYearView   = (this.getActiveView() === this.CALENDAR_VIEWS.YEAR);
        const isMonthView  = (this.getActiveView() === this.CALENDAR_VIEWS.MONTH);
        const isDecadeView = (this.getActiveView() === this.CALENDAR_VIEWS.DECADE);

        const prevYearHandler = () => (((isDateView || isMonthView) && this.previousYear())
            || (isYearView   && this.previousDecade())
            || (isDecadeView && this.previousCentury()));

        const nextYearHandler = () => (((isDateView || isMonthView) && this.nextYear())
            || (isYearView   && this.nextDecade())
            || (isDecadeView && this.nextCentury()));

        const selectYearHandler = () => ((isDateView || isMonthView) && this.selectView(this.CALENDAR_VIEWS.YEAR))
            || (isYearView && this.selectView(this.CALENDAR_VIEWS.DECADE));

        const selectYearValue = (
            ((isDateView || isMonthView) && moment(this.state.date).year())
            || (isYearView   && `${moment(this.state.date).year()}-${moment(this.state.date).add(9, 'years').year()}`)
            || (isDecadeView && `${moment(this.state.date).year()}-${moment(this.state.date).add(99, 'years').year()}`));

        return (
            <div className='calendar'>
                <input
                    type='text'
                    placeholder='Select date'
                    value={this.state.selectedDate}
                    onChange={this.onChangeInput}
                    className='calendar-input'
                />
                <div className='calendar-header'>
                    <span type='button' className='calendar-prev-year-btn' onClick={() => prevYearHandler()} />
                    { isDateView && <span type='button' className='calendar-prev-month-btn' onClick={this.previousMonth} /> }
                    <div className='calendar-select'>
                        {   isDateView  &&
                            <span type='button' className='calendar-select-month-btn' onClick={() => this.selectView(this.CALENDAR_VIEWS.MONTH)}>
                                {moment(this.state.date).format('MMM')}
                            </span>
                        }
                        <span type='button' className='calendar-select-year-btn' onClick={() => selectYearHandler()}>
                            {selectYearValue}
                        </span>
                    </div>
                    { isDateView && <span type='button' className='calendar-next-month-btn' onClick={this.nextMonth} /> }
                    <span type='button' className='calendar-next-year-btn' onClick={() => nextYearHandler()} />
                </div>
                <div className='calendar-panel'>
                    { isDateView   && this.getDates()   }
                    { isMonthView  && this.getMonths()  }
                    { isYearView   && this.getYears()   }
                    { isDecadeView && this.getDecades() }
                </div>
                <div className='calendar-footer'>
                    { this.props.footer && <span className='calendar-footer-extra'>{this.props.footer}</span> }
                    {
                        this.props.showTodayBtn &&
                        <span className='calendar-footer-btn'>
                            <a role='button' onClick={this.setToday}>Today</a>
                        </span>
                    }
                </div>
            </div>
        );
    }
}

Calendar.defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    minDate   : moment().subtract(120, 'y').format('YYYY-MM-DD'), // by default, minDate is set to 120 years from today
    maxDate   : moment().add(120, 'y').format('YYYY-MM-DD'),      // by default, maxDate is set to 120 years from today
};

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.clearDateInput = this.clearDateInput.bind(this);
        this.getPickerValue = this.getPickerValue.bind(this);
        this.setPickerValue = this.setPickerValue.bind(this);

        this.state = {
            selectedDate: moment(this.props.minDate).format(this.props.dateFormat),
            showCalendar: false,
            showCloseBtn: false,
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
        if (!this.mainNode.contains(e.target) && this.state.showCalendar) {
            this.setState({ showCalendar: false });
        }
    }

    handleVisibility() {
        this.setState({
            showCalendar: !this.state.showCalendar,
        });
    }

    handleMouseEnter() {
        let value = moment(this.state.selectedDate).format(this.props.dateFormat);
        if (/Invalid Date/.test(value)) {
            value = '';
        }
        if (value) {
            this.setState({ showCloseBtn: true });
        }
    }

    handleMouseLeave() {
        this.setState({ showCloseBtn: false });
    }

    handleDateChange(selectedDate, showCalendar) {
        let value = selectedDate;
        if (value.length < 8) {
            value = '';
        }
        
        this.setState({
            selectedDate: value,
            showCalendar,
        });

        this.setPickerValue(value);
    }

    clearDateInput() {
        this.setState({ selectedDate: '' });
        this.setPickerValue('');
    }

    getPickerValue() {
        const getDayDifference = () => (moment(this.state.selectedDate).diff(moment(), 'days')) + 1;
        const val = this.props.displayFormat === 'd' ? getDayDifference() : moment(this.state.selectedDate).format(this.props.dateFormat);
        return val;
    }

    setPickerValue(value) {
        const getDayDifference = () => (moment(value).diff(moment(), 'days')) + 1;
        const val = this.props.displayFormat === 'd' ? getDayDifference() : moment(value).format(this.props.dateFormat);
        this.props.onChange({ target: { name: this.props.name, value: val } });
    }

    render() {
        let value =  this.getPickerValue();
        if (/Invalid Date/.test(value)) {
            value = '';
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
                        placeholder='Select date'
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={`picker-calendar-icon ${this.state.showCloseBtn ? '': 'show'}`}
                        onClick={this.handleVisibility}
                    />
                    <span
                        className={`close-circle-icon ${this.state.showCloseBtn ? 'show': ''}`}
                        onClick={this.clearDateInput}
                    />
                </div>
                <div className={`datepicker-calendar ${this.state.showCalendar ? 'show' : ''}`}>
                    <Calendar
                        handleDateChange={this.handleDateChange}
                        footer={this.props.footer}
                        showTodayBtn={this.props.showTodayBtn}
                        minDate={moment(this.props.minDate).format('YYYY-MM-DD')}
                        maxDate={moment(this.props.maxDate).format('YYYY-MM-DD')}
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