import React                   from 'react';
import { Route }               from 'react-router-dom';
import { redirectToLogin }     from '../../../../_common/base/login';
import Client                  from '../../../../_common/base/client_base';
import { localize }            from '../../../../_common/localize';

const RouteWithSubRoutes = route => (
    <Route
        exact={route.exact}
        path={route.path}
        render={props => (
            (route.is_authenticated && !Client.isLoggedIn()) ? // TODO: update styling of the message below
                <a href='javascript:;' onClick={redirectToLogin}>{localize('Please login to view this page.')}</a> :
                <route.component {...props} routes={route.routes} to={route.to} />
        )}
    />
);


export default RouteWithSubRoutes;
