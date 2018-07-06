import PropTypes    from 'prop-types';
import React        from 'react';
import MobileWidget from '../Elements/mobile_widget.jsx';
import ContractType from '../../Containers/contract_type.jsx';

const ScreenSmall = (/* { is_trade_enabled } */) => (
    <React.Fragment>
        <ContractType />
        <div className='mobile-only'>
            <MobileWidget />
        </div>
    </React.Fragment>
);

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
