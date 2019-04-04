import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
// import { CSSTransition }  from 'react-transition-group';
import posed, { PoseGroup } from 'react-pose';
import { SettingsDialog } from 'App/Components/Elements/SettingsDialog/settings-dialog.jsx';
import { IconSettings }   from 'Assets/Footer';

const Modal = posed.div({
    enter: {
        y         : 0,
        opacity   : 1,
        delay     : 300,
        transition: {
            y      : { type: 'spring', stiffness: 1000, damping: 15 },
            default: { duration: 300 },
        },
    },
    exit: {
        y         : 50,
        opacity   : 0,
        transition: { duration: 150 },
    },
});

const ToggleSettings = ({
    hideBlur,
    is_dark_mode,
    is_language_visible,
    is_settings_visible,
    showBlur,
    toggleSettings,
}) => {
    const toggle_settings_class = classNames('ic-settings', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a
                href='javascript:;'
                onClick={toggleSettings}
                className={toggle_settings_class}
            >
                <IconSettings className='footer__icon ic-settings__icon' />
            </a>
            <PoseGroup>
                {is_settings_visible ?
                    <Modal key='modal' className='modal'>
                        <SettingsDialog
                            is_open={is_settings_visible}
                            is_language_dialog_visible={is_language_visible}
                            toggleDialog={toggleSettings}
                            is_dark_mode={is_dark_mode}
                            showBlur={showBlur}
                            hideBlur={hideBlur}
                        />
                    </Modal>
                    :
                    null
                }
            </PoseGroup>
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    hideBlur           : PropTypes.func,
    is_dark_mode       : PropTypes.bool,
    is_language_visible: PropTypes.bool,
    is_settings_visible: PropTypes.bool,
    showBlur           : PropTypes.func,
    toggleSettings     : PropTypes.func,
};

export { ToggleSettings };
