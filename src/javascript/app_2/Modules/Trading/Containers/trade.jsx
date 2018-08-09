import classNames           from 'classnames';
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
        const form_wrapper = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar-container desktop-only';

        return (
            <div id='trade_container' className='trade-container'>
                <div className='chart-container notice-msg'>
                    <SmartChart
                        onSymbolChange={this.props.onSymbolChange}
                        symbol={this.props.symbol}
                    />
                    <Test />
                </div>
                <div className={classNames(form_wrapper, {
                    'slide-out': contract_id,
                })}
                >
                    { contract_id ?
                        <ContractDetails contract_id={contract_id} onClickNewTrade={this.props.onClickNewTrade} />
                        :
                        <FormLayout is_mobile={this.props.is_mobile} is_trade_enabled={this.props.is_trade_enabled} />
                    }
                </div>
            </div>
        );
    }
}

Trade.propTypes = {
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
        is_trade_enabled : modules.trade.is_trade_enabled,
        onClickNewTrade  : modules.trade.onClickNewTrade,
        onSymbolChange   : modules.trade.onChange,
        purchase_info    : modules.trade.purchase_info,
        symbol           : modules.trade.symbol,
        updateQueryString: modules.trade.updateQueryString,
        is_mobile        : ui.is_mobile,
    })
)(Trade);
