import classNames  from 'classnames';
import React       from 'react';
import { withRouter } from 'react-router';
import { connect } from '../../../Stores/connect';

const AppContents = ({ children, is_portfolio_drawer_on }) => (
    <div id='app_contents' className={classNames('app-contents', {
        'app-contents--show-portfolio-drawer': is_portfolio_drawer_on,
    })}>
        {children}
    </div>
);

export default withRouter(connect(
    ({ ui }) => ({
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
    })
)(AppContents));
