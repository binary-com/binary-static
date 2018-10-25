// ==================== _common ====================
const TabSelector = require('../../_common/tab_selector'); // eslint-disable-line import/order

// ==================== app ====================
const LoggedInHandler         = require('./logged_in');
const Redirect                = require('./redirect');
const AccountTransfer         = require('../pages/cashier/account_transfer');
const Cashier                 = require('../pages/cashier/cashier');
const DepositWithdraw         = require('../pages/cashier/deposit_withdraw');
const PaymentAgentList        = require('../pages/cashier/payment_agent_list');
const PaymentAgentWithdraw    = require('../pages/cashier/payment_agent_withdraw');
const Endpoint                = require('../pages/endpoint');
const MBTradePage             = require('../pages/mb_trade/mb_tradepage');
const EconomicCalendar        = require('../pages/resources/economic_calendar/economic_calendar');
const AssetIndexUI            = require('../pages/resources/asset_index/asset_index.ui');
const MetatraderDownloadUI    = require('../pages/resources/metatrader/download.ui');
const TradingTimesUI          = require('../pages/resources/trading_times/trading_times.ui');
const NewAccount              = require('../pages/new_account');
const TradePage               = require('../pages/trade/tradepage');
const Authenticate            = require('../pages/user/account/authenticate');
const ChangePassword          = require('../pages/user/account/change_password');
const PaymentAgentTransfer    = require('../pages/user/account/payment_agent_transfer/payment_agent_transfer');
const Portfolio               = require('../pages/user/account/portfolio/portfolio.init');
const ProfitTable             = require('../pages/user/account/profit_table/profit_table.init');
const Settings                = require('../pages/user/account/settings');
const APIToken                = require('../pages/user/account/settings/api_token');
const AuthorisedApps          = require('../pages/user/account/settings/authorised_apps');
const CashierPassword         = require('../pages/user/account/settings/cashier_password');
const FinancialAssessment     = require('../pages/user/account/settings/financial_assessment');
const IPHistory               = require('../pages/user/account/settings/iphistory/iphistory');
const Limits                  = require('../pages/user/account/settings/limits/limits');
const SelfExclusion           = require('../pages/user/account/settings/self_exclusion');
const TwoFactorAuthentication = require('../pages/user/account/settings/two_factor_authentication');
const PersonalDetails         = require('../pages/user/account/settings/personal_details');
const professionalClient      = require('../pages/user/account/settings/professional_client');
const Statement               = require('../pages/user/account/statement/statement.init');
const TopUpVirtual            = require('../pages/user/account/top_up_virtual');
const Accounts                = require('../pages/user/accounts');
const LostPassword            = require('../pages/user/lost_password');
const MetaTrader              = require('../pages/user/metatrader/metatrader');
const TypesOfAccounts         = require('../pages/user/metatrader/types_of_accounts');
const FinancialAccOpening     = require('../pages/user/new_account/financial_acc_opening');
const RealAccOpening          = require('../pages/user/new_account/real_acc_opening');
const VirtualAccOpening       = require('../pages/user/new_account/virtual_acc_opening');
const WelcomePage             = require('../pages/user/new_account/welcome_page');
const ResetPassword           = require('../pages/user/reset_password');
const SetCurrency             = require('../pages/user/set_currency');
const TelegramBot             = require('../pages/user/telegram_bot');
const TNCApproval             = require('../pages/user/tnc_approval');
const VideoFacility           = require('../pages/user/video_facility');

// ==================== static ====================
const Charity            = require('../../static/pages/charity');
const Contact            = require('../../static/pages/contact');
const GetStarted         = require('../../static/pages/get_started');
const Home               = require('../../static/pages/home');
const KeepSafe           = require('../../static/pages/keep_safe');
const JobDetails         = require('../../static/pages/job_details');
const Platforms          = require('../../static/pages/platforms');
const Regulation         = require('../../static/pages/regulation');
const StaticPages        = require('../../static/pages/static_pages');
const TermsAndConditions = require('../../static/pages/tnc');
const WhyUs              = require('../../static/pages/why_us');

/* eslint-disable max-len */
const pages_config = {
    account_transfer         : { module: AccountTransfer,            is_authenticated: true, only_real: true, needs_currency: true },
    accounts                 : { module: Accounts,                   is_authenticated: true, needs_currency: true },
    api_tokenws              : { module: APIToken,                   is_authenticated: true },
    assessmentws             : { module: FinancialAssessment,        is_authenticated: true, only_real: true },
    asset_indexws            : { module: AssetIndexUI },
    authenticate             : { module: Authenticate,               is_authenticated: true, only_real: true },
    authorised_appsws        : { module: AuthorisedApps,             is_authenticated: true },
    cashier                  : { module: Cashier },
    cashier_passwordws       : { module: CashierPassword,            is_authenticated: true, only_real: true },
    change_passwordws        : { module: ChangePassword,             is_authenticated: true },
    charity                  : { module: Charity },
    contact                  : { module: Contact },
    detailsws                : { module: PersonalDetails,            is_authenticated: true, needs_currency: true },
    economic_calendar        : { module: EconomicCalendar },
    endpoint                 : { module: Endpoint },
    epg_forwardws            : { module: DepositWithdraw,            is_authenticated: true, only_real: true },
    forwardws                : { module: DepositWithdraw,            is_authenticated: true, only_real: true },
    home                     : { module: Home,                       not_authenticated: true },
    iphistoryws              : { module: IPHistory,                  is_authenticated: true },
    landing_page             : { module: StaticPages.LandingPage,    is_authenticated: true, only_virtual: true },
    limitsws                 : { module: Limits,                     is_authenticated: true, only_real: true, needs_currency: true },
    logged_inws              : { module: LoggedInHandler },
    lost_passwordws          : { module: LostPassword,               not_authenticated: true },
    maltainvestws            : { module: FinancialAccOpening,        is_authenticated: true },
    market_timesws           : { module: TradingTimesUI },
    metatrader               : { module: MetaTrader,                 is_authenticated: true, needs_currency: true },
    multi_barriers_trading   : { module: MBTradePage,                needs_currency: true },
    payment_agent_listws     : { module: PaymentAgentList,           is_authenticated: true },
    payment_methods          : { module: Cashier.PaymentMethods },
    platforms                : { module: Platforms },
    portfoliows              : { module: Portfolio,                  is_authenticated: true, needs_currency: true },
    profit_tablews           : { module: ProfitTable,                is_authenticated: true, needs_currency: true },
    professional             : { module: professionalClient,         is_authenticated: true, only_real: true },
    realws                   : { module: RealAccOpening,             is_authenticated: true },
    redirect                 : { module: Redirect },
    regulation               : { module: Regulation },
    reset_passwordws         : { module: ResetPassword,              not_authenticated: true },
    securityws               : { module: Settings,                   is_authenticated: true },
    self_exclusionws         : { module: SelfExclusion,              is_authenticated: true, only_real: true },
    settingsws               : { module: Settings,                   is_authenticated: true },
    signup                   : { module: TabSelector }, // for /affiliate/signup.html
    statementws              : { module: Statement,                  is_authenticated: true, needs_currency: true },
    tnc_approvalws           : { module: TNCApproval,                is_authenticated: true, only_real: true },
    top_up_virtualws         : { module: TopUpVirtual,               is_authenticated: true, only_virtual: true },
    trading                  : { module: TradePage,                  needs_currency: true },
    transferws               : { module: PaymentAgentTransfer,       is_authenticated: true, only_real: true },
    two_factor_authentication: { module: TwoFactorAuthentication,    is_authenticated: true },
    virtualws                : { module: VirtualAccOpening,          not_authenticated: true },
    welcome                  : { module: WelcomePage,                is_authenticated: true, only_virtual: true },
    withdrawws               : { module: PaymentAgentWithdraw,       is_authenticated: true, only_real: true },
    'binary-options'         : { module: GetStarted.BinaryOptions },
    'binary-options-mt5'     : { module: GetStarted.BinaryOptionsForMT5 },
    'careers'                : { module: StaticPages.Careers },
    'cyberjaya'              : { module: StaticPages.Locations },
    'cfds'                   : { module: GetStarted.CFDs },
    'contract-specifications': { module: TabSelector },
    'cryptocurrencies'       : { module: GetStarted.Cryptocurrencies },
    'download'               : { module: MetatraderDownloadUI },
    'faq'                    : { module: StaticPages.AffiliatesFAQ },
    'forex'                  : { module: GetStarted.Forex },
    'get-started'            : { module: TabSelector },
    'how-to-trade-mt5'       : { module: TabSelector },
    'ib-faq'                 : { module: StaticPages.IBProgrammeFAQ },
    'ib-signup'              : { module: TabSelector },
    'job-details'            : { module: JobDetails },
    'keep-safe'              : { module: KeepSafe },
    'labuan'                 : { module: StaticPages.Locations },
    'malta'                  : { module: StaticPages.Locations },
    'metals'                 : { module: GetStarted.Metals },
    'new-account'            : { module: NewAccount,                     not_authenticated: true },
    'open-positions'         : { module: StaticPages.OpenPositions },
    'open-source-projects'   : { module: StaticPages.OpenSourceProjects },
    'payment-agent'          : { module: StaticPages.PaymentAgent },
    'set-currency'           : { module: SetCurrency,                is_authenticated: true, only_real: true, needs_currency: true },
    'terms-and-conditions'   : { module: TermsAndConditions },
    'types-of-accounts'      : { module: TypesOfAccounts },
    'video-facility'         : { module: VideoFacility,              is_authenticated: true, only_real: true },
    'why-us'                 : { module: WhyUs },
    'telegram-bot'           : { module: TelegramBot,                is_authenticated: true },
};
/* eslint-enable max-len */

module.exports = pages_config;
