import classNames      from 'classnames';
import React           from 'react';
import PropTypes       from 'prop-types';
import { Tabs }        from '../Tabs/tabs.jsx';
import ChartSettings   from '../../../Containers/SettingsDialog/settings_chart.jsx';
import GeneralSettings from '../../../Containers/SettingsDialog/settings_general.jsx';
import LanguageDialog  from '../../../Containers/SettingsDialog/settings_language.jsx';
import { localize }    from '../../../../../_common/localize';

class SettingsDialog extends React.PureComponent {

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    }

    // TO-DO - Simplify this
    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open && !(event.target.className === 'ic-settings')) {
            this.props.toggleDialog();
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
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
                    <Tabs alignment='center' list={SettingsContent} />
                </div>
                <LanguageDialog />
            </div>
        );
    }
}

const SettingsContent = {
    1: { header: localize('General'), content: GeneralSettings },
    2: { header: localize('Chart'), content: ChartSettings },
};

SettingsDialog.propTypes = {
    is_language_dialog_visible: PropTypes.bool,
    is_open                   : PropTypes.bool,
    toggleDialog              : PropTypes.func,
};

export default SettingsDialog;
