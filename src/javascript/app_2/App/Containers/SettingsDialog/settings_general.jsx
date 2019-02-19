import PropTypes       from 'prop-types';
import React           from 'react';
import { localize }    from '_common/localize';
import { IconFlag }    from 'Assets/Common';
import { connect }     from 'Stores/connect';
import SettingsControl from '../../Components/Elements/SettingsDialog/settings_control.jsx';

const GeneralSettings = ({
    curr_language,
    is_dark_mode,
    is_purchase_confirmed,
    is_purchase_locked,
    showLanguage,
    toggleDarkMode,
    togglePurchaseConfirmation,
    togglePurchaseLock,
}) => (
    <div className='tab-content'>
        <div className='general-setting-container'>
            <SettingsControl
                name={localize('Language')}
                onClick={showLanguage}
            >
                <IconFlag className='flag' type={(curr_language || 'EN').toLowerCase()} />
            </SettingsControl>
            <SettingsControl
                name={localize('Dark Mode')}
                to_toggle={is_dark_mode}
                toggle={toggleDarkMode}
            />
            <SettingsControl
                name={localize('Purchase Confirmation')}
                to_toggle={is_purchase_confirmed}
                toggle={togglePurchaseConfirmation}
            />
            <SettingsControl
                name={localize('Purchase Lock')}
                to_toggle={is_purchase_locked}
                toggle={togglePurchaseLock}
            />
        </div>
    </div>
);

GeneralSettings.propTypes = {
    curr_language             : PropTypes.string,
    is_dark_mode              : PropTypes.bool,
    is_language_visible       : PropTypes.bool,
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    showLanguage              : PropTypes.func,
    toggleDarkMode            : PropTypes.func,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
};

export default connect(
    ({ common, ui }) => ({
        curr_language             : common.current_language,
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
