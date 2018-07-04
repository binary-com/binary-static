import PropTypes    from 'prop-types';
import React        from 'react';
import MobileWidget from '../elements/mobile_widget.jsx';
import ContractType from './TradeParams/contract_type.jsx';

const ScreenSmall = (/* { is_trade_enabled } */) => (
    <React.Fragment>
        <ContractType className='mobile-only' is_mobile_widget />
        <div className='mobile-only'>
            <MobileWidget />
        </div>
    </React.Fragment>
);

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
