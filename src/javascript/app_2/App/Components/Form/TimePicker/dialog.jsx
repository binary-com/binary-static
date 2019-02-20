import PropTypes    from 'prop-types';
import classNames   from 'classnames';
import React        from 'react';
import { localize } from '_common/localize';
import { toMoment } from 'Utils/Date';

const Dialog = ({
    preClass,
    value,
    start_time,
    end_time,
    onChange,
    className,
}) => {
    const start_time_moment     = start_time ? toMoment(start_time) : toMoment();
    const end_time_moment       = end_time ? toMoment(end_time) : toMoment().hour('23').minute('59').seconds('59').milliseconds('999');
    const to_compare_moment     = toMoment();
    const [ hour, minute ]      = value.split(':');
    const hours    = [...Array(24).keys()].map((a)=>`0${a}`.slice(-2));
    const minutes  = [...Array(12).keys()].map((a)=>`0${a * 5}`.slice(-2));

    const selectOption = (type, current_value, prev_value, is_enabled = true) => {
        if (is_enabled && prev_value) {
            const [ prev_hour, prev_minute ] = prev_value.split(':');
            if ((type === 'h' && current_value !== prev_hour) || (type === 'm' && current_value !== prev_minute)) {
                onChange(`${type === 'h' ? current_value : prev_hour}:${type === 'm' ? current_value : prev_minute}`);
            }
        }
    };

    return (
        <div className={classNames(`${preClass}-dialog`, `${className}`)}>
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
                                    onClick={() => { selectOption('h', h, value, is_enabled); }}
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
                                    onClick={() => { selectOption('m', mm, value, is_enabled); }}
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
};

Dialog.propTypes = {
    className: PropTypes.string,
    end_time : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    onChange  : PropTypes.func,
    preClass  : PropTypes.string,
    start_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
};

export default Dialog;
