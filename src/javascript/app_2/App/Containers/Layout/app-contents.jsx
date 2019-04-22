import classNames     from 'classnames';
import PropTypes     from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { connect }    from 'Stores/connect';
import Loading        from '../../../../../templates/app_2/components/loading.jsx';

const AppContents = ({
    children, is_contract_mode,
    is_positions_drawer_on,
    is_app_blurred,
    is_dark_mode,
    is_fully_blurred,
    is_loading,
    loading_status,
}) => (
    <React.Fragment>
        { is_loading && <Loading status={loading_status} theme={is_dark_mode ? 'dark' : 'light'} /> }
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
    children              : PropTypes.any,
    is_dark_mode          : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    loading_status        : PropTypes.string,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        is_positions_drawer_on: ui.is_positions_drawer_on,
        is_contract_mode      : modules.smart_chart.is_contract_mode,
        is_app_blurred        : ui.is_app_blurred,
        is_dark_mode          : ui.is_dark_mode_on,
        is_fully_blurred      : ui.is_fully_blurred,
        is_loading            : ui.is_loading,
        loading_status        : modules.trade.loading_status,
    })
)(AppContents));
