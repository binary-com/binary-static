import PropTypes                from 'prop-types';
import React                    from 'react';
import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import Duration                 from './duration.jsx';

class DurationWrapper extends React.Component {
    hasDurationUnit = (duration_unit) => this.props.duration_units_list.some(du => du.value === duration_unit);

    setDurationUnit = () => {
        const new_duration_unit  = this.props.duration_units_list[0].value;
        const new_duration_value = this.props.getDurationFromUnit(new_duration_unit);

        this.props.onChangeUiStore({ name: `${this.is_advanced_duration ? 'advanced' : 'simple'}_duration_unit`, value: new_duration_unit });
        this.props.onChange({ target: { name: 'duration_unit', value: new_duration_unit } });
        this.props.onChange({ target: { name: 'duration', value: new_duration_value } });
    };

    componentWillReact() {
        const simple_is_missing_duration_unit = this.props.simple_duration_unit === 'd' && this.props.duration_units_list.length === 4;
        const current_duration                = this.props.is_advanced_duration ?
            this.props.advanced_duration_unit : this.props.simple_duration_unit;
        const has_missing_duration_unit       = !this.hasDurationUnit(current_duration);
        const simple_is_not_type_duration     = !this.props.is_advanced_duration && this.props.expiry_type !== 'duration';
        const advanced_has_wrong_expiry       = this.props.is_advanced_duration
            && this.props.expiry_type !== this.props.advanced_expiry_type;

        // intercept changes to current contracts duration_units_list - if they are missing change duration_unit and value in trade_store and ui_store
        if (has_missing_duration_unit || simple_is_missing_duration_unit) {
            this.setDurationUnit();
        }

        // simple only has expiry type duration
        if (simple_is_not_type_duration) {
            this.props.onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }

        if (advanced_has_wrong_expiry) {
            this.props.onChange({ target: { name: 'expiry_type', value: this.props.advanced_expiry_type } });
        }
    }

    render() {
        return (
            <Duration
                hasDurationUnit={this.hasDurationUnit}
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
    getDurationFromUnit : PropTypes.func,
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
