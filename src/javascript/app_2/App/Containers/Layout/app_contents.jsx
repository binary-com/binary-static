import classNames     from 'classnames';
import ProptTypes     from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { connect }    from 'Stores/connect';

const AppContents = ({ children, is_positions_drawer_on }) => (
    <div
        id='app_contents'
        className={classNames('app-contents', {
            'app-contents--show-positions-drawer': is_positions_drawer_on,
        })}
    >
        {children}
    </div>
);

AppContents.propTypes = {
    children              : ProptTypes.any,
    is_positions_drawer_on: ProptTypes.bool,
};

export default withRouter(connect(
    ({ ui }) => ({
        is_positions_drawer_on: ui.is_positions_drawer_on,
    })
)(AppContents));
