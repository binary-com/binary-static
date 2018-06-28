import React               from 'react';
import { Route, NavLink }  from 'react-router-dom';
import PropTypes           from 'prop-types';

import Client              from '../_common/base/client_base';
import { redirectToLogin } from '../_common/base/login';
import { localize }        from '../_common/localize';

import Portfolio           from './pages/portfolio/portfolio.jsx';
import TradeApp            from './pages/trading/trade_app.jsx';
import Settings            from './pages/settings/settings.jsx';
import Statement           from './pages/statement/statement.jsx';

// Settings Routes
import AccountPassword        from './pages/settings/sections/account_password.jsx';
import ApiToken               from './pages/settings/sections/api_token.jsx';
import AuthorizedApplications from './pages/settings/sections/authorized_applications.jsx';
import CashierPassword        from './pages/settings/sections/cashier_password.jsx';
import FinancialAssessment    from './pages/settings/sections/financial_assessment.jsx';
import Limits                 from './pages/settings/sections/limits.jsx';
import LoginHistory           from './pages/settings/sections/login_history.jsx';
import PersonalDetails        from './pages/settings/sections/personal_details.jsx';
import SelfExclusion          from './pages/settings/sections/self_exclusion.jsx';

const routes = [
    { path: '/',          component: TradeApp, exact: true },
    { path: '/portfolio', component: Portfolio, is_authenticated: true },
    { path: '/statement', component: Statement, is_authenticated: true },
    {
        path            : '/settings',
        component       : Settings,
        is_authenticated: true,
        routes          : [
            { path: 'personal',         component: PersonalDetails },
            { path: 'financial',        component: FinancialAssessment },
            { path: 'account_password', component: AccountPassword },
            { path: 'cashier_password', component: CashierPassword },
            { path: 'exclusion',        component: SelfExclusion },
            { path: 'limits',           component: Limits },
            { path: 'history',          component: LoginHistory },
            { path: 'token',            component: ApiToken },
            { path: 'apps',             component: AuthorizedApplications },
        ],
    },
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

const normalizePath = (path) => /^\//.test(path) ? path : `/${path || ''}`; // Default to '/'

const getRouteInfo = (path) => routes.find(r => r.path === normalizePath(path));

export const isRouteVisible = (path, route = getRouteInfo(path)) =>
    !(route && route.is_authenticated && !Client.isLoggedIn());

export const BinaryLink = ({ to, children, ...props }) => {
    const path  = normalizePath(to);
    const route = getRouteInfo(path);

    if (!route) {
        throw new Error(`Route not found: ${to}`);
    }

    return (
        to ?
            <NavLink to={path} activeClassName='active' exact={route.exact} {...props}>
                {children}
            </NavLink>
        :
            <a href='javascript:;' {...props}>
                {children}
            </a>
    );
};

BinaryLink.propTypes = {
    children: PropTypes.object,
    to      : PropTypes.string,
};
