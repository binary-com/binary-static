import PropTypes            from 'prop-types';
import React                from 'react';
import Test                 from './test.jsx';
import FormLayout           from '../Components/Form/form_layout.jsx';
import ContractDetails      from '../../Contract/Containers/contract_details.jsx';
import SmartChart           from '../../SmartChart';
import { connect }          from '../../../Stores/connect';
import { getPropertyValue } from '../../../../_common/utility';

class Trade extends React.Component {
    componentDidMount() {
        this.props.updateQueryString();
    }

    render() {
        const contract_id = getPropertyValue(this.props.purchase_info, ['buy', 'contract_id']);

        return (
            <div id='trade_container' className='trade-container'>
                <div className='chart-container notice-msg'>
                    <SmartChart
                        initial_symbol={this.props.initial_symbol}
                        onSymbolChange={this.props.onSymbolChange}
                    />
                    <Test />
                </div>
                { contract_id ?
                    <ContractDetails contract_id={contract_id} onClickNewTrade={this.props.onClickNewTrade} />
                    :
                    <FormLayout is_mobile={this.props.is_mobile} is_trade_enabled={this.props.is_trade_enabled} />
                }
                {/* TODO: to move PortfolioDrawer to an upper parent, as it should be available in all pages */}
            </div>
        );
    }
}

Trade.propTypes = {
    initial_symbol   : PropTypes.string,
    is_mobile        : PropTypes.bool,
    is_trade_enabled : PropTypes.bool,
    onSymbolChange   : PropTypes.func,
    onClickNewTrade  : PropTypes.func,
    purchase_info    : PropTypes.object,
    updateQueryString: PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        initial_symbol   : modules.trade.symbol,
        is_trade_enabled : modules.trade.is_trade_enabled,
        onClickNewTrade  : modules.trade.onClickNewTrade,
        onSymbolChange   : modules.trade.onChange,
        purchase_info    : modules.trade.purchase_info,
        updateQueryString: modules.trade.updateQueryString,
        is_mobile        : ui.is_mobile,
    })
)(Trade);
