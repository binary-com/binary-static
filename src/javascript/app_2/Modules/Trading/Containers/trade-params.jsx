import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
// import { form_components }            from 'Stores/Modules/Trading/Constants/ui';
// import { getComponentProperties }     from 'Utils/React/component';
import Amount                         from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
import Barrier                        from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import Duration                       from 'Modules/Trading/Components/Form/TradeParams/Duration';
import LastDigit                      from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import { connect }                    from 'Stores/connect';

class TradeParams extends React.Component {
    isVisible(component_key) {
        return this.props.form_components.includes(component_key);
    }

    get amount_props() {
        return {
            amount             : this.props.amount,
            basis              : this.props.basis,
            basis_list         : this.props.basis_list,
            contract_start_type: this.props.contract_start_type,
            contract_type      : this.props.contract_type,
            contract_types_list: this.props.contract_types_list,
            currencies_list    : this.props.currencies_list,
            currency           : this.props.currency,
            duration_unit      : this.props.duration_unit,
            expiry_type        : this.props.expiry_type,
            is_equal           : this.props.is_equal,
            is_minimized       : this.props.is_minimized,
            is_nativepicker    : this.props.is_nativepicker,
            is_single_currency : this.props.is_single_currency,
            onChange           : this.props.onChange,
            validation_errors  : this.props.validation_errors,
        };
    }

    get barrier_props() {
        return {
            barrier_1        : this.props.barrier_1,
            barrier_2        : this.props.barrier_2,
            barrier_count    : this.props.barrier_count,
            is_minimized     : this.props.is_minimized,
            onChange         : this.props.onChange,
            validation_errors: this.props.validation_errors,
        };
    }

    get duration_props() {
        return {
            advanced_duration_unit: this.props.advanced_duration_unit,
            advanced_expiry_type  : this.props.advanced_expiry_type,
            contract_expiry_type  : this.props.contract_expiry_type,
            duration              : this.props.duration,
            duration_unit         : this.props.duration_unit,
            duration_units_list   : this.props.duration_units_list,
            duration_min_max      : this.props.duration_min_max,
            duration_t            : this.props.duration_t,
            expiry_date           : this.props.expiry_date,
            expiry_time           : this.props.expiry_time,
            expiry_type           : this.props.expiry_type,
            getDurationFromUnit   : this.props.getDurationFromUnit,
            // hasDurationUnit       : this.props.hasDurationUnit,
            is_advanced_duration  : this.props.is_advanced_duration,
            is_minimized          : this.props.is_minimized,
            onChange              : this.props.onChange,
            onChangeUiStore       : this.props.onChangeUiStore,
            onChangeMultiple      : this.props.onChangeMultiple,
            simple_duration_unit  : this.props.simple_duration_unit,
            server_time           : this.props.server_time,
            start_date            : this.props.start_date,
            validation_errors     : this.props.validation_errors,
            market_open_times     : this.props.market_open_times,
        };
    }

    get last_digit_props() {
        return {
            is_minimized: this.props.is_minimized,
            last_digit  : this.props.last_digit,
            onChange    : this.props.onChange,
        };
    }

    render() {

        return (
            <React.Fragment>
                {
                    this.isVisible('duration') &&
                    <Duration
                        key={'duration'}
                        {...this.duration_props}
                    />
                }
                {
                    this.isVisible('barrier') &&
                    <Barrier
                        key={'barrier'}
                        {...this.barrier_props}
                    />
                }
                {
                    this.isVisible('last_digit') &&
                    <LastDigit
                        key={'last_digit'}
                        {...this.last_digit_props}
                    />
                }
                {
                    this.isVisible('amount') &&
                    <Amount
                        key={'amount'}
                        {...this.amount_props}
                    />
                }
            </React.Fragment>
        );
    }
}

TradeParams.propTypes = {
    client_store   : PropTypes.object,
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_minimized   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    server_time    : PropTypes.object,
    trade_store    : PropTypes.object,
};

export default connect(
    ({ client, common, modules, ui }) => ({
        client_store          : client,
        form_components       : modules.trade.form_components,
        trade_store           : modules.trade,
        ui_store              : ui,
        // Amount component props
        amount                : modules.trade.amount,
        basis                 : modules.trade.basis,
        basis_list            : modules.trade.basis_list,
        contract_start_type   : modules.trade.contract_start_type,
        contract_type         : modules.trade.contract_type,
        contract_types_list   : modules.trade.contract_types_list,
        currencies_list       : client.currencies_list,
        currency              : modules.trade.currency,
        duration_unit         : modules.trade.duration_unit,
        expiry_type           : modules.trade.expiry_type,
        is_equal              : modules.trade.is_equal,
        // is_minimized          : modules.trade.,
        // is_nativepicker       :,
        is_single_currency    : client.is_single_currency,
        onChange              : modules.trade.onChange,
        validation_errors     : modules.trade.validation_errors,
        // Barrier component props
        barrier_1             : modules.trade.barrier_1,
        barrier_2             : modules.trade.barrier_2,
        barrier_count         : modules.trade.barrier_count,
        // is_minimized          :,
        // onChange              : modules.trade.onChange,
        // validation_errors     : modules.trade.validation_errors,
        // Duration component props
        advanced_duration_unit: ui.advanced_duration_unit,
        advanced_expiry_type  : ui.advanced_expiry_type,
        contract_expiry_type  : modules.trade.contract_expiry_type,
        duration              : modules.trade.duration,
        // duration_unit         : modules.trade.duration_unit,
        duration_units_list   : modules.trade.duration_units_list,
        duration_min_max      : modules.trade.duration_min_max,
        duration_t            : ui.duration_t,
        expiry_date           : modules.trade.expiry_date,
        expiry_time           : modules.trade.expiry_time,
        // expiry_type           : modules.trade.expiry_type,
        getDurationFromUnit   : ui.getDurationFromUnit,
        // hasDurationUnit       : ,
        is_advanced_duration  : ui.is_advanced_duration,
        // is_minimized          :,
        // onChange              : modules.trade.onChange,
        onChangeUiStore       : ui.onChangeUiStore,
        onChangeMultiple      : modules.trade.onChangeMultiple,
        simple_duration_unit  : ui.simple_duration_unit,
        server_time           : common.server_time,
        start_date            : modules.trade.start_date,
        // validation_errors     : modules.trade.validation_errors,
        market_open_times     : modules.trade.market_open_times,
        // LastDigit component props
        // is_minimized          :,
        last_digit            : modules.trade.last_digit,
        // onChange              : modules.trade.onChange,
    })
)(TradeParams);
