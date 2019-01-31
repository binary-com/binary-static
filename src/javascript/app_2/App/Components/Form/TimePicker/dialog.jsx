import classNames   from 'classnames';
import React        from 'react';
import { localize } from '_common/localize';
import { toMoment } from 'Utils/Date';

function selectOption(type, value, props, is_enabled = true) {
    if (is_enabled && props.value) {
        const [ prev_hour, prev_minute ] = props.value.split(':');
        if ((type === 'h' && value !== prev_hour) || (type === 'm' && value !== prev_minute)) {
            props.onChange(`${type === 'h' ? value : prev_hour}:${type === 'm' ? value : prev_minute}`);
        }
    }
}

function Dialog(props) {
    const { preClass, value, start_time, end_time } = props;
    const start_time_moment     = start_time ? toMoment(start_time) : toMoment();
    const end_time_moment       = end_time ? toMoment(end_time) : toMoment().hour('23').minute('59').seconds('59').milliseconds('999');
    const to_compare_moment     = toMoment();
    const [ hour, minute ]      = value.split(':');
    const hours    = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
    const minutes  = [...Array(12).keys()].map((a)=>`0${a * 5}`.slice(-2));
    return (
        <div className={classNames(`${preClass}-dialog`, `${props.className}`)}>
            <div className={`${preClass}-selector`}>
                <div className={`${preClass}-hours`}>
                    <div className='list-title center-text'><strong>{localize('Hour')}</strong></div>
                    <div className='list-container'>
                        {hours.map((h, key) => {
                            to_compare_moment.hour(h).minute(minute);
                            const is_enabled = to_compare_moment.isBetween(start_time_moment, end_time_moment);
                            return (
                                <div
                                    className={classNames('list-item',
                                        { 'selected': (hour === h) },
                                        { 'disabled': !is_enabled })}
                                    key={key}
                                    onClick={() => { selectOption('h', h, props, is_enabled); }}
                                >
                                    {h}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={`${preClass}-minutes`}>
                    <div className='list-title center-text'><strong>{localize('Minute')}</strong></div>
                    <div className='list-container'>
                        {minutes.map((mm, key) => {
                            to_compare_moment.hour(hour).minute(mm);
                            const is_enabled = to_compare_moment.isBetween(start_time_moment, end_time_moment, 'minute');
                            return (
                                <div
                                    className={classNames('list-item',
                                        { 'selected': (minute === mm) },
                                        { 'disabled': !is_enabled })}
                                    key={key}
                                    onClick={() => { selectOption('m', mm, props, is_enabled); }}
                                >
                                    {mm}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dialog;
