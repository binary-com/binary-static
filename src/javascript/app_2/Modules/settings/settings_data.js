import AccountPassword        from './sections/account_password.jsx';
import ApiToken               from './sections/api_token.jsx';
import AuthorizedApplications from './sections/authorized_applications.jsx';
import CashierPassword        from './sections/cashier_password.jsx';
import FinancialAssessment    from './sections/financial_assessment.jsx';
import Limits                 from './sections/limits.jsx';
import LoginHistory           from './sections/login_history.jsx';
import PersonalDetails        from './sections/personal_details.jsx';
import SelfExclusion          from './sections/self_exclusion.jsx';
import { localize }           from '../../../_common/localize';

const data = [
    {
        title: localize('Profile'),
        items: [
            {
                title      : localize('Personal Details'),
                description: localize('View your personal information.'),
                img_src    : 'images/app_2/settings/ic-personal-details.svg',
                Component  : PersonalDetails,
            },
            {
                title      : localize('Financial Assessment'),
                description: localize('View your financial assessment settings'),
                img_src    : 'images/app_2/settings/ic-financial-assesment.svg',
                Component  : FinancialAssessment,
            },
        ],
    },
    {
        title: localize('Security & Limits'),
        items: [
            {
                title      : localize('Account Password'),
                description: localize('Change your main login password.'),
                img_src    : 'images/app_2/settings/ic-account-password.svg',
                Component  : AccountPassword,
            },
            {
                title      : localize('Cashier Password'),
                description: localize('Change the password used for deposits and withdrawals'),
                img_src    : 'images/app_2/settings/ic-cashier-password.svg',
                Component  : CashierPassword,
            },
            {
                title      : localize('Self Exclusion'),
                description: localize('Facility that allows you to set limits on your account.'),
                img_src    : 'images/app_2/settings/ic-self-exclusion.svg',
                Component  : SelfExclusion,
            },
            {
                title      : localize('Limits'),
                description: localize('View your trading and withdrawal limits'),
                img_src    : 'images/app_2/settings/ic-limits.svg',
                Component  : Limits,
            },
            {
                title      : localize('Login History'),
                description: localize('View your login history'),
                img_src    : 'images/app_2/settings/ic-login-history.svg',
                Component  : LoginHistory,
            },
            {
                title      : localize('API Token'),
                description: localize('API token for third party applications'),
                img_src    : 'images/app_2/settings/ic-api-token.svg',
                Component  : ApiToken,
            },
            {
                title      : localize('Authorized Applications'),
                description: localize('Manage your authorised applications'),
                img_src    : 'images/app_2/settings/ic-authorised-applications.svg',
                Component  : AuthorizedApplications,
            },
        ],
    },
];

export default data;
