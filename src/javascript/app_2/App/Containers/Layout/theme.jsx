import classNames  from 'classnames';
import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from '../../../Stores/connect';

const Theme = ({ children, is_dark_theme }) => {
    const theme_wrapper_class = classNames('theme-wrapper', {
        dark: is_dark_theme,
    });
    return (
        <div id='theme_wrapper' className={theme_wrapper_class}>
            {children}
        </div>
    );
};

Theme.propTypes = {
    is_dark_theme: PropTypes.bool,
    children     : PropTypes.node,
};

export default connect(
    ({ ui }) => ({
        is_dark_theme: ui.is_dark_mode_on,
    })
)(Theme);
