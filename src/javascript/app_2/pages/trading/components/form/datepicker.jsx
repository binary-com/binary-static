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

        const currentDate = startDate ? moment(startDate).format(this.props.dateFormat) :
                moment(minDate).format(this.props.dateFormat);

        this.state = {
            date        : currentDate, // calendar dates reference
            selectedDate: currentDate, // selected date
        };
    }

    componentWillMount() {
        this.setState({ activeView: 'date' });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const shouldUpdate = (this.state.activeView !== nextState.activeView) 
            || (this.state.date !== nextState.date) || (this.state.selectedDate !== nextState.selectedDate);
        return shouldUpdate || false;
    }

    setToday() {
        const now = moment().format(this.props.dateFormat);
        this.setState({
            date        : now,
            selectedDate: now,
            activeView  : 'date',
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

    setActiveView(activeView) {
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

        if (prevMonth && !dateBefore) {
            this.previousMonth();
        }
        if (nextMonth) {
            this.nextMonth();
        }

        if ((!dateBefore && !dateAfter)|| dateToday) {
            this.setState({
                date        : date.format(this.props.dateFormat),
                selectedDate: date.format(this.props.dateFormat),
            });
            this.props.handleDateChange(date.format(this.props.dateFormat));
        }
    }

    handleMonthSelected(e) {
        const date = moment(this.state.date).month(e.target.dataset.month).format(this.props.dateFormat);
        this.setState({
            date,
            selectedDate: date,
            activeView  : 'date',
        });
        this.props.handleDateChange(date, true);
    }

    handleYearSelected(e) {
        const date = moment(this.state.date).year(e.target.dataset.year).format(this.props.dateFormat);
        this.setState({
            date,
            selectedDate: date,
            activeView  : 'month',
        });
        this.props.handleDateChange(date, true);
    }

    handleDecadeSelected(e) {
        const year = e.target.dataset.decade.split('-')[0];
        const date = moment(this.state.date).year(year).format(this.props.dateFormat);
        this.setState({
            date,
            selectedDate: date,
            activeView  : 'year',

        });
        this.props.handleDateChange(date, true);
    }

    onChangeInput(e) {
        const value = e.target.value;
        this.setState({ selectedDate: value }); // update calendar input

        if (moment(value, 'YYYY-MM-DD', true).isValid() || !value) {
            this.props.handleDateChange(value, true);

            if (!value) {
                const { startDate, minDate } = {...this.props};
                const currentDate = startDate ? moment(startDate).format(this.props.dateFormat) :
                moment(minDate).format(this.props.dateFormat);
                this.setState({ date: currentDate });
            } else {
                this.setState({ date: moment(value).format(this.props.dateFormat) }); // update calendar dates
            }
        }
    }

    resetCalendar() {
        this.setState({
            date        : moment(this.props.minDate).format(this.props.dateFormat),
            selectedDate: moment(this.props.minDate).format(this.props.dateFormat),
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

        const pad = (value) => (`0${value}`).substr(-2); // pad zero

        for (let i = firstDay; i > 0; i--) {
            dates.push(moment(startOfMonth).subtract(i, 'day').format(this.props.dateFormat));
        }
        for (let idx = 1; idx < numOfDays; idx += 1) {
            dates.push(moment(this.state.date).format(this.props.dateFormat.replace('DD', pad(idx))));
        }
        for (let i = 1; i <= 6 - lastDay; i++) {
            dates.push(moment(endOfMonth).add(i, 'day').format(this.props.dateFormat));
        }

        dates.forEach((date) => {
            const isDisabled = moment(date).isBefore(moment(startOfMonth))
                || moment(date).isAfter(moment(endOfMonth))
                || moment(date).isBefore(moment(this.props.minDate).subtract(1, 'day'))
                || moment(date).isAfter(moment(this.props.maxDate));
            const isActive = moment(date).isSame(moment(this.state.date));
            const isToday  = moment(date).isSame(moment().utc(), 'day');

            days.push(
                <span
                    key={date}
                    className={`calendar-date${isActive ? ' active' : ''}${isToday ? ' today' : ''}${isDisabled ? ' disabled' : ''}`}
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
                {weekHeaders.map((item, idx) => (<span key={idx} className='calendar-date-header'>{localize(item)}</span>))}
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
                        className={`calendar-month${idx === isActive ? ' active' : ''}`}
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
                        className={`calendar-year${(idx === 0 || idx === 11 ) ? ' disabled' : ''}${year === isActive ? ' active' : ''}`}
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
                        className={`calendar-decade${(idx === 0 || idx === 11) ? ' disabled' : ''}${range.split('-')[0] === isActive ? 'active' : ''}`}
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
        const view = this.state.activeView;

        const dateView   = (view === 'date');
        const yearView   = (view === 'year');
        const monthView  = (view === 'month');
        const decadeView = (view === 'decade');

        const prevMonthBtn = (dateView && <span type='button' className='calendar-next-month-btn' onClick={this.nextMonth} />);
        const nextMonthBtn = (dateView && <span type='button' className='calendar-prev-month-btn' onClick={this.previousMonth} />);

        const prevYearBtn = (
            <span type='button' className='calendar-prev-year-btn'
                  onClick={() => (((dateView || monthView) && this.previousYear()) 
                    || (yearView && this.previousDecade()) || (decadeView && this.previousCentury()) )} />
        );

        const nextYearBtn = (
            <span type='button' className='calendar-next-year-btn'
                  onClick={() => (((dateView || monthView) && this.nextYear()) 
                    || (yearView && this.nextDecade()) || (decadeView && this.nextCentury()) )} />
        );

        const monthSelect = (dateView &&
            <span type='button' className='calendar-select-month-btn' onClick={() => this.setActiveView('month')}>
                { moment(this.state.date).format('MMM') }
            </span>
        );

        const yearSelect = (
            <span type='button' className='calendar-select-year-btn'
                  onClick={() => ((dateView || monthView) ? this.setActiveView('year') : this.setActiveView('decade'))}>
                { moment(this.state.date).year() }
                { yearView   && `-${moment(this.state.date).add(9, 'years').year()}`  }
                { decadeView && `-${moment(this.state.date).add(99, 'years').year()}` }
            </span>
        );

        const calendarPanel = ((dateView && this.getDates()) || (monthView && this.getMonths()) 
            || (yearView && this.getYears()) || (decadeView && this.getDecades())
        );

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
                    { prevYearBtn }
                    { prevMonthBtn }
                    <div className='calendar-select'>
                        { monthSelect }
                        { yearSelect }
                    </div>
                    { nextMonthBtn }
                    { nextYearBtn }
                </div>
                <div className='calendar-panel'>
                    { calendarPanel }
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
    minDate   : moment().utc().subtract(120, 'y').format('YYYY-MM-DD'), // by default, minDate is set to 120 years before today
    maxDate   : moment().utc().add(120, 'y').format('YYYY-MM-DD'),      // by default, maxDate is set to 120 years after today
};


const getDayDifference = (date) => {
    const diff = moment(date).diff(moment().utc(), 'days');
    if (!date || (diff < 0)) {
        return 1;
    }
    return diff + 1;
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
        if (this.getPickerValue()) {
            this.setState({ showCloseBtn: true });
        }
    }

    handleMouseLeave() {
        this.setState({ showCloseBtn: false });
    }

    handleDateChange(selectedDate, showCalendar) {
        let value = selectedDate;
        if (!moment(value).isValid) {
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
        this.setPickerValue();
        this.calendar.resetCalendar();
    }

    getPickerValue() {
        return this.props.displayFormat === 'd' ? getDayDifference(this.state.selectedDate) : this.state.selectedDate;
    }

    setPickerValue(value) {
        const val = this.props.displayFormat === 'd' ? getDayDifference(value) : value;
        this.props.onChange({ target: { name: this.props.name, value: val } });
    }

    render() {
        const value =  this.getPickerValue();
        return (
            <div ref={node => { this.mainNode = node; }} className='datepicker-container'>
                <div className='datepicker-display-wrapper'
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
                    <Calendar ref={node => { this.calendar = node; }}
                        {...this.props}
                        handleDateChange={this.handleDateChange}
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