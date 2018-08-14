import PropTypes              from 'prop-types';
import React                  from 'react';
import { CSSTransition } from 'react-transition-group';
import Test                   from './test.jsx';
import FormLayout             from '../Components/Form/form_layout.jsx';
import InfoBox                from '../../Contract/Components/InfoBox';
import ContractDetails        from '../../Contract/Containers/contract_details.jsx';
import SmartChart             from '../../SmartChart';
import { connect }            from '../../../Stores/connect';
import { getPropertyValue }   from '../../../../_common/utility';

class Trade extends React.Component {
    componentDidMount() {
        this.props.updateQueryString();
    }

    render() {
        const contract_id = getPropertyValue(this.props.purchase_info, ['buy', 'contract_id']);
        const form_wrapper_class = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar-container desktop-only';
        const InfoBoxComponent = this.props.is_contract_mode ?
            <InfoBox contract_info={this.props.contract_info} /> : null;

        return (
            <div id='trade_container' className='trade-container'>
                <div className='chart-container notice-msg'>
                    { this.props.symbol &&
                        <SmartChart
                            InfoBox={InfoBoxComponent}
                            onSymbolChange={this.props.onSymbolChange}
                            symbol={this.props.symbol}
                        />
                    }
                    <Test />
                </div>
                <div
                    className={form_wrapper_class}
                >
                    <FormLayout
                        is_mobile={this.props.is_mobile}
                        is_contract_visible={!!contract_id}
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                    <CSSTransition
                        in={!!contract_id}
                        timeout={600}
                        classNames='contract-wrapper'
                        unmountOnExit
                    >
                        <div className='contract-wrapper'>
                            <ContractDetails
                                contract_id={contract_id}
                                onClickNewTrade={this.props.onClickNewTrade}
                            />
                        </div>
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

Trade.propTypes = {
    contract_info    : PropTypes.object,
    is_contract_mode : PropTypes.bool,
    is_mobile        : PropTypes.bool,
    is_trade_enabled : PropTypes.bool,
    onSymbolChange   : PropTypes.func,
    onClickNewTrade  : PropTypes.func,
    purchase_info    : PropTypes.object,
    symbol           : PropTypes.string,
    updateQueryString: PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        contract_info    : modules.contract.contract_info,
        is_contract_mode : modules.smart_chart.is_contract_mode,
        is_trade_enabled : modules.trade.is_trade_enabled,
        onClickNewTrade  : modules.trade.onClickNewTrade,
        onSymbolChange   : modules.trade.onChange,
        purchase_info    : modules.trade.purchase_info,
        symbol           : modules.trade.symbol,
        updateQueryString: modules.trade.updateQueryString,
        is_mobile        : ui.is_mobile,
    })
)(Trade);
