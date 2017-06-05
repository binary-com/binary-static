const LoggedInHandler = require('./logged_in');

const Charity            = require('../static_pages/charity');
const Contact            = require('../static_pages/contact');
const Endpoint           = require('../static_pages/endpoint');
const GetStarted         = require('../static_pages/get_started');
const GetStartedJP       = require('../static_pages/get_started_jp');
const Home               = require('../static_pages/home');
const HomeJP             = require('../static_pages/home_jp');
const JobDetails         = require('../static_pages/job_details');
const Platforms          = require('../static_pages/platforms');
const Regulation         = require('../static_pages/regulation');
const StaticPages        = require('../static_pages/static_pages');
const TermsAndConditions = require('../static_pages/tnc');
const VideoFacility      = require('../static_pages/video_facility');
const WhyUs              = require('../static_pages/why_us');

const AccountTransfer            = require('../websocket_pages/cashier/account_transfer');
const Cashier                    = require('../websocket_pages/cashier/cashier');
const DepositWithdraw            = require('../websocket_pages/cashier/deposit_withdraw');
const PaymentAgentList           = require('../websocket_pages/cashier/payment_agent_list');
const PaymentAgentWithdraw       = require('../websocket_pages/cashier/payment_agent_withdraw');
const MBTradePage                = require('../websocket_pages/mb_trade/mb_tradepage');
const AssetIndexUI               = require('../websocket_pages/resources/asset_index/asset_index.ui');
const TradingTimesUI             = require('../websocket_pages/resources/trading_times/trading_times.ui');
const TradePage_Beta             = require('../websocket_pages/trade/beta/tradepage');
const TradePage                  = require('../websocket_pages/trade/tradepage');
const Authenticate               = require('../websocket_pages/user/account/authenticate');
const ChangePassword             = require('../websocket_pages/user/account/change_password');
const PaymentAgentTransfer       = require('../websocket_pages/user/account/payment_agent_transfer');
const Portfolio                  = require('../websocket_pages/user/account/portfolio/portfolio.init');
const ProfitTable                = require('../websocket_pages/user/account/profit_table/profit_table.init');
const APIToken                   = require('../websocket_pages/user/account/settings/api_token');
const AuthorisedApps             = require('../websocket_pages/user/account/settings/authorised_apps');
const CashierPassword            = require('../websocket_pages/user/account/settings/cashier_password');
const FinancialAssessment        = require('../websocket_pages/user/account/settings/financial_assessment');
const IPHistory                  = require('../websocket_pages/user/account/settings/iphistory');
const Limits                     = require('../websocket_pages/user/account/settings/limits');
const Settings                   = require('../websocket_pages/user/account/settings');
const SelfExclusion              = require('../websocket_pages/user/account/settings/self_exclusion');
const PersonalDetails            = require('../websocket_pages/user/account/settings/personal_details');
const Statement                  = require('../websocket_pages/user/account/statement/statement.init');
const TopUpVirtual               = require('../websocket_pages/user/account/top_up_virtual');
const LostPassword               = require('../websocket_pages/user/lost_password');
const MetaTrader                 = require('../websocket_pages/user/metatrader/metatrader');
const FinancialAccOpening        = require('../websocket_pages/user/new_account/financial_acc_opening');
const JapanAccOpening            = require('../websocket_pages/user/new_account/japan_acc_opening');
const RealAccOpening             = require('../websocket_pages/user/new_account/real_acc_opening');
const VirtualAccOpening          = require('../websocket_pages/user/new_account/virtual_acc_opening');
const ResetPassword              = require('../websocket_pages/user/reset_password');
const TNCApproval                = require('../websocket_pages/user/tnc_approval');

const CashierJP     = require('../../binary_japan/cashier');
const KnowledgeTest = require('../../binary_japan/knowledge_test/knowledge_test');

const pages_config = {
    account_transfer         : { module: AccountTransfer,            is_authenticated: true, only_real: true },
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
    detailsws                : { module: PersonalDetails,            is_authenticated: true },
    endpoint                 : { module: Endpoint },
    epg_forwardws            : { module: DepositWithdraw,            is_authenticated: true, only_real: true },
    forwardws                : { module: DepositWithdraw,            is_authenticated: true, only_real: true },
    home                     : { module: Home,                       not_authenticated: true },
    iphistoryws              : { module: IPHistory,                  is_authenticated: true },
    japanws                  : { module: JapanAccOpening,            is_authenticated: true, only_virtual: true },
    knowledge_testws         : { module: KnowledgeTest,              is_authenticated: true, only_virtual: true },
    limitsws                 : { module: Limits,                     is_authenticated: true, only_real: true },
    logged_inws              : { module: LoggedInHandler },
    lost_passwordws          : { module: LostPassword,               not_authenticated: true },
    maltainvestws            : { module: FinancialAccOpening,        is_authenticated: true },
    market_timesws           : { module: TradingTimesUI },
    metatrader               : { module: MetaTrader,                 is_authenticated: true },
    multi_barriers_trading   : { module: MBTradePage },
    payment_agent_listws     : { module: PaymentAgentList },
    payment_methods          : { module: Cashier.PaymentMethods },
    platforms                : { module: Platforms },
    portfoliows              : { module: Portfolio,                  is_authenticated: true },
    profit_tablews           : { module: ProfitTable,                is_authenticated: true },
    realws                   : { module: RealAccOpening,             is_authenticated: true, only_virtual: true },
    regulation               : { module: Regulation },
    reset_passwordws         : { module: ResetPassword,              not_authenticated: true },
    securityws               : { module: Settings,                   is_authenticated: true },
    self_exclusionws         : { module: SelfExclusion,              is_authenticated: true, only_real: true },
    settingsws               : { module: Settings,                   is_authenticated: true },
    signup                   : { module: StaticPages.AffiliateSignup },
    statementws              : { module: Statement,                  is_authenticated: true },
    tnc_approvalws           : { module: TNCApproval,                is_authenticated: true, only_real: true },
    top_up_virtualws         : { module: TopUpVirtual,               is_authenticated: true, only_virtual: true },
    trading                  : { module: TradePage },
    trading_beta             : { module: TradePage_Beta },
    transferws               : { module: PaymentAgentTransfer,       is_authenticated: true, only_real: true },
    virtualws                : { module: VirtualAccOpening,          not_authenticated: true },
    withdrawws               : { module: PaymentAgentWithdraw,       is_authenticated: true, only_real: true },
    'deposit-jp'             : { module: CashierJP.Deposit,          is_authenticated: true, only_real: true },
    'get-started'            : { module: GetStarted },
    'get-started-jp'         : { module: GetStartedJP },
    'home-jp'                : { module: HomeJP,                     not_authenticated: true },
    'job-details'            : { module: JobDetails },
    'open-positions'         : { module: StaticPages.OpenPositions },
    'open-source-projects'   : { module: StaticPages.OpenSourceProjects },
    'payment-agent'          : { module: StaticPages.PaymentAgent },
    'terms-and-conditions'   : { module: TermsAndConditions },
    'terms-and-conditions-jp': { module: TermsAndConditions },
    'video-facility'         : { module: VideoFacility,              is_authenticated: true, only_real: true },
    'volidx-markets'         : { module: StaticPages.VolidxMarkets },
    'why-us'                 : { module: WhyUs },
    'why-us-jp'              : { module: WhyUs },
    'withdraw-jp'            : { module: CashierJP.Withdraw,         is_authenticated: true, only_real: true },
};

module.exports = pages_config;
