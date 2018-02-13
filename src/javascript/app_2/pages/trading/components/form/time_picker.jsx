import React, {PureComponent} from 'react';
import IScroll from 'iscroll';

class TimePickerDropdown extends PureComponent {

    constructor (props) {
        super(props);
        this.hours    = ['12', ...[...Array(11).keys()].map((a)=>`0${a+1}`.slice(-2))];
        this.minutes  = [...Array(60).keys()].map((a)=>`0${a}`.slice(-2));
        this.meridiem = ['am', 'pm'];
        this.state = {
            hour              : props.value.split(':')[0],
            minute            : (props.value.split(':')[1] || '').split(' ')[0],
            meridiem          : (props.value.split(':')[1] || '').split(' ')[1] || '',
            isHourSelected    : false,
            isMinuteSelected  : false,
            isMeridiemSelected: false,
            lastUpdatedType   : null,
        };
        this.selectHour      = this.selectOption.bind(this, 'hour');
        this.selectMinute    = this.selectOption.bind(this, 'minute');
        this.selectMeridiem  = this.selectOption.bind(this, 'meridiem');
        this.saveHourRef     = this.saveRef.bind(this, 'hour');
        this.saveMinuteRef   = this.saveRef.bind(this, 'minute');
        this.saveMeridiemRef = this.saveRef.bind(this, 'meridiem');
    }

    componentDidMount () {
        this.initIScroll();
    }

    componentWillUnmount () {
        this.hourScroll.destroy();
        this.minuteScroll.destroy();
        this.meridiemScroll.destroy();
    }

    componentDidUpdate(prevProps, prevState) {
        const {isHourSelected, isMinuteSelected, isMeridiemSelected} = this.state;
        if (isHourSelected && isMinuteSelected && isMeridiemSelected) {
            this.resetValues();
            this.props.toggle();
        }

        const {hour, minute, meridiem} = this.state;
        if (hour && minute && meridiem && (
            hour !== prevState.hour || minute !== prevState.minute || meridiem !== prevState.meridiem
        )) {
            // Call on change only once when all of the values are selected and one of the value is changed
            this.props.onChange(`${hour}:${minute} ${meridiem}`);
        }

        if (!prevProps.className && this.props.className === 'active') {
            this.resetValues();
        }
        if (prevState.lastUpdatedType !== this.state.lastUpdatedType && this.state.lastUpdatedType) {
            this.scrollToSelected(this.state.lastUpdatedType, 200);
            this.setState({
                lastUpdatedType: null,
            });
        }
    }

    initIScroll() {
        const iScrollOptions = {
    		mouseWheel   : true,
            useTransition: true,
        };
        if (!this.iScrollinitialized) {
            this.hourScroll = new IScroll('.time-picker-hours', iScrollOptions);
            this.minuteScroll = new IScroll('.time-picker-minutes', iScrollOptions);
            this.meridiemScroll = new IScroll('.time-picker-meridiem', iScrollOptions);
            this.iScrollinitialized = true;
            window.hourScroll = this.hourScroll;
            window.minuteScroll = this.minuteScroll;
        }
    }

    scrollToSelected (type, duration, offset = -30) {
        // move to selected item
        const wrapper = {
            hour    : this.hourScroll,
            minute  : this.minuteScroll,
            meridiem: this.meridiemScroll,
        };
        if (wrapper[type].scroller.querySelector('.selected')) {
            wrapper[type].scrollToElement('.selected', duration, null, offset, IScroll.utils.ease.elastic);
        } else {
            wrapper[type].scrollToElement('.list-item', duration, null, null);
        }
    }

    resetValues () {
        this.setState({
            isHourSelected    : false,
            isMinuteSelected  : false,
            isMeridiemSelected: false,
        });
        this.hourScroll.refresh();
        this.minuteScroll.refresh();
        this.meridiemScroll.refresh();
        this.scrollToSelected('hour', 0, 0);
        this.scrollToSelected('minute', 0, 0);
        this.scrollToSelected('meridiem', 0, 0);
    }

    selectOption (type, value) {
        this.setState({
            lastUpdatedType: type,
        });
        if (type === 'hour') {
            this.setState({
                hour          : value,
                isHourSelected: true,
            });
        } else if (type === 'minute') {
            this.setState({
                minute          : value,
                isMinuteSelected: true,
            });
        } else {
            this.setState({
                meridiem          : value,
                isMeridiemSelected: true,
            });
        }
    }

    clear = (event) => {
        event.stopPropagation();
        this.resetValues();
        this.setState({
            hour    : undefined,
            minute  : undefined,
            meridiem: undefined,
        });
        this.props.onChange('');
    }

    saveRef (type, node) {
        if (!node) return;
        const save = {
            hour    : (n) => this.hourSelect = n,
            minute  : (n) => this.minuteSelect = n,
            meridiem: (n) => this.meridiemSelect = n,
        };

        save[type](node);
    }

    render () {
        const {preClass, value, toggle} = this.props;
        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div
                    className={`${preClass}-panel`}
                    onClick={toggle}
                >
                    <span className={value ? '' : 'placeholder'}>{value || 'Select time'}</span>
                    <span
                        className={`${preClass}-clear`}
                        onClick={this.clear}
                    ></span>
                </div>
                <div
                    ref={this.saveHourRef}
                    className={`${preClass}-hours`}
                >
                    <div className='list-container'>
                        {this.hours.map((h, key) => (
                            <div
                                className={`list-item${this.state.hour === h ? ' selected' : ''}`}
                                key={key}
                                onClick={this.selectHour.bind(null, h)}
                            >{h}</div>
                        ))}
                    </div>
                </div>
                <div
                    ref={this.saveMinuteRef}
                    className={`${preClass}-minutes`}
                >
                    <div className='list-container'>
                        {this.minutes.map((mm, key) => (
                            <div
                                className={`list-item${this.state.minute === mm ? ' selected' : ''}`}
                                key={key}
                                onClick={this.selectMinute.bind(null, mm)}
                            >{mm}</div>
                        ))}
                    </div>
                </div>
                <div
                    ref={this.saveMeridiemRef}
                    className={`${preClass}-meridiem`}
                >
                    <div className='list-container'>
                        {this.meridiem.map((a, key) => (
                            <div
                                className={`list-item${this.state.meridiem === a ? ' selected' : ''}`}
                                key={key}
                                onClick={this.selectMeridiem.bind(null, a)}
                            >{a}</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

class TimePicker extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            open : false,
            value: '',
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(props) {
        props.onChange({target: this.targetElement});
    }

    toggleDropDown = () => {
        this.setState({open: !this.state.open});
    }

    handleChange = (value) => {
        this.setState({value});
    }

    saveRef = (node) => {
        if (!node) return;
        if (node.nodeName === 'INPUT') {
            this.targetElement = node;
            return;
        }
        this.wrapperRef = node;
    }

    handleClickOutside = () => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (this.state.open) {
                this.setState({ open: false });
            }
        }
    }

    render () {
        const prefixClass='time-picker';
        return (
            <div
                ref={this.saveRef}
                className={`${prefixClass}${this.props.padding ? ' padding' : ''}${this.state.open ? ' active' : ''}`}
            >
                <input
                    ref={this.saveRef}
                    type='text'
                    readOnly
                    id={`${prefixClass}-input`}
                    className={`${prefixClass}-input ${this.state.open ? 'active' : ''}`}
                    value={this.state.value}
                    onClick={this.toggleDropDown}
                    {...this.props}
                />
                <TimePickerDropdown
                    className={this.state.open ? 'active' : ''}
                    toggle={this.toggleDropDown}
                    onChange={this.handleChange}
                    preClass={prefixClass}
                    value={this.state.value}
                />
            </div>
        );
    }
}

export default TimePicker;
