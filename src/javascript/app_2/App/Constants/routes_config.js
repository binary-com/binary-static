import { Redirect }           from 'react-router-dom';
import { routes }             from '../../Constants';
import Portfolio              from '../../Modules/Portfolio';
import Settings               from '../../Modules/settings/settings.jsx';
import Statement              from '../../Modules/Statement';
import TradeApp               from '../../Modules/Trading';

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
            { path: routes.personal,         component: PersonalDetails },
            { path: routes.financial,        component: FinancialAssessment },
            { path: routes.account_password, component: AccountPassword },
            { path: routes.cashier_password, component: CashierPassword },
            { path: routes.exclusion,        component: SelfExclusion },
            { path: routes.limits,           component: Limits },
            { path: routes.history,          component: LoginHistory },
            { path: routes.token,            component: ApiToken },
            { path: routes.apps,             component: AuthorizedApplications },
        ],
    },
];

export default routes_config;
