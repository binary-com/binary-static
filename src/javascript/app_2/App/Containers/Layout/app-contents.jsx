import classNames     from 'classnames';
import ProptTypes     from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { connect }    from 'Stores/connect';
import Loading        from '../../../../../templates/app_2/components/loading.jsx';

const AppContents = ({
    children, is_contract_mode,
    is_positions_drawer_on,
    is_app_blurred,
    is_fully_blurred,
    is_loading,
}) => (
    <React.Fragment>
        { is_loading && <Loading /> }
        <div
            id='app_contents'
            className={classNames('app-contents', {
                'app-contents--show-positions-drawer': is_positions_drawer_on,
                'app-contents--contract-mode'        : is_contract_mode,
                'app-contents--is-blurred'           : (is_fully_blurred || is_app_blurred),
            })}
        >
            {/* Calculate height of user screen and offset height of header and footer */}
            <Scrollbars
                autoHide
                style={{ height: 'calc(100vh - 83px)' }}
            >
                {children}
            </Scrollbars>
        </div>
    </React.Fragment>
);

AppContents.propTypes = {
    children              : ProptTypes.any,
    is_positions_drawer_on: ProptTypes.bool,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_contract_mode      : modules.smart_chart.is_contract_mode,
        is_app_blurred        : ui.is_app_blurred,
        is_fully_blurred      : ui.is_fully_blurred,
        is_loading            : ui.is_loading,
    })
)(AppContents));
