import PropTypes    from 'prop-types';
import React        from 'react';
import SellButton   from '../Components/Sell/sell_button.jsx';
import { connect }  from '../../../Stores/connect';

const ContractSell = ({
    contract_info,
    is_sell_requested,
    is_valid_to_sell,
    onClickSell,
    sell_error,
}) => contract_info.tick_count ? null : ( // Sell is not available for tick contracts
    <div className='sell'>
        <SellButton
            contract_info={contract_info}
            error_message={sell_error}
            is_sell_requested={is_sell_requested}
            is_valid_to_sell={is_valid_to_sell}
            onClickSell={onClickSell}
        />
    </div>
);

ContractSell.propTypes = {
    contract_info    : PropTypes.object,
    is_sell_requested: PropTypes.bool,
    is_valid_to_sell : PropTypes.bool,
    onClickSell      : PropTypes.func,
    sell_error       : PropTypes.string,
};

export default connect(
    ({ modules }) => ({
        contract_info    : modules.contract.contract_info,
        is_sell_requested: modules.contract.is_sell_requested,
        is_valid_to_sell : modules.contract.is_valid_to_sell,
        onClickSell      : modules.contract.onClickSell,
        sell_error       : modules.contract.sell_info.error_message,
    })
)(ContractSell);
