import React from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import addYears from 'date-fns/add_years';
import subYears from 'date-fns/sub_years';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
import isEqual from 'date-fns/is_equal';
import isToday from 'date-fns/is_today';
import getDay from 'date-fns/get_day';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import getYear from 'date-fns/get_year';
import getDaysInMonth from 'date-fns/get_days_in_month';
import lastDayOfMonth from 'date-fns/last_day_of_month';

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.getDays = this.getDays.bind(this);
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

        this.selectMonth = this.selectMonth.bind(this);
        this.selectYear = this.selectYear.bind(this);
        this.selectDecade = this.selectDecade.bind(this);

        this.handleDateSelected = this.handleDateSelected.bind(this);
        this.handleMonthSelected = this.handleMonthSelected.bind(this);
        this.handleYearSelected = this.handleYearSelected.bind(this);
        this.handleDecadeSelected = this.handleDecadeSelected.bind(this);

        this.onChangeInput = this.onChangeInput.bind(this);

        this.state = {
            date        : this.props.startDate,
            selectedDate: this.props.startDate,
            isDaysView  : true,
            isMonthView : false,
            isYearView  : false,
            isDecadeView: false,
        };
    }

    setToday() {
        this.setState({
            selectedDate: format(new Date(), this.props.dateFormat),
            isDaysView  : true,
            isMonthView : false,
            isYearView  : false,
            isDecadeView: false,
            date        : format(new Date(), this.props.dateFormat),
        });
        this.props.handleDateChange(format(new Date(), this.props.dateFormat), true);
    }

    nextMonth() {
        this.setState({ date: format(addMonths(this.state.date, 1), this.props.dateFormat) });
    }

    previousMonth() {
        this.setState({ date: format(subMonths(this.state.date, 1), this.props.dateFormat) });
    }

    nextYear() {
        this.setState({ date: format(addYears(this.state.date, 1), this.props.dateFormat) });
    }

    previousYear() {
        this.setState({ date: format(subYears(this.state.date, 1), this.props.dateFormat) });
    }

    nextDecade() {
        this.setState({ date: format(addYears(this.state.date, 10), this.props.dateFormat) });
    }

    previousDecade() {
        this.setState({ date: format(subYears(this.state.date, 10), this.props.dateFormat) });
    }

    nextCentury() {
        this.setState({ date: format(addYears(this.state.date, 100), this.props.dateFormat) });
    }

    previousCentury() {
        this.setState({ date: format(subYears(this.state.date, 100), this.props.dateFormat) });
    }

    selectMonth() {
        this.setState({
            isDaysView  : false,
            isMonthView : true,
            isYearView  : false,
            isDecadeView: false,
        });
    }

    selectYear() {
        this.setState({
            isDaysView  : false,
            isMonthView : false,
            isYearView  : true,
            isDecadeView: false,
        });
    }

    selectDecade() {
        this.setState({
            isDaysView  : false,
            isMonthView : false,
            isYearView  : false,
            isDecadeView: true,
        });
    }

    handleDateSelected(e) {
        const date = e.target.dataset.date;
        const dateBefore = !isBefore(date, new Date(format(this.props.minDate, this.props.dateFormat)));
        const isPreviousMonth = getMonth(date) < getMonth(this.state.date);
        const isNextMonth = getMonth(date) > getMonth(this.state.date);

        if (dateBefore || isToday(date)) {
            this.setState({
                selectedDate: format(new Date(date), this.props.dateFormat),
            });
            this.props.handleDateChange(format(new Date(date), this.props.dateFormat));
        }

        if (isPreviousMonth && dateBefore) {
            this.previousMonth();
        }
        if (isNextMonth) {
            this.nextMonth();
        }
    }

    handleMonthSelected(e) {
        const date  = new Date(getYear(this.state.date), e.target.dataset.month, getDate(this.state.date));
        this.setState({
            date       : format(new Date(date), this.props.dateFormat),
            isDaysView : true,
            isMonthView: false,
        });
        this.props.handleDateChange(format(new Date(date), this.props.dateFormat), true);
    }

    handleYearSelected(e) {
        const date = new Date(e.target.dataset.year, getMonth(this.state.date), getDate(this.state.date));
        this.setState({
            date       : format(new Date(date), this.props.dateFormat),
            isMonthView: true,
            isYearView : false,
        });
        this.props.handleDateChange(format(new Date(), this.props.dateFormat), true);
    }

    handleDecadeSelected(e) {
        const year = e.target.dataset.decade.split('-')[0];
        const date = new Date(year, getMonth(this.state.date), getDate(this.state.date));
        this.setState({
            date        : format(new Date(date), this.props.dateFormat),
            isYearView  : true,
            isDecadeView: false,

        });
        this.props.handleDateChange(format(new Date(date), this.props.dateFormat), true);
    }

    onChangeInput(e) {
        const value = e.target.value;
        this.setState({
            selectedDate: value, // update datepicker input
        });

        this.props.handleDateChange(value, true);

        if (value.length < 10) return;

        this.setState({
            date: format(value, this.props.dateFormat),
        });
    }

    getDays() {
        const dates = [];
        const days = [];
        const numOfDays = getDaysInMonth(this.state.date) + 1;
        const lastDay = lastDayOfMonth(this.state.date);
        const firstDay = new Date(getYear(this.state.date), getMonth(this.state.date), 1);

        const pad = (value, length) => {
            let val = value;
            if (value.toString().length < length) {
                val = `0${value}`;
            }
            return val;
        };

        const getDatesBefore = (date) => {
            const prevDates = [];
            const dateIndex = getDay(new Date(format(date, this.props.dateFormat)));

            for (let i = dateIndex; i > 0; i--) {
                const prevDate = format(subDays(new Date(date), i), this.props.dateFormat);
                dates.push(prevDate);
            }
            return prevDates;
        };

        const getDatesAfter = (date) => {
            const futureDates = [];
            const dateIndex = getDay(new Date(format(date, this.props.dateFormat)));

            for (let i = 1; i <= 6 - dateIndex; i++) {
                const futureDate = format(addDays(new Date(date), i), this.props.dateFormat);
                dates.push(futureDate);
            }
            return futureDates;
        };

        for (let idx = 1; idx < numOfDays; idx += 1) {
            if (idx === 1) {
                const date = format(this.state.date, this.props.dateFormat.replace('DD', pad(idx, 2)));
                const prevDates = getDatesBefore(date);
                prevDates.forEach((d) => {
                    dates.push(d);
                });
            }

            dates.push(format(this.state.date, this.props.dateFormat.replace('DD', pad(idx, 2))));

            if (idx === numOfDays-1) {
                const date = format(this.state.date, this.props.dateFormat.replace('DD', pad(idx, 2)));
                const futureDates = getDatesAfter(date);
                futureDates.forEach((d) => {
                    dates.push(d);
                });
            }
        }

        dates.forEach((date) => {
            const isDisabled = isBefore(new Date(date), firstDay) ||
                isAfter(new Date(date), addDays(lastDay, 1)) ||
                isBefore(new Date(date), new Date(subDays(this.props.minDate, 1)));
            const isActive = isEqual(new Date(date), new Date(this.state.selectedDate));
            const today = isToday(new Date(date));

            days.push(
                <span
                    key={date}
                    className={`calendar-date${isActive ? ' calendar-date-active' : ''}${today ? ' calendar-date-today': ''}${isDisabled ? ' calendar-date-disabled' : ''}`}
                    onClick={this.handleDateSelected}
                    data-date={date}
                >
                    {getDate(new Date(date))}
                </span>
            );
        });

        return days;
    }

    getMonths() {
        const monthHeaders = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
            <div className='calendar-month-panel'>
                {monthHeaders.map((item, idx) => (
                    <span
                        key={idx}
                        className='calendar-month'
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
        const currentYear = getYear(this.state.date);
        const years = [];
        for (let year = currentYear - 1; year < currentYear + 11; year++) {
            years.push(year);
        }
        return (
            <div className='calendar-year-panel'>
                {years.map((year, idx) => (
                    <span
                        key={idx}
                        className={`calendar-year${idx === 0 || idx === 11 ? ' calendar-year-disabled' : ''}`}
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
        const decades = [];
        const currentYear = getYear(this.state.date);
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
                        className={`calendar-decade${idx === 0 || idx === 11 ? ' calendar-decade-disabled' : ''}`}
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
        const Days = () => {
            const days = this.getDays().map(day => day);
            const weekHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

            return (
                <div className='calendar-date-panel'>
                    {weekHeaders.map((item, idx) => (
                        <span
                            key={idx}
                            className='calendar-date-header'
                        >
                        {item}
                        </span>
                    ))}
                    {days}
                </div>
            );
        };
        const Months = () => this.getMonths();
        const Years = () => this.getYears();
        const Decades = () => this.getDecades();

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
                    {
                        this.state.isDecadeView &&
                        <span type='button' className='calendar-prev-year-btn' onClick={this.previousCentury}></span>
                    }
                    {
                        this.state.isYearView &&
                        <span type='button' className='calendar-prev-year-btn' onClick={this.previousDecade}></span>
                    }
                    {
                        (this.state.isDaysView  || this.state.isMonthView) &&
                        <span type='button' className='calendar-prev-year-btn' onClick={this.previousYear}></span>
                    }
                    {
                        this.state.isDaysView &&
                        <span type='button' className='calendar-prev-month-btn' onClick={this.previousMonth}></span>
                    }
                    <div className='calendar-select'>
                        {
                            this.state.isDaysView  &&
                            <span type='button' className='calendar-select-month-btn' onClick={this.selectMonth}>
                                {format(this.state.date, 'MMM')}
                            </span>
                        }
                        {
                            (this.state.isDaysView  || this.state.isMonthView) &&
                            <span type='button' className='calendar-select-year-btn'  onClick={this.selectYear}>
                                {format(this.state.date, 'YYYY')}
                            </span>
                        }
                        {
                            this.state.isYearView &&
                            <span type='button' className='calendar-select-decade-btn'  onClick={this.selectDecade}>
                                {format(this.state.date, 'YYYY')}-{format(addYears(this.state.date, 9), 'YYYY')}
                            </span>
                        }
                        {
                            this.state.isDecadeView &&
                            <span className='calendar-select-century-btn'>
                                {format(this.state.date, 'YYYY')}-{format(addYears(this.state.date, 99), 'YYYY')}
                            </span>
                        }
                    </div>
                    {
                        this.state.isDaysView &&
                        <span type='button' className='calendar-next-month-btn' onClick={this.nextMonth}></span>
                    }
                    {
                        (this.state.isDaysView  || this.state.isMonthView) &&
                        <span type='button' className='calendar-next-year-btn' onClick={this.nextYear}></span>
                    }
                    {
                        this.state.isYearView &&
                        <span type='button' className='calendar-next-year-btn' onClick={this.nextDecade}></span>
                    }
                    {
                        this.state.isDecadeView &&
                        <span type='button' className='calendar-next-year-btn' onClick={this.nextCentury}></span>
                    }
                </div>

                <div className='calendar-panel'>
                    { this.state.isDaysView   && <Days /> }
                    { this.state.isMonthView  && <Months /> }
                    { this.state.isYearView   && <Years /> }
                    { this.state.isDecadeView && <Decades /> }
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
    startDate : new Date(),
    minDate   : subYears(new Date(), 120), // by default, minDate is set to 120 years from today
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
        this.state = {
            showCalendar: false,
            selectedDate: format(new Date(), this.props.dateFormat),
            showCloseBtn: false,
        };
    }

    componentDidMount() {
        this.props.onChange({ target: { name: this.props.name, value: this.state.selectedDate } });
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
        let value = format(this.state.selectedDate, this.props.dateFormat);
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
        this.props.onChange({ target: { name: this.props.name, value } });
    }

    clearDateInput() {
        this.setState({ selectedDate: '' });
        this.props.onChange({ target: { name: this.props.name, value: '' } });
    }

    render() {
        let value = this.state.selectedDate;
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
                        startDate={this.state.selectedDate}
                        handleDateChange={this.handleDateChange}
                        footer={this.props.footer}
                        showTodayBtn={this.props.showTodayBtn}
                        minDate={this.props.minDate}
                    />
                </div>
            </div>
        );
    }
}

DatePicker.defaultProps = {
    dateFormat: 'YYYY-MM-DD',
};

export default DatePicker;