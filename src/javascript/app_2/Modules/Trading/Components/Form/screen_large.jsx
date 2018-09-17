import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import UILoader     from 'App/Components/Elements/ui_loader.jsx';
import ContractType from '../../Containers/contract_type.jsx';
import Purchase     from '../../Containers/purchase.jsx';
import TradeParams  from '../../Containers/trade_params.jsx';

const ScreenLarge = ({ is_contract_visible, is_trade_enabled }) => (
    <div className={classNames('sidebar-items', {
        'sidebar-items__slideout': is_contract_visible,
    })}
    >
        {!is_trade_enabled && !is_contract_visible ?
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
    is_contract_visible: PropTypes.bool,
    is_trade_enabled   : PropTypes.bool,
};

export default ScreenLarge;
