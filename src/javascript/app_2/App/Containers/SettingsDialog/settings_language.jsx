import PropTypes      from 'prop-types';
import React          from 'react';
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
    hide          : PropTypes.func,
    is_settings_on: PropTypes.bool,
    is_visible    : PropTypes.bool,
};

export default connect(
    ({ ui }) => ({
        hide          : ui.hideLanguageDialog,
        is_settings_on: ui.is_settings_dialog_on,
        is_visible    : ui.is_language_dialog_on,
    })
)(LanguageSettings);
