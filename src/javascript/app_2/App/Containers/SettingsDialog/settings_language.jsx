import React          from 'react';
import PropTypes      from 'prop-types';
import LanguageDialog from '../../Components/Elements/SettingsDialog/language_dialog.jsx';
import { connect }    from '../../../Stores/connect';

const LanguageSettings = ({ hide, is_visible }) => (
    <LanguageDialog hide={hide} is_visible={is_visible} />
);

LanguageSettings.propTypes = {
    is_visible: PropTypes.bool,
    hide      : PropTypes.func,
};

const language_settings_component = connect(
    ({ ui }) => ({
        is_visible: ui.is_language_dialog_on,
        hide      : ui.hideLanguageDialog,
    })
)(LanguageSettings);

export { language_settings_component as LanguageSettings };
