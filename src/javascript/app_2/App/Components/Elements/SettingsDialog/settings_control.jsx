import PropTypes    from 'prop-types';
import React        from 'react';
import ToggleButton from '../toggle_button.jsx';
import { localize } from '../../../../../_common/localize';

const SettingsControl = ({
    children,
    name,
    onClick,
    style,
    to_toggle,
    toggle,
}) => (
    <div className='settings-row' onClick={toggle || onClick}>
        <span>{localize(name)}</span>
        {toggle ?
            <ToggleButton
                toggled={to_toggle}
                style={style}
            />
            :
            children
        }
    </div>
);

SettingsControl.propTypes = {
    children : PropTypes.node,
    name     : PropTypes.string,
    onClick  : PropTypes.func,
    style    : PropTypes.string,
    to_toggle: PropTypes.bool,
    toggle   : PropTypes.func,
};

export default SettingsControl;
