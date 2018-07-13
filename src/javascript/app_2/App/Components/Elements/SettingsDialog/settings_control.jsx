import React        from 'react';
import PropTypes    from 'prop-types';
import ToggleButton from '../toggle_button.jsx';
import { localize } from '../../../../../_common/localize';

const SettingsControl = ({
      children,
      name,
      style,
      to_toggle,
      toggle,
      onClick }) => (
          <div className='settings-row' onClick={toggle || onClick}>
              <span>{localize(name)}</span>
              {toggle ?
                  <ToggleButton
                      bool={to_toggle}
                      style={style}
                  />
                  :
                  children
              }
          </div>
);

SettingsControl.propTypes = {
    style    : PropTypes.string,
    name     : PropTypes.string,
    children : PropTypes.node,
    toggle   : PropTypes.func,
    to_toggle: PropTypes.bool,
    onClick  : PropTypes.func,
};

export default SettingsControl;
