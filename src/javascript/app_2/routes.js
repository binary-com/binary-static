import React               from 'react';
import { Route }  from 'react-router-dom';

import Client              from '../_common/base/client_base';
import { redirectToLogin } from '../_common/base/login';
import { localize }        from '../_common/localize';

import TradeApp             from './pages/trading/trade_app.jsx';
import Statement            from './pages/statement/statement.jsx';
import LostPassword         from './pages/account/lost_password.jsx';


const routes = [
    { path: '/',          component: TradeApp, exact: true },
    { path: '/statement', component: Statement, is_authenticated: true },
    { path: '/account',   component: LostPassword, is_authenticated: false },
];

const RouteWithSubRoutes = route => (
    <Route
        exact={route.exact}
        path={route.path}
        render={props => (
            (route.is_authenticated && !Client.isLoggedIn()) ? // TODO: update styling of the message below
                <a href='javascript:;' onClick={redirectToLogin}>{localize('Please login to view this page.')}</a> :
                <route.component {...props} routes={route.routes} />
        )}
    />
);

export const BinaryRoutes = () => routes.map((route, idx) => (
    <RouteWithSubRoutes key={idx} {...route} />
));
