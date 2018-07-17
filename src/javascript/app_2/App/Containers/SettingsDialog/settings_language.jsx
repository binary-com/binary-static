import React          from 'react';
import PropTypes      from 'prop-types';
import LanguageDialog from '../../Components/Elements/SettingsDialog/language_dialog.jsx';
import { connect }    from '../../../Stores/connect';

const LanguageSettings = ({
    hide,
    is_visible,
    is_settings_on,
    }) => (
        <LanguageDialog
            hide={hide}
            is_visible={is_visible}
            is_settings_on={is_settings_on}
        />
);

LanguageSettings.propTypes = {
    is_visible    : PropTypes.bool,
    is_settings_on: PropTypes.bool,
    hide          : PropTypes.func,
};

const language_settings_component = connect(
    ({ ui }) => ({
        is_settings_on: ui.is_settings_dialog_on,
        is_visible    : ui.is_language_dialog_on,
        hide          : ui.hideLanguageDialog,
    })
)(LanguageSettings);

export { language_settings_component as LanguageSettings };
