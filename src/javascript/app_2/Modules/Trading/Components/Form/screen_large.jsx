import PropTypes    from 'prop-types';
import React        from 'react';
import ContractType from '../../Containers/contract_type.jsx';
import Purchase     from '../../Containers/purchase.jsx';
import TradeParams  from '../../Containers/trade_params.jsx';
import UILoader     from '../../../../App/Components/Elements/ui_loader.jsx';

const ScreenLarge = ({ contract_id, is_trade_enabled }) => (
    <div className='sidebar-items'>
        {!is_trade_enabled && !contract_id ?
            <UILoader />
            :
            <React.Fragment>
                <fieldset className='trade-types'>
                    <ContractType />
                </fieldset>
                <TradeParams />
                <div className='purchase-wrapper'>
                    <Purchase />
                </div>
            </React.Fragment>
        }
    </div>
);

ScreenLarge.propTypes = {
    contract_id     : PropTypes.string,
    is_trade_enabled: PropTypes.bool,
};

export default ScreenLarge;
