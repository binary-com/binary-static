import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import { IconSettings } from 'Assets/Footer';
import SettingsDialog   from '../../Elements/SettingsDialog/settings_dialog.jsx';

const ToggleSettings = ({
    is_language_visible,
    is_settings_visible,
    toggleSettings,
}) => {
    const toggle_settings_class = classNames('ic-settings', {
        'active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a
                href='javascript:;'
                onClick={toggleSettings}
                className={toggle_settings_class}
            >
                <IconSettings className='footer-icon' />
            </a>
            <SettingsDialog
                is_open={is_settings_visible}
                is_language_dialog_visible={is_language_visible}
                toggleDialog={toggleSettings}
            />
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    is_language_visible: PropTypes.bool,
    is_settings_visible: PropTypes.bool,
    toggleSettings     : PropTypes.func,
};

export { ToggleSettings };
