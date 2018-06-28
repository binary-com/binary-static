import moment                 from 'moment';
import React,
    { PureComponent }         from 'react';
import PropTypes              from 'prop-types';
import { isSessionAvailable } from '../../pages/trading/actions/helpers/start_date';
import { localize }           from '../../../_common/localize';

/* TODO:
      1. to update state accordingly during native to desktop switches
      2. to update state when value is not available after switching start date
      3. to handle null as initial value
      4. update the state only when dropdown closed
*/

class TimePickerDropdown extends PureComponent {
    constructor(props) {
        super(props);
        this.hours    = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
        this.minutes  = [...Array(12).keys()].map((a)=>`0${a*5}`.slice(-2));
        this.state    = {
            hour              : props.value.split(':')[0],
            minute            : props.value.split(':')[1] || 0,
            is_hour_selected  : false,
            is_minute_selected: false,
            last_updated_type : null,
        };
        this.selectHour    = this.selectOption.bind(this, 'hour');
        this.selectMinute  = this.selectOption.bind(this, 'minute');
        this.saveHourRef   = this.saveRef.bind(this, 'hour');
        this.saveMinuteRef = this.saveRef.bind(this, 'minute');
    }

    componentDidUpdate(prevProps, prevState) {
        const { is_hour_selected, is_minute_selected } = this.state;
        if (is_hour_selected && is_minute_selected) {
            this.resetValues();
            this.props.toggle();
        }

        const { hour, minute } = this.state;
        if (hour && minute && (hour !== prevState.hour || minute !== prevState.minute)) {
            // Call on change only once when all of the values are selected and one of the value is changed
            this.props.onChange(`${hour}:${minute}`);
        }

        if (!prevProps.className && this.props.className === 'active') {
            this.resetValues();
        }
        if (prevState.last_updated_type !== this.state.last_updated_type && this.state.last_updated_type) {
            this.setState({ last_updated_type: null });
        }
    }

    resetValues() {
        this.setState({
            is_hour_selected  : false,
            is_minute_selected: false,
        });
    }

    selectOption(type, value, is_enabled = true) {
        if (!is_enabled) {
            return;
        }
        this.setState({
            last_updated_type: type,
        });
        if (type === 'hour') {
            this.setState({
                hour            : value,
                is_hour_selected: true,
            });
            const { minute } = this.state;
            const { sessions, start_date } = this.props;
            if (sessions) {
                const start_moment = moment(start_date * 1000 || undefined).utc().hour(value).minute(minute);
                if (!isSessionAvailable(sessions, start_moment)) {
                    this.setState({
                        minute: this.minutes.find(m =>
                            isSessionAvailable(sessions, start_moment.minute(m))) || minute,
                        is_minute_selected: false,
                    });
                }
            }
        } else if (type === 'minute') {
            this.setState({
                minute            : value,
                is_minute_selected: true,
            });
        }
    }

    clear = (event) => {
        event.stopPropagation();
        this.resetValues();
        this.setState({
            hour  : undefined,
            minute: undefined,
        });
        this.props.onChange('');
    };

    saveRef(type, node) {
        if (!node) return;
        const save = {
            hour  : (n) => this.hourSelect = n,
            minute: (n) => this.minuteSelect = n,
        };

        save[type](node);
    }

    render() {
        const { preClass, value, toggle, start_date, sessions } = this.props;
        const start_moment       = moment(start_date * 1000 || undefined).utc();
        const start_moment_clone = start_moment.clone().minute(0).second(0);
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
                        <div className='list-title center-text'><strong>{localize('Hour')}</strong></div>
                        <div className='list-container'>
                            {this.hours.map((h, key) => {
                                start_moment_clone.hour(h);
                                const is_enabled = isSessionAvailable(sessions, start_moment_clone, start_moment, true);
                                return (
                                    <div
                                        className={`list-item${this.state.hour === h ? ' selected' : ''}${is_enabled ? '' : ' disabled'}`}
                                        key={key}
                                        onClick={this.selectHour.bind(null, h, is_enabled)}
                                    >
                                        {h}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div
                        ref={this.saveMinuteRef}
                        className={`${preClass}-minutes`}
                    >
                        <div className='list-title center-text'><strong>{localize('Minute')}</strong></div>
                        <div className='list-container'>
                            {this.minutes.map((mm, key) => {
                                start_moment_clone.hour(this.state.hour).minute(mm);
                                const is_enabled = isSessionAvailable(sessions, start_moment_clone, start_moment);
                                return (
                                    <div
                                        className={`list-item${this.state.minute === mm ? ' selected' : ''}${is_enabled ? '' : ' disabled'}`}
                                        key={key}
                                        onClick={this.selectMinute.bind(null, mm, is_enabled)}
                                    >{mm}
                                    </div>
                                );
                            })}
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
        const value = typeof arg === 'object' ? arg.target.value : arg;

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

    render() {
        const prefix_class='time-picker';
        const {
            is_nativepicker,
            value,
            name,
            is_align_right,
            placeholder,
            start_date,
            sessions,
        } = this.props;
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
                        value={value}
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
                                start_date={start_date}
                                value={value}
                                sessions={sessions}
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
    start_date     : PropTypes.number,
    sessions       : PropTypes.array,
};

TimePickerDropdown.propTypes = {
    className  : PropTypes.string,
    onChange   : PropTypes.func,
    preClass   : PropTypes.string,
    toggle     : PropTypes.func,
    value      : PropTypes.string,
    value_split: PropTypes.bool,
    start_date : PropTypes.number,
    sessions   : PropTypes.array,
};

export default TimePicker;
