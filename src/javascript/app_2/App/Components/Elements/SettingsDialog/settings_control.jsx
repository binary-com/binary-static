import PropTypes    from 'prop-types';
import React        from 'react';
import SwitchButton from '../switch_button.jsx';

const SettingsControl = ({
    children,
    name,
    onClick,
    style,
    to_toggle,
    toggle,
}) => (
    <div className='settings-dialog__row' onClick={toggle || onClick}>
        <span className='settings-dialog__row-name'>{name}</span>
        {toggle ?
            <SwitchButton
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
