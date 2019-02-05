import classNames     from 'classnames';
import ProptTypes     from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { connect }    from 'Stores/connect';

const AppContents = ({ children, is_positions_drawer_on }) => (
    <div
        id='app_contents'
        className={classNames('app-contents', {
            'app-contents--show-positions-drawer': is_positions_drawer_on,
        })}
    >
        {/* Calculate height of user screen and offset height of header and footer */}
        <Scrollbars autoHide style={{ height: 'calc(100vh - 83px)' }}>
            {children}
        </Scrollbars>
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
