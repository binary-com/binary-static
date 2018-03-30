import React from 'react';
import { Route } from 'react-router-dom';

import Client from '../app/base/client';
import { redirectToLogin } from '../app/base/login';

import TradeApp  from './pages/trading/trade_app.jsx';
import Statement from './pages/statement/statement.jsx';


const routes = [
    { path: '/',          component: TradeApp, exact: true },
    { path: '/trade',     component: TradeApp },
    { path: '/statement', component: Statement, is_authenticated: true },
];

const RouteWithSubRoutes = route => (
    (route.is_authenticated && !Client.isLoggedIn()) ?
        <a href='javascript:;' onClick={redirectToLogin}>Please login to view this page.</a>
        :
        <Route
            exact={route.exact}
            path={route.path}
            render={props => (
                <route.component {...props} routes={route.routes} />
            )}
        />
);

const BinaryRoutes = () => routes.map((route, idx) => (
    <RouteWithSubRoutes key={idx} {...route} />
));

export default BinaryRoutes;
