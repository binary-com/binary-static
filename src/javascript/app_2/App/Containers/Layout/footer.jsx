import PropTypes      from 'prop-types';
import React          from 'react';
import { BinaryLink } from '../../Components/Routes';
import {
    ToggleFullScreen,
    TogglePortfolio,
    ToggleSettings,
    }                 from '../../Components/Layout/Footer';
import ServerTime     from '../../Containers/server_time.jsx';
import { connect }    from '../../../Stores/connect';

const Footer = ({
    items,
    is_portfolio_drawer_on,
    is_language_dialog_visible,
    is_settings_dialog_on,
    toggleSettingsDialog,
    togglePortfolioDrawer,
}) => (
    <React.Fragment>
        <ServerTime />
        <div className='footer-links'>
            <TogglePortfolio
                is_portfolio_drawer_on={is_portfolio_drawer_on}
                togglePortfolioDrawer={togglePortfolioDrawer}
            />
            {!!(items && items.length) &&
                items.map((item, idx) => (
                    <BinaryLink key={idx} to={item.link_to} className={item.icon}>
                        <span title={item.text} />
                    </BinaryLink>
                ))}
            <ToggleFullScreen />
            <ToggleSettings
                is_settings_visible={is_settings_dialog_on}
                is_language_visible={is_language_dialog_visible}
                toggleSettings={toggleSettingsDialog}
            />
        </div>
    </React.Fragment>
);


Footer.propTypes = {
    items                     : PropTypes.array,
    is_language_dialog_visible: PropTypes.bool,
    is_portfolio_drawer_on    : PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,
    togglePortfolioDrawer     : PropTypes.func,
    toggleSettingsDialog      : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_portfolio_drawer_on    : ui.is_portfolio_drawer_on,
        is_settings_dialog_on     : ui.is_settings_dialog_on,
        togglePortfolioDrawer     : ui.togglePortfolioDrawer,
        toggleSettingsDialog      : ui.toggleSettingsDialog,
    })
)(Footer);
