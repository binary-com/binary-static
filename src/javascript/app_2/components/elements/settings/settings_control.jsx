import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '../../../../_common/localize';
import ToggleButton from '../toggle_button.jsx';

class SettingsControl extends React.Component {
    render() {
        return (
            <div className='settings-row' onClick={this.props.toggle || this.props.onClick}>
                <span>{localize(this.props.name)}</span>
                {this.props.toggle ?
                    <ToggleButton bool={this.props.to_toggle} />
                    :
                    this.props.children
                }
            </div>
        );
    }
};

SettingsControl.propTypes = {
    name     : PropTypes.string,
    children : PropTypes.node,
    toggle   : PropTypes.func,
    to_toggle: PropTypes.bool,
    onClick  : PropTypes.func,
};

export default SettingsControl;
