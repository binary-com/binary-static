import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';

const ToggleButton = ({ style, bool }) => {
    const toggle_style = style || 'toggle-button';
    const icon_class = classNames(toggle_style, {
        'toggled': bool,
    });
    return (
        <div className={icon_class} />
    );
};

ToggleButton.propTypes = {
    bool : PropTypes.bool,
    style: PropTypes.string,
};

export default ToggleButton;
