import classNames   from 'classnames';
import React        from 'react';
import PropTypes    from 'prop-types';
import Tabs         from './tabs.jsx';
import { localize } from '../../../_common/localize';

class SettingsDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef      = this.setWrapperRef.bind(this);
    }

    setWrapperRef(node) {
        this.wrapper_ref = node;
    }

    handleClickOutside(event) {
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
        return (
            <div ref={this.setWrapperRef} className={settings_dialog_class}>
                <span className='settings-header'>{localize('Settings')}</span>
                <Tabs alignment='center' list={content} />
            </div>
        );
    }
}

const General = () => (
    <div className='tab-content'>
        <div className='general-setting-container'>
            <SettingsControl name='dark mode' />
            <div className='settings-row'>
                <span>{localize('language')}</span>
            </div>
        </div>
    </div>
);

const Chart = () => (
    <div className='tab-content'>
        <div className='chart-setting-container'>
            <div className='settings-row'>
                <span>{localize('position')}</span>
            </div>
            <SettingsControl name='asset information' />
            <SettingsControl name='scale countdown' />
        </div>
    </div>
);

const SettingsControl = ({ name, is_toggle, onClick }) => (
    <div className='settings-row' onClick={onClick}>
        <span>{localize(name)}</span>
        {!!is_toggle && <span className='toggle' />}
    </div>
);

const content = {
    1: { header: localize('General'), content: General},
    2: { header: localize('Chart'), content: Chart},
};

SettingsControl.propTypes = {
    name     : PropTypes.string,
    is_toggle: PropTypes.bool,
    onClick  : PropTypes.func,
};

SettingsDialog.propTypes = {
    is_open     : PropTypes.bool,
    toggleDialog: PropTypes.func,
};

export default SettingsDialog;
