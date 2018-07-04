import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '../../../../_common/localize';

const SettingsControl = ({ onClick, name, is_toggle }) => (
    <div className='settings-row' onClick={onClick}>
        <span>{localize(name)}</span>
        {!!is_toggle && <span className='toggle' />}
    </div>
);

SettingsControl.propTypes = {
    name     : PropTypes.string,
    is_toggle: PropTypes.bool,
    onClick  : PropTypes.func,
};

export default SettingsControl;
