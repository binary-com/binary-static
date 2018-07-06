import PropTypes    from 'prop-types';
import React        from 'react';
import ContractType from '../../Containers/contract_type.jsx';
import Purchase     from '../../Containers/purchase.jsx';
import TradeParams  from '../../Containers/trade_params.jsx';
import UILoader     from '../../../../components/elements/ui_loader.jsx';

const ScreenLarge = ({ is_trade_enabled }) => (
    <div className='sidebar-container desktop-only'>
        <div className='sidebar-items'>
            {!is_trade_enabled &&
                <UILoader />
            }
            <fieldset className='trade-types'>
                <ContractType className='desktop-only'/>
            </fieldset>
            <TradeParams />
            <div className='purchase-wrapper'>
                <Purchase />
            </div>
        </div>
    </div>
);

ScreenLarge.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenLarge;
