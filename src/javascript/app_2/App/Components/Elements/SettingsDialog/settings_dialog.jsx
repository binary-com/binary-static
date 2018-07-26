import classNames      from 'classnames';
import React           from 'react';
import PropTypes       from 'prop-types';
import { Tabs }        from '../Tabs/';
import {
    ChartSettings,
    GeneralSettings,
    LanguageSettings,
    }                  from '../../../Containers/SettingsDialog';
import { localize }    from '../../../../../_common/localize';

class SettingsDialog extends React.PureComponent {

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    }

    // TO-DO - Simplify this
    handleClickOutside = (event) => {
        const footer_settings_btn = !(event.target.classList.contains('ic-settings', 'ic-settings active'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open && footer_settings_btn) {
            this.props.toggleDialog();
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    static get settings_content() {
        return {
            1: { header: localize('General'), content: GeneralSettings },
            2: { header: localize('Chart'), content: ChartSettings },
        };
    }

    render() {
        const settings_dialog_class = classNames('settings-dialog', {
            'show': this.props.is_open,
        });
        const settings_dialog_container_class = classNames('settings-dialog-container', {
            hide: this.props.is_language_dialog_visible,
        });
        return (
            <div ref={this.setWrapperRef} className={settings_dialog_class}>
                <div className={settings_dialog_container_class}>
                    <span className='settings-header'>{localize('Settings')}</span>
                    <Tabs alignment='center' list={SettingsDialog.settings_content} />
                </div>
                <LanguageSettings />
            </div>
        );
    }
}

SettingsDialog.propTypes = {
    is_language_dialog_visible: PropTypes.bool,
    is_open                   : PropTypes.bool,
    toggleDialog              : PropTypes.func,
};

export default SettingsDialog;
