import LoggedInHandler from './logged_in';

import Charity from '../static_pages/charity';
import Contact from '../static_pages/contact';
import Endpoint from '../static_pages/endpoint';
import Home from '../static_pages/home';
import GetStarted from '../static_pages/get_started';
import GetStartedJP from '../static_pages/get_started_jp';
import JobDetails from '../static_pages/job_details';
import Platforms from '../static_pages/platforms';
import Regulation from '../static_pages/regulation';
import StaticPages from '../static_pages/static_pages';
import TermsAndConditions from '../static_pages/tnc';
import WhyUs from '../static_pages/why_us';

import AccountTransfer from '../websocket_pages/cashier/account_transfer';
import Cashier from '../websocket_pages/cashier/cashier';
import DepositWithdraw from '../websocket_pages/cashier/deposit_withdraw';
import PaymentAgentList from '../websocket_pages/cashier/payment_agent_list';
import PaymentAgentWithdraw from '../websocket_pages/cashier/payment_agent_withdraw';
import MBTradePage from '../websocket_pages/mb_trade/mb_tradepage';
import AssetIndexUI from '../websocket_pages/resources/asset_index/asset_index.ui';
import TradingTimesUI from '../websocket_pages/resources/trading_times/trading_times.ui';
import TradePage_Beta from '../websocket_pages/trade/beta/tradepage';
import TradePage from '../websocket_pages/trade/tradepage';
import Authenticate from '../websocket_pages/user/account/authenticate';
import ChangePassword from '../websocket_pages/user/account/change_password';
import PaymentAgentTransfer from '../websocket_pages/user/account/payment_agent_transfer';
import Portfolio from '../websocket_pages/user/account/portfolio/portfolio.init';
import ProfitTable from '../websocket_pages/user/account/profit_table/profit_table.init';
import APIToken from '../websocket_pages/user/account/settings/api_token';
import AuthorisedApps from '../websocket_pages/user/account/settings/authorised_apps';
import CashierPassword from '../websocket_pages/user/account/settings/cashier_password';
import FinancialAssessment from '../websocket_pages/user/account/settings/financial_assessment';
import IPHistory from '../websocket_pages/user/account/settings/iphistory';
import Limits from '../websocket_pages/user/account/settings/limits';
import Settings from '../websocket_pages/user/account/settings';
import SelfExclusion from '../websocket_pages/user/account/settings/self_exclusion';
import PersonalDetails from '../websocket_pages/user/account/settings/personal_details';
import Statement from '../websocket_pages/user/account/statement/statement.init';
import TopUpVirtual from '../websocket_pages/user/account/top_up_virtual';
import LostPassword from '../websocket_pages/user/lost_password';
import MetaTrader from '../websocket_pages/user/metatrader/metatrader';
import FinancialAccOpening from '../websocket_pages/user/new_account/financial_acc_opening';
import JapanAccOpening from '../websocket_pages/user/new_account/japan_acc_opening';
import RealAccOpening from '../websocket_pages/user/new_account/real_acc_opening';
import VirtualAccOpening from '../websocket_pages/user/new_account/virtual_acc_opening';
import ResetPassword from '../websocket_pages/user/reset_password';
import TNCApproval from '../websocket_pages/user/tnc_approval';

import CashierJP from '../../binary_japan/cashier';
import KnowledgeTest from '../../binary_japan/knowledge_test/knowledge_test';

const pages_config = {
    account_transfer: {
        module          : AccountTransfer,
        is_authenticated: true,
        only_real       : true,
    },
    api_tokenws : { module: APIToken, is_authenticated: true },
    assessmentws: {
        module          : FinancialAssessment,
        is_authenticated: true,
        only_real       : true,
    },
    asset_indexws: { module: AssetIndexUI },
    authenticate : {
        module          : Authenticate,
        is_authenticated: true,
        only_real       : true,
    },
    authorised_appsws : { module: AuthorisedApps, is_authenticated: true },
    cashier           : { module: Cashier },
    cashier_passwordws: {
        module          : CashierPassword,
        is_authenticated: true,
        only_real       : true,
    },
    change_passwordws: { module: ChangePassword, is_authenticated: true },
    charity          : { module: Charity },
    contact          : { module: Contact },
    detailsws        : { module: PersonalDetails, is_authenticated: true },
    endpoint         : { module: Endpoint },
    epg_forwardws    : {
        module          : DepositWithdraw,
        is_authenticated: true,
        only_real       : true,
    },
    forwardws: {
        module          : DepositWithdraw,
        is_authenticated: true,
        only_real       : true,
    },
    home       : { module: Home, not_authenticated: true },
    iphistoryws: { module: IPHistory, is_authenticated: true },
    japanws    : {
        module          : JapanAccOpening,
        is_authenticated: true,
        only_virtual    : true,
    },
    knowledge_testws: {
        module          : KnowledgeTest,
        is_authenticated: true,
        only_virtual    : true,
    },
    limitsws: {
        module          : Limits,
        is_authenticated: true,
        only_real       : true,
    },
    logged_inws    : { module: LoggedInHandler },
    lost_passwordws: { module: LostPassword, not_authenticated: true },
    maltainvestws  : {
        module          : FinancialAccOpening,
        is_authenticated: true,
    },
    market_timesws        : { module: TradingTimesUI },
    metatrader            : { module: MetaTrader, is_authenticated: true },
    multi_barriers_trading: { module: MBTradePage },
    payment_agent_listws  : { module: PaymentAgentList },
    payment_methods       : { module: Cashier.PaymentMethods },
    platforms             : { module: Platforms },
    portfoliows           : { module: Portfolio, is_authenticated: true },
    profit_tablews        : { module: ProfitTable, is_authenticated: true },
    realws                : {
        module          : RealAccOpening,
        is_authenticated: true,
        only_virtual    : true,
    },
    regulation      : { module: Regulation },
    reset_passwordws: { module: ResetPassword, not_authenticated: true },
    securityws      : { module: Settings, is_authenticated: true },
    self_exclusionws: {
        module          : SelfExclusion,
        is_authenticated: true,
        only_real       : true,
    },
    settingsws    : { module: Settings, is_authenticated: true },
    signup        : { module: StaticPages.AffiliateSignup },
    statementws   : { module: Statement, is_authenticated: true },
    tnc_approvalws: {
        module          : TNCApproval,
        is_authenticated: true,
        only_real       : true,
    },
    top_up_virtualws: {
        module          : TopUpVirtual,
        is_authenticated: true,
        only_virtual    : true,
    },
    trading     : { module: TradePage },
    trading_beta: { module: TradePage_Beta },
    transferws  : {
        module          : PaymentAgentTransfer,
        is_authenticated: true,
        only_real       : true,
    },
    virtualws : { module: VirtualAccOpening, not_authenticated: true },
    withdrawws: {
        module          : PaymentAgentWithdraw,
        is_authenticated: true,
        only_real       : true,
    },
    'deposit-jp': {
        module          : CashierJP.Deposit,
        is_authenticated: true,
        only_real       : true,
    },
    'get-started'            : { module: GetStarted },
    'get-started-jp'         : { module: GetStartedJP },
    'home-jp'                : { module: Home, not_authenticated: true },
    'job-details'            : { module: JobDetails },
    'open-positions'         : { module: StaticPages.OpenPositions },
    'open-source-projects'   : { module: StaticPages.OpenSourceProjects },
    'payment-agent'          : { module: StaticPages.PaymentAgent },
    'terms-and-conditions'   : { module: TermsAndConditions },
    'terms-and-conditions-jp': { module: TermsAndConditions },
    'volidx-markets'         : { module: StaticPages.VolidxMarkets },
    'why-us'                 : { module: WhyUs },
    'why-us-jp'              : { module: WhyUs },
    'withdraw-jp'            : {
        module          : CashierJP.Withdraw,
        is_authenticated: true,
        only_real       : true,
    },
};

module.exports = pages_config;
