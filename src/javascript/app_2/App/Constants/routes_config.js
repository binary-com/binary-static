import { lazy }        from 'react';
import { Redirect }    from 'react-router-dom';
import { localize }    from '_common/localize';
import { routes }      from 'Constants';

import {
    IconPortfolio,
    IconStatement }    from 'Assets/Header/NavBar';
// import Statement       from 'Modules/Statement';
import Trade           from 'Modules/Trading';

// Error routes
import Page404 from 'Modules/Page404';

const ContractDetails = lazy(() => import(/* webpackChunkName: "contract" */  'Modules/Contract'));
const Portfolio       = lazy(() => import(/* webpackChunkName: "portfolio" */ 'Modules/Portfolio'));
const Settings        = lazy(() => import(/* webpackChunkName: "settings" */  'Modules/settings/settings.jsx'));
const Statement       = lazy(() => import(/* webpackChunkName: "statement" */ 'Modules/Statement'));

// Settings Routes
const AccountPassword        = lazy(() => import(/* webpackChunkName: "account_password" */       'Modules/settings/sections/account_password.jsx'));
const ApiToken               = lazy(() => import(/* webpackChunkName: "api_toke" */               'Modules/settings/sections/api_token.jsx'));
const AuthorizedApplications = lazy(() => import(/* webpackChunkName: "authorized_application" */ 'Modules/settings/sections/authorized_applications.jsx'));
const CashierPassword        = lazy(() => import(/* webpackChunkName: "cashier_password" */       'Modules/settings/sections/cashier_password.jsx'));
const FinancialAssessment    = lazy(() => import(/* webpackChunkName: "financial_assessment" */   'Modules/settings/sections/financial_assessment.jsx'));
const Limits                 = lazy(() => import(/* webpackChunkName: "limits" */                 'Modules/settings/sections/limits.jsx'));
const LoginHistory           = lazy(() => import(/* webpackChunkName: "login_history" */          'Modules/settings/sections/login_history.jsx'));
const PersonalDetails        = lazy(() => import(/* webpackChunkName: "personal_details" */       'Modules/settings/sections/personal_details.jsx'));
const SelfExclusion          = lazy(() => import(/* webpackChunkName: "self_exclusion" */         'Modules/settings/sections/self_exclusion.jsx'));

const initRoutesConfig = () => ([
    { path: routes.contract,  component: ContractDetails, title: localize('Contract Details'),  is_authenticated: true },
    { path: routes.index,     component: Redirect,        title: '',                            to: '/trade' },
    { path: routes.portfolio, component: Portfolio,       title: localize('Portfolio'),         is_authenticated: true, icon_component: IconPortfolio },
    { path: routes.root,      component: Redirect,        title: '',                            exact: true, to: '/trade' },
    { path: routes.statement, component: Statement,       title: localize('Statement'),         is_authenticated: true, icon_component: IconStatement },
    { path: routes.trade,     component: Trade,           title: localize('Trade'),             exact: true },
    {
        path            : routes.settings,
        component       : Settings,
        is_authenticated: true,
        routes          : [
            { path: routes.personal,         component: PersonalDetails,        title: localize('Personal Details') },
            { path: routes.financial,        component: FinancialAssessment,    title: localize('Financial Assessment') },
            { path: routes.account_password, component: AccountPassword,        title: localize('Account Password') },
            { path: routes.cashier_password, component: CashierPassword,        title: localize('Cashier Password') },
            { path: routes.exclusion,        component: SelfExclusion,          title: localize('Self Exclusion') },
            { path: routes.limits,           component: Limits,                 title: localize('Account Limits') },
            { path: routes.history,          component: LoginHistory,           title: localize('Login History') },
            { path: routes.token,            component: ApiToken,               title: localize('API Token') },
            { path: routes.apps,             component: AuthorizedApplications, title: localize('Authorized Applications') },
        ],
    },
    // 404 Route: please keep other routes above this line, 404 must be kept at the end of routes_config
    { path: routes.error404, component: Page404, title: localize('Error 404') },
    { component: Page404, title: localize('Error 404') },
]);

let routes_config;
const getRoutesConfig = () => {
    if (!routes_config) {
        routes_config = initRoutesConfig();
    }
    return routes_config;
};

export default getRoutesConfig;
