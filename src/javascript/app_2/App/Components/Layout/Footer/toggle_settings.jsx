import PropTypes      from 'prop-types';
import React          from 'react';
import Popover        from '../../../Components/Elements/popover.jsx';
import SettingsDialog from '../../../Components/Elements/SettingsDialog/settings_dialog.jsx';

const ToggleSettings = ({
    is_language_visible,
    is_settings_visible,
    toggleSettings,
}) => (
    <React.Fragment>
        <Popover
            subtitle='Settings'
            alignment='top-right'
        >
            <a
                href='javascript:;'
                className='ic-settings'
                onClick={toggleSettings}
            />
        </Popover>
        <SettingsDialog
            is_open={is_settings_visible}
            is_language_dialog_visible={is_language_visible}
            toggleDialog={toggleSettings}
        />
    </React.Fragment>
);

ToggleSettings.propTypes = {
    is_language_visible: PropTypes.bool,
    is_settings_visible: PropTypes.bool,
    toggleSettings     : PropTypes.func,
};

export { ToggleSettings };
