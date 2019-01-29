import PropTypes                      from 'prop-types';
import React                          from 'react';
import { localize }                   from '_common/localize';
import { toMoment }                   from 'Utils/Date';

class TimePickerDropdown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.hours    = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
        this.minutes  = [...Array(12).keys()].map((a)=>`0${a * 5}`.slice(-2));
    }

    selectOption = (type, value, is_enabled = true) => {
        if (is_enabled && this.props.value) {
            const [ prev_hour, prev_minute ] = this.props.value.split(':');
            if ((type === 'h' && value !== prev_hour) || (type === 'm' && value !== prev_minute)) {
                this.props.onChange(`${type === 'h' ? value : prev_hour}:${type === 'm' ? value : prev_minute}`);
            }
        }
    };

    render() {
        const { preClass, value, start_time, end_time } = this.props;
        const start_time_moment     = start_time ? toMoment(start_time) : toMoment();
        const end_time_moment       = end_time ? toMoment(end_time) : toMoment().hour('23').minute('59').seconds('59').milliseconds('999');
        const to_compare_moment     = toMoment();
        const [ hour, minute ]      = value.split(':');
        return (
            <div className={`${preClass}-dropdown ${this.props.className}`}>
                <div className={`${preClass}-selector`}>
                    <div
                        ref={this.saveHourRef}
                        className={`${preClass}-hours`}
                    >
                        <div className='list-title center-text'><strong>{localize('Hour')}</strong></div>
                        <div className='list-container'>
                            {this.hours.map((h, key) => {
                                to_compare_moment.hour(h);
                                const is_enabled = to_compare_moment.isBetween(start_time_moment, end_time_moment);
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
                                to_compare_moment.hour(hour).minute(mm);
                                const is_enabled = to_compare_moment.isBetween(start_time_moment, end_time_moment, 'minute');
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

TimePickerDropdown.propTypes = {
    className   : PropTypes.string,
    end_time    : PropTypes.number,
    onChange    : PropTypes.func,
    preClass    : PropTypes.string,
    start_time  : PropTypes.number,
    value       : PropTypes.string,
};

export default TimePickerDropdown;
