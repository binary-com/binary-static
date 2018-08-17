import classNames  from 'classnames';
import PropTypes   from 'prop-types';
import React       from 'react';
import { withRouter } from 'react-router';
import { connect } from '../../../Stores/connect';

const AppContents = ({ children, is_app_ready, is_portfolio_drawer_on }) => (
    <div
        id='app_contents'
        className={classNames('app-contents', {
            'app-contents--show-portfolio-drawer': is_portfolio_drawer_on,
            'fade-in'                            : is_app_ready,
        })}
    >
        {children}
    </div>
);

AppContents.propTypes = {
    children              : PropTypes.any,
    is_app_ready          : PropTypes.bool,
    is_portfolio_drawer_on: PropTypes.bool,
};

export default withRouter(connect(
    ({ ui }) => ({
        is_app_ready          : ui.is_app_ready,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
    })
)(AppContents));
