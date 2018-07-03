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
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.props.is_open) {
            this.props.toggleDialog();
        }
    }

    // componentWillMount() {
    // }
    //
    // componentWillUnmount() {
    // }

    render() {
        const settings_dialog_class = classNames('settings-dialog', {
            'show': this.props.is_open,
        });
        return (
            <div ref={this.setWrapperRef} className={settings_dialog_class}>
                <span onClick={this.handleVisibility}>{localize('something')}</span>
                <Tabs />
            </div>
        );
    }
}

SettingsDialog.propTypes = {
    is_open     : PropTypes.bool,
    toggleDialog: PropTypes.func,
};

export default SettingsDialog;
