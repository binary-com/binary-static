import React               from 'react';
import {
    Redirect,
    Route }                from 'react-router-dom';
import { default_title }   from '../../Constants/app_config';
import routes              from '../../../Constants/routes';
import { redirectToLogin } from '../../../../_common/base/login';
import Client              from '../../../../_common/base/client_base';
import { localize }        from '../../../../_common/localize';

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
            result = (
                (route.is_authenticated && !Client.isLoggedIn()) ? // TODO: update styling of the message below
                    <div className='login-message-wrapper'>
                        <div className='message'>
                            <a href='javascript:;' onClick={redirectToLogin}>{localize('Please login to view this page.')}</a>
                        </div>
                    </div>
                    :
                    <route.component {...props} routes={route.routes}/>
            );
        }

        const title = route.title ? `${ localize(route.title) } | ` : '';
        document.title = `${ title }${ default_title }`;
        return result;
    };

    return <Route
        exact={route.exact}
        path={route.path}
        render={renderFactory}
    />;
};


export default RouteWithSubRoutes;
