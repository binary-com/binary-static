import React from 'react';
import { Route } from 'react-router-dom';

import TradeApp  from './pages/trading/trade_app.jsx';
import Statement from './pages/statement/statement.jsx';


const routes = [
    { path: '/',          component: TradeApp, exact: true },
    { path: '/trade',     component: TradeApp },
    { path: '/statement', component: Statement },
];

const RouteWithSubRoutes = route => (
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
