import React,
    { PureComponent } from 'react';
import IScroll        from 'iscroll';
import PropTypes      from 'prop-types';
import { localize }   from '../../../_common/localize';

/* TODO:
      1. to change to 24 hours format
      2. to handle disabled time period
      3. to handle null as initial value
      4. update the state only when dropdown closed
*/

class TimePickerDropdown extends PureComponent {
    constructor(props) {
        super(props);
        this.hours    = ['12', ...[...Array(11).keys()].map((a)=>`0${a+1}`.slice(-2))];
        this.minutes  = [...Array(60).keys()].map((a)=>`0${a}`.slice(-2));
        this.meridiem = ['am', 'pm'];
        this.state = {
            hour                : props.value.split(':')[0],
            minute              : (props.value.split(':')[1] || '').split(' ')[0],
            meridiem            : (props.value.split(':')[1] || '').split(' ')[1] || '',
            is_hour_selected    : false,
            is_minute_selected  : false,
            is_meridiem_selected: false,
            last_updated_type   : null,
        };
        this.selectHour      = this.selectOption.bind(this, 'hour');
        this.selectMinute    = this.selectOption.bind(this, 'minute');
        this.selectMeridiem  = this.selectOption.bind(this, 'meridiem');
        this.saveHourRef     = this.saveRef.bind(this, 'hour');
        this.saveMinuteRef   = this.saveRef.bind(this, 'minute');
        this.saveMeridiemRef = this.saveRef.bind(this, 'meridiem');
    }

    componentDidMount() {
        this.initIScroll();
    }

    componentWillUnmount() {
        this.hourScroll.destroy();
        this.minuteScroll.destroy();
        this.meridiemScroll.destroy();
    }

    componentDidUpdate(prevProps, prevState) {
        const { is_hour_selected, is_minute_selected, is_meridiem_selected } = this.state;
        if (is_hour_selected && is_minute_selected && is_meridiem_selected) {
            this.resetValues();
            this.props.toggle();
        }

        const { hour, minute, meridiem } = this.state;
        if (hour && minute && meridiem && (
            hour !== prevState.hour || minute !== prevState.minute || meridiem !== prevState.meridiem
        )) {
            // Call on change only once when all of the values are selected and one of the value is changed
            this.props.onChange(`${hour}:${minute} ${meridiem}`);
        }

        if (!prevProps.className && this.props.className === 'active') {
            this.resetValues();
        }
        if (prevState.last_updated_type !== this.state.last_updated_type && this.state.last_updated_type) {
            this.scrollToSelected(this.state.last_updated_type, 200);
            this.setState({ last_updated_type: null });
        }
    }

    initIScroll() {
        const iScrollOptions = {
            mouseWheel   : true,
            useTransition: true,
        };
        this.hourScroll     = new IScroll('.time-picker-hours', iScrollOptions);
        this.minuteScroll   = new IScroll('.time-picker-minutes', iScrollOptions);
        this.meridiemScroll = new IScroll('.time-picker-meridiem', iScrollOptions);
    }

    scrollToSelected(type, duration, offset = -30) {
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

    resetValues() {
        this.setState({
            is_hour_selected    : false,
            is_minute_selected  : false,
            is_meridiem_selected: false,
        });
        this.hourScroll.refresh();
        this.minuteScroll.refresh();
        this.meridiemScroll.refresh();
        this.scrollToSelected('hour', 0, 0);
        this.scrollToSelected('minute', 0, 0);
        this.scrollToSelected('meridiem', 0, 0);
    }

    selectOption(type, value) {
        this.setState({
            last_updated_type: type,
        });
        if (type === 'hour') {
            this.setState({
                hour            : value,
                is_hour_selected: true,
            });
        } else if (type === 'minute') {
            this.setState({
                minute            : value,
                is_minute_selected: true,
            });
        } else {
            this.setState({
                meridiem            : value,
                is_meridiem_selected: true,
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
    };

    saveRef(type, node) {
        if (!node) return;
        const save = {
            hour    : (n) => this.hourSelect = n,
            minute  : (n) => this.minuteSelect = n,
            meridiem: (n) => this.meridiemSelect = n,
        };

        save[type](node);
    }

    render() {
        const { preClass, value, toggle } = this.props;
        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div
                    className={`${preClass}-panel`}
                    onClick={toggle}
                >
                    <span className={value ? '' : 'placeholder'}>{value || localize('Select time')}</span>
                    <span
                        className={`${preClass}-clear`}
                        onClick={this.clear}
                    />
                </div>
                <div className={`${preClass}-selector`}>
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
                                >
                                    {h}
                                </div>
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
                                >{mm}
                                </div>
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
                                >{a}
                                </div>
                            ))}
                        </div>
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
            is_open: false,
            value  : '',
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleDropDown = () => {
        this.setState({ is_open: !this.state.is_open });
    };

    handleChange = (arg) => {

        // To handle nativepicker;
        const value = typeof arg === 'object' ? this.convertTo12h(arg.target.value) : arg;

        if (value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value } });
        }
    };

    saveRef = (node) => {
        if (!node) return;
        if (node.nodeName === 'INPUT') {
            this.target_element = node;
            return;
        }
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            if (this.state.is_open) {
                this.setState({ is_open: false });
            }
        }
    };

    convertTo24h = (value) => {
        if (!value) return '';
        const [hour, other] = value.split(':');
        const [minute, meridiem] = other.split(' ');
        if (meridiem.toLowerCase() === 'pm') {
            return `${hour%12 ? +hour+12 : '12'}:${minute}`;
        }
        return `${hour%12 ? hour : '00'}:${minute}`;
    };

    convertTo12h = (value) => {
        if (!value) return '';
        const [hour, minute] = value.split(':');
        const meridiem = +hour >= 12 ? 'pm' : 'am';
        if (meridiem === 'pm' && hour > 12) {
            return `${(`0${+hour-12}`).slice(-2)}:${minute} ${meridiem}`;
        }

        return `${+hour === 0 ? 12 : hour}:${minute} ${meridiem}`;
    };

    render() {
        const prefix_class='time-picker';
        const {
            is_nativepicker,
            value,
            name,
            is_align_right,
            placeholder,
        } = this.props;
        const formatted_value = this.convertTo24h(value);
        return (
            <div
                ref={this.saveRef}
                className={`${prefix_class}${this.props.padding ? ' padding' : ''}${this.state.is_open ? ' active' : ''}`}
            >
                {
                    is_nativepicker
                    ? <input
                        type='time'
                        id={`${prefix_class}-input`}
                        value={formatted_value}
                        onChange={this.handleChange}
                        name={name}
                    />
                    : (
                        <React.Fragment>
                            <input
                                ref={this.saveRef}
                                type='text'
                                readOnly
                                id={`${prefix_class}-input`}
                                className={`${prefix_class}-input ${this.state.is_open ? 'active' : ''}`}
                                value={value}
                                onClick={this.toggleDropDown}
                                name={name}
                                placeholder={placeholder}
                            />
                            <TimePickerDropdown
                                className={`${this.state.is_open ? 'active' : ''}${is_align_right ? ' from-right' : '' }`}
                                toggle={this.toggleDropDown}
                                onChange={this.handleChange}
                                preClass={prefix_class}
                                value={value}
                            />
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}

TimePicker.propTypes = {
    is_nativepicker: PropTypes.bool,
    is_align_right : PropTypes.bool,
    name           : PropTypes.string,
    onChange       : PropTypes.func,
    padding        : PropTypes.string,
    placeholder    : PropTypes.string,
    value          : PropTypes.string,
};

TimePickerDropdown.propTypes = {
    className  : PropTypes.string,
    onChange   : PropTypes.func,
    preClass   : PropTypes.string,
    toggle     : PropTypes.func,
    value      : PropTypes.string,
    value_split: PropTypes.bool,
};

export default TimePicker;
