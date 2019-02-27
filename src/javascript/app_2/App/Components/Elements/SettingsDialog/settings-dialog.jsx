import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import ReactDOM        from 'react-dom';
import { localize }    from '_common/localize';
import Localize        from '../localize';
import { VerticalTab } from '../VerticalTabs';
import {
    ChartSettings, GeneralSettings, LanguageSettings,
}                      from '../../../Containers/SettingsDialog';

const modal_root = document.getElementById('modal_root');

class SettingsDialog extends React.PureComponent {
    // Render target element
    settings_dialog_class = classNames('settings-dialog', {
        'settings-dialog__container--show': this.props.is_open,
    });

    el = document.createElement('div');

    static get settings_content() {
        return [
            {
                label: localize('General'),
                value: GeneralSettings,
            }, {
                label: localize('Chart'),
                value: ChartSettings,
            },
        ];
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.el.classList.add('settings-dialog');
        this.props.showBlur();
        modal_root.appendChild(this.el);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        modal_root.removeChild(this.el);
        this.props.hideBlur();
    }

    // TODO - Simplify this
    handleClickOutside = (event) => {
        const footer_settings_btn = !(
            event.target.classList.contains('ic-settings', 'ic-settings active')
        );
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open && footer_settings_btn) {
            this.props.toggleDialog();
        }
    };

    render() {
        const settings_dialog_container_class = classNames('settings-dialog__container', {
            'settings-dialog__container--hide': this.props.is_language_dialog_visible,
        });
        return ReactDOM.createPortal(
            <React.Fragment>
                <div ref={this.setWrapperRef} className={settings_dialog_container_class}>
                    <div className='dialog-header'>
                        <h3 className='dialog-header__heading'>{localize('Platform settings')}</h3>
                        <div className='dialog-header__close-btn'>
                            CLose
                        </div>
                    </div>
                    <VerticalTab
                        alignment='center'
                        classNameHeader='settings-dialog__tab-header'
                        list={SettingsDialog.settings_content}
                    />
                </div>
                <LanguageSettings />
            </React.Fragment>, this.el);
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };
}

SettingsDialog.propTypes = {
    hideBlur                  : PropTypes.func,
    is_language_dialog_visible: PropTypes.bool,
    is_open                   : PropTypes.bool,
    showBlur                  : PropTypes.func,
    toggleDialog              : PropTypes.func,
};

export default SettingsDialog;
