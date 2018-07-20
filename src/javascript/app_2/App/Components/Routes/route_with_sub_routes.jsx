import React                   from 'react';
import { 
    Redirect,
    Route }               from 'react-router-dom';
import { redirectToLogin }     from '../../../../_common/base/login';
import Client                  from '../../../../_common/base/client_base';
import { localize }            from '../../../../_common/localize';

const RouteWithSubRoutes = route => {
    let tag = null;

    if (route.component === Redirect) {
        tag = <route.component 
            to={route.to} 
            exact={route.exact}
        />;
    } else {
        tag = <Route
            exact={route.exact}
            path={route.path}
            render={props => (
                (route.is_authenticated && !Client.isLoggedIn()) ? // TODO: update styling of the message below
                    <a href='javascript:;' onClick={redirectToLogin}>{localize('Please login to view this page.')}</a> :
                    <route.component {...props} routes={route.routes}/>
            )}
        />;
    }

    return tag;
};


export default RouteWithSubRoutes;
