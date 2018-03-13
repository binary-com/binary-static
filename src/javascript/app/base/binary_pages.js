// ==================== _common ====================
const TabSelector = require('../../_common/tab_selector');

// ==================== app ====================
const LoggedInHandler      = require('./logged_in');
const Redirect             = require('./redirect');
const CashierJP            = require('../japan/cashier');
const KnowledgeTest        = require('../japan/knowledge_test/knowledge_test');
const AccountTransfer      = require('../pages/cashier/account_transfer');
const Cashier              = require('../pages/cashier/cashier');
const DepositWithdraw      = require('../pages/cashier/deposit_withdraw');
const PaymentAgentList     = require('../pages/cashier/payment_agent_list');
const PaymentAgentWithdraw = require('../pages/cashier/payment_agent_withdraw');
const Endpoint             = require('../pages/endpoint');
const MBTradePage          = require('../pages/mb_trade/mb_tradepage');
const AssetIndexUI         = require('../pages/resources/asset_index/asset_index.ui');
const TradingTimesUI       = require('../pages/resources/trading_times/trading_times.ui');
const TradePage            = require('../pages/trade/tradepage');
const Authenticate         = require('../pages/user/account/authenticate');
const ChangePassword       = require('../pages/user/account/change_password');
const PaymentAgentTransfer = require('../pages/user/account/payment_agent_transfer/payment_agent_transfer');
const Portfolio            = require('../pages/user/account/portfolio/portfolio.init');
const ProfitTable          = require('../pages/user/account/profit_table/profit_table.init');
const Settings             = require('../pages/user/account/settings');
const APIToken             = require('../pages/user/account/settings/api_token');
const AuthorisedApps       = require('../pages/user/account/settings/authorised_apps');
const CashierPassword      = require('../pages/user/account/settings/cashier_password');
const FinancialAssessment  = require('../pages/user/account/settings/financial_assessment');
const IPHistory            = require('../pages/user/account/settings/iphistory/iphistory');
const Limits               = require('../pages/user/account/settings/limits/limits');
const SelfExclusion        = require('../pages/user/account/settings/self_exclusion');
const PersonalDetails      = require('../pages/user/account/settings/personal_details');
const professionalClient   = require('../pages/user/account/settings/professional_client');
const Statement            = require('../pages/user/account/statement/statement.init');
const TopUpVirtual         = require('../pages/user/account/top_up_virtual');
const Accounts             = require('../pages/user/accounts');
const LostPassword         = require('../pages/user/lost_password');
const MetaTrader           = require('../pages/user/metatrader/metatrader');
const FinancialAccOpening  = require('../pages/user/new_account/financial_acc_opening');
const JapanAccOpening      = require('../pages/user/new_account/japan_acc_opening');
const RealAccOpening       = require('../pages/user/new_account/real_acc_opening');
const VirtualAccOpening    = require('../pages/user/new_account/virtual_acc_opening');
const ResetPassword        = require('../pages/user/reset_password');
const SetCurrency          = require('../pages/user/set_currency');
const TelegramBot          = require('../pages/user/telegram_bot');
const TNCApproval          = require('../pages/user/tnc_approval');
const VideoFacility        = require('../pages/user/video_facility');

// ==================== app_2 ====================
const Trading = require('../../app_2/pages/trading/init');

// ==================== static ====================
const GetStartedJP       = require('../../static/japan/get_started');
const HomeJP             = require('../../static/japan/home');
const Charity            = require('../../static/pages/charity');
const Contact            = require('../../static/pages/contact');
const GetStarted         = require('../../static/pages/get_started');
const Home               = require('../../static/pages/home');
const JobDetails         = require('../../static/pages/job_details');
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
    endpoint                 : { module: Endpoint },
    epg_forwardws            : { module: DepositWithdraw,            is_authenticated: true, only_real: true },
    forwardws                : { module: DepositWithdraw,            is_authenticated: true, only_real: true },
    home                     : { module: Home,                       not_authenticated: true },
    iphistoryws              : { module: IPHistory,                  is_authenticated: true },
    japanws                  : { module: JapanAccOpening,            is_authenticated: true, only_virtual: true },
    knowledge_testws         : { module: KnowledgeTest,              is_authenticated: true, only_virtual: true },
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
    platforms                : { module: TabSelector },
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
    signup                   : { module: StaticPages.handleTab },
    statementws              : { module: Statement,                  is_authenticated: true, needs_currency: true },
    tnc_approvalws           : { module: TNCApproval,                is_authenticated: true, only_real: true },
    top_up_virtualws         : { module: TopUpVirtual,               is_authenticated: true, only_virtual: true },
    trading                  : { module: TradePage,                  needs_currency: true },
    transferws               : { module: PaymentAgentTransfer,       is_authenticated: true, only_real: true },
    virtualws                : { module: VirtualAccOpening,          not_authenticated: true },
    withdrawws               : { module: PaymentAgentWithdraw,       is_authenticated: true, only_real: true },
    'binary-options'         : { module: GetStarted.BinaryOptions },
    'careers'                : { module: StaticPages.Careers },
    'cfds'                   : { module: GetStarted.CFDs },
    'contract-specifications': { module: TabSelector },
    'cryptocurrencies'       : { module: GetStarted.Cryptocurrencies },
    'deposit-jp'             : { module: CashierJP.Deposit,          is_authenticated: true, only_real: true },
    'forex'                  : { module: GetStarted.Forex },
    'get-started'            : { module: TabSelector },
    'get-started-jp'         : { module: GetStartedJP },
    'home-jp'                : { module: HomeJP,                     not_authenticated: true },
    'how-to-trade-mt5'       : { module: TabSelector },
    'job-details'            : { module: JobDetails },
    'metals'                 : { module: GetStarted.Metals },
    'open-positions'         : { module: StaticPages.OpenPositions },
    'open-source-projects'   : { module: StaticPages.OpenSourceProjects },
    'payment-agent'          : { module: StaticPages.PaymentAgent },
    'set-currency'           : { module: SetCurrency,                is_authenticated: true, only_real: true, needs_currency: true },
    'terms-and-conditions'   : { module: TermsAndConditions },
    'terms-and-conditions-jp': { module: TermsAndConditions },
    'types-of-accounts'      : { module: StaticPages.TypesOfAccounts },
    'video-facility'         : { module: VideoFacility,              is_authenticated: true, only_real: true },
    'why-us'                 : { module: WhyUs },
    'why-us-jp'              : { module: WhyUs },
    'withdraw-jp'            : { module: CashierJP.Withdraw,         is_authenticated: true, only_real: true },
    'telegram-bot'           : { module: TelegramBot,                is_authenticated: true },
    // ==================== app_2 ====================
    trade                    : { module: Trading,                  needs_currency: true },

};
/* eslint-enable max-len */

module.exports = pages_config;
