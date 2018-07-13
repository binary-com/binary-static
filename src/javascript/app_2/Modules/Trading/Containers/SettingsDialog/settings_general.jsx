import React        from 'react';
import PropTypes    from 'prop-types';
import SettingsControl from '../../../../App/Components/Elements/SettingsDialog/settings_control.jsx';
import { connect }  from '../../../../Stores/connect';
import { get as getLanguage } from '../../../../../_common/language';

const GeneralSettings = ({
    is_dark_mode,
    is_purchase_confirmed,
    is_purchase_locked,
    showLanguage,
    toggleDarkMode,
    togglePurchaseConfirmation,
    togglePurchaseLock}) => {
    const curr_language = getLanguage();
    return (
        <div className='tab-content'>
            <div className='general-setting-container'>
                <SettingsControl
                    name='language'
                    onClick={showLanguage}
                >
                    <i className={`flag ic-flag-${(curr_language || 'EN').toLowerCase()}`} />
                </SettingsControl>
                <SettingsControl
                    name='dark mode'
                    to_toggle={is_dark_mode}
                    toggle={toggleDarkMode}
                />
                <SettingsControl
                    name='purchase confirmation'
                    to_toggle={is_purchase_confirmed}
                    toggle={togglePurchaseConfirmation}
                />
                <SettingsControl
                    name='purchase lock'
                    to_toggle={is_purchase_locked}
                    toggle={togglePurchaseLock}
                />
            </div>
        </div>
    );
};

GeneralSettings.propTypes = {
    showLanguage              : PropTypes.func,
    is_dark_mode              : PropTypes.bool,
    is_language_visible       : PropTypes.bool,
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    toggleDarkMode            : PropTypes.func,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_dark_mode              : ui.is_dark_mode_on,
        is_language_visible       : ui.is_language_dialog_on,
        is_purchase_confirmed     : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        showLanguage              : ui.showLanguageDialog,
        toggleDarkMode            : ui.toggleDarkMode,
        togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        togglePurchaseLock        : ui.togglePurchaseLock,
    })
)(GeneralSettings);
