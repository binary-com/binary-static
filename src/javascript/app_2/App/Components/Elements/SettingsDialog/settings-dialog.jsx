import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import ReactDOM           from 'react-dom';
import { localize }       from '_common/localize';
import VerticalTab        from 'App/Components/Elements/VerticalTabs';
import {
    ChartSettings,
    LanguageSettings,
    ThemeSelectSettings,
    PurchaseSettings,
}                         from 'App/Containers/SettingsDialog';
import LightThemeIcon     from 'Images/app_2/settings/ic-theme.svg';
import ThemeIcon          from 'Images/app_2/settings/ic-theme-normal.svg';
import ThemeIconActive    from 'Images/app_2/settings/ic-theme-active.svg';
import LightLanguageIcon  from 'Images/app_2/settings/ic-language.svg';
import LanguageIcon       from 'Images/app_2/settings/ic-language-normal.svg';
import LanguageIconActive from 'Images/app_2/settings/ic-language-active.svg';
import LightCloseIcon     from 'Images/app_2/settings/ic-close.svg';
import CloseIcon          from 'Images/app_2/settings/ic-close-normal.svg';
import LightChartsIcon    from 'Images/app_2/settings/ic-charts.svg';
import ChartsIcon         from 'Images/app_2/settings/ic-charts-normal.svg';
import ChartsIconActive   from 'Images/app_2/settings/ic-charts-active.svg';
import LightPurchaseIcon  from 'Images/app_2/settings/ic-purchase.svg';
import PurchaseIcon       from 'Images/app_2/settings/ic-purchase-normal.svg';
import PurchaseIconActive from 'Images/app_2/settings/ic-purchase-active.svg';

class SettingsDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.state = {
            modal_root: document.getElementById('modal_root'),
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.el.classList.add('settings-dialog');
        this.props.showBlur();
        this.state.modal_root.appendChild(this.el);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.state.modal_root.removeChild(this.el);
        this.props.hideBlur();
    }

    // TODO - Simplify this
    handleClickOutside = (event) => {
        const footer_settings_btn = !(event.target.classList.contains('ic-settings', 'ic-settings ic-settings--active'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open && footer_settings_btn) {
            this.props.toggleDialog();
        }
    };

    render() {
        const settings_dialog_container_class = classNames('settings-dialog__container', {
            'settings-dialog__container--hide': this.props.is_language_dialog_visible,
        });
        return ReactDOM.createPortal(
            <div ref={this.setWrapperRef} className={settings_dialog_container_class}>
                <div className='dialog-header'>
                    <h3 className='dialog-header__sidebar'>{localize('Platform settings')}</h3>
                    <div className='dialog-header__main'>
                        <div className='dialog-header__close' onClick={this.props.toggleDialog}>
                            {this.props.is_dark_mode ? <CloseIcon /> : <LightCloseIcon />}
                        </div>
                    </div>
                </div>
                <VerticalTab
                    alignment='center'
                    classNameHeader='settings-dialog__tab-header'
                    list={this.settings_content()}
                />
            </div>,
            this.el
        );
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    settings_content() {
        return [
            {
                icon: {
                    normal: this.props.is_dark_mode ? ThemeIcon : LightThemeIcon,
                    active: ThemeIconActive,
                },
                label: localize('Themes'),
                value: ThemeSelectSettings,
            }, {
                icon: {
                    normal: this.props.is_dark_mode ? LanguageIcon : LightLanguageIcon,
                    active: LanguageIconActive,
                },
                label: localize('Language'),
                value: LanguageSettings,
            }, {
                icon: {
                    normal: this.props.is_dark_mode ? ChartsIcon : LightChartsIcon,
                    active: ChartsIconActive,
                },
                label: localize('Charts'),
                value: ChartSettings,
            }, {
                icon: {
                    normal: this.props.is_dark_mode ? PurchaseIcon : LightPurchaseIcon,
                    active: PurchaseIconActive,
                },
                label: localize('Purchase Section'),
                value: PurchaseSettings,
            },
        ];
    }
}

SettingsDialog.propTypes = {
    hideBlur                  : PropTypes.func,
    is_dark_mode              : PropTypes.bool,
    is_language_dialog_visible: PropTypes.bool,
    is_open                   : PropTypes.bool,
    showBlur                  : PropTypes.func,
    toggleDialog              : PropTypes.func,
};

export { SettingsDialog };
