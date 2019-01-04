import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import { localize }              from '_common/localize';
import { isSessionAvailable }    from 'Stores/Modules/Trading/Helpers/start_date';
import { toMoment }              from 'Utils/Date';
import InputField                from './input_field.jsx';

class TimePickerDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.hours    = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
        this.minutes  = [...Array(12).keys()].map((a)=>`0${a * 5}`.slice(-2));
        this.state    = {
            is_hour_selected  : false,
            is_minute_selected: false,
            last_updated_type : null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { is_hour_selected, is_minute_selected } = this.state;
        if (is_hour_selected && is_minute_selected) {
            this.resetValues();
            this.props.toggle();
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

    selectOption = (type, value, is_enabled = true) => {
        if (is_enabled && this.props.value) {
            const [ prev_hour, prev_minute ] = this.props.value.split(':');
            if ((type === 'h' && value !== prev_hour) || (type === 'm' && value !== prev_minute)) {
                const is_type_selected = type === 'h' ? 'is_hour_selected' : 'is_minute_selected';
                this.setState({
                    last_updated_type : type,
                    [is_type_selected]: true,
                });
                this.props.onChange(`${type === 'h' ? value : prev_hour}:${type === 'm' ? value : prev_minute}`);
            }
        }
    };

    clear = (event) => {
        event.stopPropagation();
        this.resetValues();
        this.props.onChange('');
    };

    render() {
        const { preClass, value, toggle, start_date, sessions } = this.props;
        const start_moment       = toMoment(start_date);
        const start_moment_clone = start_moment.clone().minute(0).second(0);
        const [ hour, minute ]   = value.split(':');
        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div
                    className={`${preClass}-panel`}
                    onClick={toggle}
                >
                    <span className={value ? '' : 'placeholder'}>{value || localize('Select time')}</span>
                    {(!('is_clearable' in this.props) || this.props.is_clearable) &&
                        <span
                            className={`${preClass}-clear`}
                            onClick={this.clear}
                        />
                    }
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
                                        className={`list-item${hour === h ? ' selected' : ''}${is_enabled ? '' : ' disabled'}`}
                                        key={key}
                                        onClick={() => { this.selectOption('h', h, is_enabled); }}
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
                                start_moment_clone.hour(hour).minute(mm);
                                const is_enabled = isSessionAvailable(sessions, start_moment_clone, start_moment);
                                return (
                                    <div
                                        className={`list-item${minute === mm ? ' selected' : ''}${is_enabled ? '' : ' disabled'}`}
                                        key={key}
                                        onClick={() => { this.selectOption('m', mm, is_enabled); }}
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

class TimePicker extends React.Component {
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
        const prefix_class = 'time-picker';
        const {
            is_nativepicker,
            value,
            name,
            is_align_right,
            placeholder,
            start_date,
            sessions,
            validation_errors,
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
                                <InputField
                                    error_messages={validation_errors}
                                    type='text'
                                    is_read_only={true}
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
                                    is_clearable={this.props.is_clearable}
                                />
                            </React.Fragment>
                        )
                }
            </div>
        );
    }
}

TimePicker.propTypes = {
    is_align_right : PropTypes.bool,
    is_clearable   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    name           : PropTypes.string,
    onChange       : PropTypes.func,
    padding        : PropTypes.string,
    placeholder    : PropTypes.string,
    sessions       : MobxPropTypes.arrayOrObservableArray,
    start_date     : PropTypes.number,
    value          : PropTypes.string,
};

TimePickerDropdown.propTypes = {
    className   : PropTypes.string,
    is_clearable: PropTypes.bool,
    onChange    : PropTypes.func,
    preClass    : PropTypes.string,
    sessions    : MobxPropTypes.arrayOrObservableArray,
    start_date  : PropTypes.number,
    toggle      : PropTypes.func,
    value       : PropTypes.string,
    value_split : PropTypes.bool,
};

export default observer(TimePicker);
