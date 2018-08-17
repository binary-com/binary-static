import PropTypes    from 'prop-types';
import React        from 'react';
import ContractType from '../../Containers/contract_type.jsx';
import Purchase     from '../../Containers/purchase.jsx';
import TradeParams  from '../../Containers/trade_params.jsx';
import UILoader     from '../../../../App/Components/Elements/ui_loader.jsx';

const ScreenLarge = ({ is_trade_enabled }) => (
    <div className='sidebar-container desktop-only'>
        <div className='sidebar-items'>
            {!is_trade_enabled ?
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
    </div>
);

ScreenLarge.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenLarge;
