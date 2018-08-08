import PropTypes    from 'prop-types';
import React        from 'react';
import ScreenLarge  from './screen_large.jsx';
import ScreenSmall  from './screen_small.jsx';

const FormLayout = ({
    is_app_ready,
    is_mobile,
    is_trade_enabled,
}) => (
    is_mobile ?
        <ScreenSmall is_trade_enabled={is_trade_enabled} />
        :
        <ScreenLarge is_trade_enabled={is_trade_enabled} is_app_ready={is_app_ready} />
);

FormLayout.propTypes = {
    is_app_ready    : PropTypes.bool,
    is_mobile       : PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
};

export default FormLayout;
