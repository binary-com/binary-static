import React               from 'react';
import {
    Redirect,
    Route }                from 'react-router-dom';
import PleaseLoginMessage  from '../Elements/please_login_message.jsx';
import routes              from '../../../Constants/routes';
import { redirectToLogin } from '../../../../_common/base/login';
import Client              from '../../../../_common/base/client_base';

const RouteWithSubRoutes = route => {
    const renderFactory = props => {
        let result = null;
        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const {location} = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else {
            const should_show_login_msg = route.is_authenticated && !Client.isLoggedIn();

            result = (
                should_show_login_msg && route.keep_component &&
                    <route.component {...props} routes={route.routes}>
                        <PleaseLoginMessage onLogin={redirectToLogin} />
                    </route.component>
                ||
                should_show_login_msg && <PleaseLoginMessage onLogin={redirectToLogin} />
                ||
                <route.component {...props} routes={route.routes} />
            );
        }

        return result;
    };

    return <Route
        exact={route.exact}
        path={route.path}
        render={renderFactory}
    />;
};


export default RouteWithSubRoutes;
