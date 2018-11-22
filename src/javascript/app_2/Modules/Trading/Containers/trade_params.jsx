import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import { form_components }            from 'Stores/Modules/Trading/Constants/ui';
import { getComponentProperties }     from 'Utils/React/component';

class TradeParams extends React.Component {
    isVisible(component_name) {
        return this.props.form_components.includes(component_name);
    }

    renderCards() {
        return form_components
            .filter(({ name }) => this.isVisible(name))
            .map(({ name, Component }) => (
                <Component
                    key={name}
                    is_minimized={this.props.is_minimized}
                    is_nativepicker={this.props.is_nativepicker}
                    {...getComponentProperties(
                        Component,
                        this.props.trade_store,
                        {
                            server_time: this.props.server_time,
                        },
                    )}
                />
            ));
    }

    render() {
        return this.renderCards();
    }
}

TradeParams.propTypes = {
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_minimized   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    server_time    : PropTypes.object,
    trade_store    : PropTypes.object,
};

export default connect(
    ({ common, modules }) => ({
        server_time    : common.server_time,
        form_components: modules.trade.form_components,
        trade_store    : modules.trade,
    })
)(TradeParams);
