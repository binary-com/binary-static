import { Redirect }           from 'react-router-dom';
import { routes }             from '../../Constants';
import Portfolio              from '../../Modules/Portfolio';
import TradeApp               from '../../Modules/Trading';
import Settings               from '../../Modules/settings/settings.jsx';
import Statement              from '../../Modules/Statement';

// Settings Routes
import AccountPassword        from '../../Modules/settings/sections/account_password.jsx';
import ApiToken               from '../../Modules/settings/sections/api_token.jsx';
import AuthorizedApplications from '../../Modules/settings/sections/authorized_applications.jsx';
import CashierPassword        from '../../Modules/settings/sections/cashier_password.jsx';
import FinancialAssessment    from '../../Modules/settings/sections/financial_assessment.jsx';
import Limits                 from '../../Modules/settings/sections/limits.jsx';
import LoginHistory           from '../../Modules/settings/sections/login_history.jsx';
import PersonalDetails        from '../../Modules/settings/sections/personal_details.jsx';
import SelfExclusion          from '../../Modules/settings/sections/self_exclusion.jsx';

const routes_config = [
    { path: routes.root,      component: Redirect,  exact: true, to: '/trade' },
    { path: routes.index,     component: Redirect,  to: '/trade' },
    { path: routes.trade,     component: TradeApp,  exact: true },
    { path: routes.portfolio, component: Portfolio, is_authenticated: true },
    { path: routes.statement, component: Statement, is_authenticated: true },
    {
        path            : routes.settings,
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

export default routes_config;
