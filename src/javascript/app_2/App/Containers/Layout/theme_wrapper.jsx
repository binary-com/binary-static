import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { connect }    from 'Stores/connect';

const ThemeWrapper = ({ children, is_dark_theme }) => {
    const theme_wrapper_class = classNames('theme-wrapper', {
        dark : is_dark_theme,
        light: !is_dark_theme,
    });
    return (
        <div id='theme_wrapper' className={theme_wrapper_class}>
            {children}
        </div>
    );
};

ThemeWrapper.propTypes = {
    children     : PropTypes.node,
    is_dark_theme: PropTypes.bool,
};

export default withRouter(connect(
    ({ ui }) => ({
        is_dark_theme: ui.is_dark_mode_on,
    }),
)(ThemeWrapper));
