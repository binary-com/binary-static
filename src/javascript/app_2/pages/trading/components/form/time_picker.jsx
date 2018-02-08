import React, {PureComponent} from 'react';

class TimePickerDropdown extends PureComponent {

    constructor (props) {
        super(props);
        this.hours    = ['12', ...[...Array(11).keys()].map((a)=>`0${a+1}`.slice(-2))];
        this.minutes  = [...Array(60).keys()].map((a)=>`0${a}`.slice(-2));
        this.meridiem = ['am', 'pm'];
        this.state = {
            hour: props.value.split(':')[0],
            minute: (props.value.split(':')[1] || '').split(' ')[0],
            meridiem: (props.value.split(':')[1] || '').split(' ')[1] || '',
            isHourSelected: false,
            isMinuteSelected: false,
            isMeridiemSelected: false,
        };
        this.selectHour     = this.selectOption.bind(this, 'hour');
        this.selectMinute   = this.selectOption.bind(this, 'minute');
        this.selectMeridiem = this.selectOption.bind(this, 'meridiem');
    }

    componentDidUpdate(prevProps) {
        const {isHourSelected, isMinuteSelected, isMeridiemSelected} = this.state;
        if(isHourSelected && isMinuteSelected && isMeridiemSelected) {
            this.setState({
                isHourSelected: false,
                isMinuteSelected: false,
                isMeridiemSelected: false,
            });
            this.props.toggle();
        }

        const {hour, minute, meridiem} = this.state;
        if(hour && minute && meridiem) {
            this.props.onChange(`${hour}:${minute} ${meridiem}`);
        }
    }

    selectOption (type, value) {
        if(type === 'hour') {
            this.setState({
                hour: value,
                isHourSelected: true,
            });
        } else if (type === 'minute') {
            this.setState({
                minute: value,
                isMinuteSelected: true,
            });
        } else {
            this.setState({
                meridiem: value,
                isMeridiemSelected: true,
            });
        }
    }

    render () {
        const {preClass} = this.props;
        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div className={`${preClass}-hours`}>
                    <ul>
                        {this.hours.map((h, key) => (
                            <li
                                className={this.state.hour === h ? 'selected' : ''}
                                key={key}
                                onClick={this.selectHour.bind(null, h)}
                            >{h}</li>
                        ))}
                    </ul>
                </div>
                <div className={`${preClass}-minutes`}>
                    <ul>
                        {this.minutes.map((mm, key) => (
                            <li
                                className={this.state.minute === mm ? 'selected' : ''}
                                key={key}
                                onClick={this.selectMinute.bind(null, mm)}
                            >{mm}</li>
                        ))}
                    </ul>
                </div>
                <div className={`${preClass}-meridiem`}>
                    <ul>
                        {this.meridiem.map((a, key) => (
                            <li
                                className={this.state.meridiem === a ? 'selected' : ''}
                                key={key}
                                onClick={this.selectMeridiem.bind(null, a)}
                            >{a}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

class TimePicker extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            open: false,
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
        this.setState({value: value});
    }

    saveRef = (node) => {
        if(node.nodeName === 'INPUT') {
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
        const prefixClass='time-picker'
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
        )
    }
}

export default TimePicker;
