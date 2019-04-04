import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import { connect }    from 'Stores/connect';
import InstallPWA     from './install-pwa.jsx';

const AppContents = ({
    addNotificationBar,
    children,
    is_blurred,
    is_contract_mode,
    is_positions_drawer_on,
    setPWAPromptEvent,
}) => {
    window.addEventListener('beforeinstallprompt', e => {
        console.log('Going to show the installation prompt'); // eslint-disable-line no-console

        e.preventDefault();

        setPWAPromptEvent(e);
        addNotificationBar({
            content : <InstallPWA />,
            autoShow: 10000, // show after 10 secs
            msg_type: 'pwa',
        });
    });

    return (
        <div
            id='app_contents'
            className={classNames('app-contents', {
                'app-contents--show-positions-drawer': is_positions_drawer_on,
                'app-contents--contract-mode'        : is_contract_mode,
                'app-contents--is-blurred'           : is_blurred,
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
    );
};

AppContents.propTypes = {
    addNotificationBar    : PropTypes.func,
    children              : PropTypes.any,
    is_blurred            : PropTypes.bool,
    is_contract_mode      : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    setPWAPromptEvent     : PropTypes.func,
};

export default withRouter(connect(
    ({ modules, ui }) => ({
        is_contract_mode      : modules.smart_chart.is_contract_mode,
        is_blurred            : ui.is_blurred,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        addNotificationBar    : ui.addNotificationBar,
        pwa_prompt_event      : ui.pwa_prompt_event,
        setPWAPromptEvent     : ui.setPWAPromptEvent,
    })
)(AppContents));
