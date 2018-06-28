import AccountPassword        from './sections/account_password.jsx';
import ApiToken               from './sections/api_token.jsx';
import AuthorizedApplications from './sections/authorized_applications.jsx';
import CashierPassword        from './sections/cashier_password.jsx';
import FinancialAssessment    from './sections/financial_assessment.jsx';
import Limits                 from './sections/limits.jsx';
import LoginHistory           from './sections/login_history.jsx';
import PersonalDetails        from './sections/personal_details.jsx';
import SelfExclusion          from './sections/self_exclusion.jsx';

export const data = [
    {
        title: 'Profile',
        items: [
            {
                title    : 'Personal Details',
                content  : 'View your personal information.',
                img_src  : 'images/settings/ic-personal-details.svg',
                Component: PersonalDetails,
            },
            {
                title    : 'Financial Assessment',
                content  : 'View your financial assessment settings',
                img_src  : 'images/settings/ic-financial-assesment.svg',
                Component: FinancialAssessment,
            },
        ],
    },
    {
        title: 'Security & Limits',
        items: [
            {
                title    : 'Account Password',
                content  : 'Change your main login password.',
                img_src  : 'images/settings/ic-account-password.svg',
                Component: AccountPassword,
            },
            {
                title    : 'Cashier Password',
                content  : 'Change the password used for deposits and withdrawals',
                img_src  : 'images/settings/ic-personal-details.svg',
                Component: CashierPassword,
            },
            {
                title    : 'Self Exclusion',
                content  : 'Facility that allows you to set limits on your account.',
                img_src  : 'images/settings/ic-self-exclusion.svg',
                Component: SelfExclusion,
            },
            {
                title    : 'Limits',
                content  : 'View your trading and withdrawal limits',
                img_src  : 'images/settings/ic-limits.svg',
                Component: Limits,
            },
            {
                title    : 'Login History',
                content  : 'View your login history',
                img_src  : 'images/settings/ic-login-history.svg',
                Component: LoginHistory,
            },
            {
                title    : 'API Token',
                content  : 'API token for third party applications',
                img_src  : 'images/settings/ic-api-token.svg',
                Component: ApiToken,
            },
            {
                title    : 'Authorized Applications',
                content  : 'Manage your authorised applications',
                img_src  : 'images/settings/ic-authorised-applications.svg',
                Component: AuthorizedApplications,
            },
        ],
    },
];
