import React               from 'react';
import { Route, NavLink }  from 'react-router-dom';

import Client              from '../_common/base/client_base';
import { redirectToLogin } from '../_common/base/login';
import { localize }        from '../_common/localize';

import TradeApp  from './pages/trading/trade_app.jsx';
import Statement from './pages/statement/statement.jsx';


const routes = [
    { path: '/',          component: TradeApp, exact: true },
    { path: '/statement', component: Statement, is_authenticated: true },
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

export const BinaryLink = ({ to, children, ...props }) => {
    const path = /^\//.test(to) ? to : `/${to || ''}`; // Default to '/'
    const route = routes.find(r => r.path === path);
    if (to && route) {
        return (
            <NavLink to={path} activeClassName='active' exact={route.exact} {...props}>
                {children}
            </NavLink>
        );
    } else if (!to) {
        return (
            <a href='javascript:;' {...props}>
                {children}
            </a>
        );
    }
    // else
    throw new Error(`Route not found: ${to}`);
};
