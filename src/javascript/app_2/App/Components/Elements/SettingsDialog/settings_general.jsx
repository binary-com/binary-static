import React        from 'react';
import PropTypes    from 'prop-types';
import SettingsControl from './settings_control.jsx';
import { connect }  from '../../../../Stores/connect';
import { get as getLanguage } from '../../../../../_common/language';

class GeneralSettings extends React.Component {
    render() {
        const curr_language = getLanguage();
        return (
            <div className='tab-content'>
                <div className='general-setting-container'>
                    <SettingsControl
                        name='language'
                        onClick={this.props.showLanguage}
                    >
                        <i className={`flag ic-flag-${(curr_language || 'EN').toLowerCase()}`} />
                    </SettingsControl>
                    <SettingsControl
                        name='dark mode'
                        to_toggle={this.props.is_dark_mode}
                        toggle={this.props.toggleDarkMode}
                    />
                    <SettingsControl
                        name='purchase confirmation'
                        to_toggle={this.props.is_purchase_confirmed}
                        toggle={this.props.togglePurchaseConfirmation}
                    />
                    <SettingsControl
                        name='purchase lock'
                        to_toggle={this.props.is_purchase_locked}
                        toggle={this.props.togglePurchaseLock}
                    />
                </div>
            </div>
        );
    }
};

GeneralSettings.propTypes = {
    showLanguage              : PropTypes.func,
    is_dark_mode              : PropTypes.bool,
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    toggleDarkMode            : PropTypes.func,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        showLanguage              : ui.showLanguageDialog,
        is_dark_mode              : ui.is_dark_mode_on,
        is_purchase_confirmed     : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        toggleDarkMode            : ui.toggleDarkMode,
        togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        togglePurchaseLock        : ui.togglePurchaseLock,
    })
)(GeneralSettings);
