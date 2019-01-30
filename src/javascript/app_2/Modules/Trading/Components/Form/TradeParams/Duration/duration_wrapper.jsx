import PropTypes      from 'prop-types';
import React          from 'react';
import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import Duration from './duration.jsx';

class DurationWrapper extends React.Component {
    getDurationValue = selected_duration => {
        const duration = {
            t: this.props.duration_t,
            s: this.props.duration_s,
            m: this.props.duration_m,
            h: this.props.duration_h,
            d: this.props.duration_d,
        };
        return duration[selected_duration];
    };

    c_has_duration_unit = (duration_unit) => this.props.duration_units_list.some(du => du.value === duration_unit);

    setDurationUnit = () => {
        const new_duration_unit = this.props.duration_units_list[0].value;
        const duration_value    = this.getDurationValue(new_duration_unit);

        this.props.onChangeUiStore({ name: `${this.is_advanced_duration ? 'advanced' : 'simple'}_duration_unit`, value: new_duration_unit });
        this.props.onChange({ target: { name: 'duration_unit', value: new_duration_unit } });
        this.props.onChange({ target: { name: 'duration', value: duration_value } });
    };

    // intercept changes to current contracts duration_units_list and change duration_unit and value if they are missing
    componentWillReact() {
        const simple_is_missing_duration_unit = this.props.simple_duration_unit === 'd' && this.props.duration_units_list.length === 4;
        const current_duration                = this.props.is_advanced_duration ?
            this.props.advanced_duration_unit : this.props.simple_duration_unit;
        const has_missing_duration_unit       = !this.c_has_duration_unit(current_duration);

        if (has_missing_duration_unit || simple_is_missing_duration_unit) {
            this.setDurationUnit();
        }
    }

    render() {
        return (
            <Duration
                getDurationValue={this.getDurationValue}
                c_has_duration_unit={this.c_has_duration_unit}
                {...this.props}
            />
        );
    }
}

DurationWrapper.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type  : PropTypes.string,
    contract_expiry_type  : PropTypes.string,
    duration              : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_d: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_h: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_m: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_min_max: PropTypes.object,
    duration_s      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_t: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_unit      : PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date        : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_time         : PropTypes.string,
    expiry_type         : PropTypes.string,
    is_advanced_duration: PropTypes.bool,
    is_minimized        : PropTypes.bool,
    is_nativepicker     : PropTypes.bool,
    market_close_times  : PropTypes.array,
    onChange            : PropTypes.func,
    onChangeUiStore     : PropTypes.func,
    server_time         : PropTypes.object,
    sessions            : MobxPropTypes.arrayOrObservableArray,
    simple_duration_unit: PropTypes.string,
    start_date          : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time       : PropTypes.string,
    validation_errors: PropTypes.object,
};

export default observer(DurationWrapper);
