import { Redirect }    from 'react-router-dom';
import { localize }    from '_common/localize';
import { routes }      from 'Constants';

import {
    IconPortfolio,
    IconStatement }    from 'Assets/Header/NavBar';
import ContractDetails from 'Modules/Contract';
import Portfolio       from 'Modules/Portfolio';
import Settings        from 'Modules/settings/settings.jsx';
import Statement       from 'Modules/Statement';
import Trade           from 'Modules/Trading';

// Settings Routes
import AccountPassword        from 'Modules/settings/sections/account_password.jsx';
import ApiToken               from 'Modules/settings/sections/api_token.jsx';
import AuthorizedApplications from 'Modules/settings/sections/authorized_applications.jsx';
import CashierPassword        from 'Modules/settings/sections/cashier_password.jsx';
import FinancialAssessment    from 'Modules/settings/sections/financial_assessment.jsx';
import Limits                 from 'Modules/settings/sections/limits.jsx';
import LoginHistory           from 'Modules/settings/sections/login_history.jsx';
import PersonalDetails        from 'Modules/settings/sections/personal_details.jsx';
import SelfExclusion          from 'Modules/settings/sections/self_exclusion.jsx';

// Error routes
import Page404 from 'Modules/Page404';

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
    { path: routes.error404, component: Page404, title: localize('Error 404') },
]);

let routes_config;
const getRoutesConfig = () => {
    if (!routes_config) {
        routes_config = initRoutesConfig();
    }
    return routes_config;
};

export default getRoutesConfig;
