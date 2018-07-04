import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '../../../../_common/localize';

class SettingsControl extends React.PureComponent {
    render() {
        return (
            <div className='settings-row' onClick={this.props.toggle}>
                <span>{localize(this.props.name)}</span>
                {!!this.props.is_toggle && <span className='toggle' />}
            </div>
        );
    }
};

SettingsControl.propTypes = {
    name     : PropTypes.string,
    is_toggle: PropTypes.bool,
    toggle   : PropTypes.func,
};

export default SettingsControl;
