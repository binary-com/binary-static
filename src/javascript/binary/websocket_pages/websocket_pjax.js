const AccountTransferWS             = require('./cashier/account_transferws').AccountTransferWS;
const Cashier                       = require('./cashier/cashier').Cashier;
const ForwardWS                     = require('./cashier/deposit_withdraw_ws').ForwardWS;
const PaymentAgentListWS            = require('./cashier/payment_agent_listws').PaymentAgentListWS;
const PaymentAgentWithdrawWS        = require('./cashier/payment_agent_withdrawws').PaymentAgentWithdrawWS;
const AssetIndexUI                  = require('./resources/asset_index/asset_indexws.ui').AssetIndexUI;
const MarketTimesUI                 = require('./resources/market_times/market_timesws.ui').MarketTimesUI;
const AuthenticateWS                = require('./user/account/authenticate');
const PasswordWS                    = require('./user/account/change_password').PasswordWS;
const PaymentAgentTransferSocket    = require('./user/account/payment_agent_transfer').PaymentAgentTransferSocket;
const PortfolioWS                   = require('./user/account/portfolio/portfolio.init').PortfolioWS;
const ProfitTableWS                 = require('./user/account/profit_table/profit_table.init').ProfitTableWS;
const APITokenWS                    = require('./user/account/settings/api_token').APITokenWS;
const AuthorisedApps                = require('./user/account/settings/authorised_apps').AuthorisedApps;
const FinancialAssessment           = require('./user/account/settings/financial_assessment');
const IPHistoryWS                   = require('./user/account/settings/iphistory').IPHistoryWS;
const Limits                        = require('./user/account/settings/limits').Limits;
const SelfExclusionWS               = require('./user/account/settings/self_exclusion').SelfExclusionWS;
const SettingsDetailsWS             = require('./user/account/settings/settings_detailsws').SettingsDetailsWS;
const SecurityWS                    = require('./user/account/settings/settings_securityws').SecurityWS;
const SettingsWS                    = require('./user/account/settings').SettingsWS;
const StatementWS                   = require('./user/account/statement/statement.init').StatementWS;
const TopUpVirtualWS                = require('./user/account/top_up_virtualws').TopUpVirtualWS;
const LostPasswordWS                = require('./user/lost_password').LostPasswordWS;
const MetaTrader                    = require('./user/metatrader/metatrader');
const FinancialAccOpening           = require('./user/new_account/financial_acc_opening').FinancialAccOpening;
const JapanAccOpening               = require('./user/new_account/japan_acc_opening').JapanAccOpening;
const RealAccOpening                = require('./user/new_account/real_acc_opening').RealAccOpening;
const VirtualAccOpening             = require('./user/new_account/virtual_acc_opening').VirtualAccOpening;
const ResetPasswordWS               = require('./user/reset_password').ResetPasswordWS;
const TNCApproval                   = require('./user/tnc_approval');
const TradePage                     = require('./trade/tradepage').TradePage;
const TradePage_Beta                = require('./trade/beta/tradepage').TradePage_Beta;
const MBTradePage                   = require('./mb_trade/mb_tradepage').MBTradePage;
const ViewPopupWS                   = require('./user/view_popup/view_popupws').ViewPopupWS;
const KnowledgeTest                 = require('../../binary_japan/knowledge_test/knowledge_test.init').KnowledgeTest;
const pjax_config_page_require_auth = require('../base/pjax').pjax_config_page_require_auth;
const pjax_config_page              = require('../base/pjax').pjax_config_page;

pjax_config_page('/trading', function () {
    return {
        onLoad  : function() { if (/\/trading\.html/.test(window.location.pathname)) TradePage.onLoad(); },
        onUnload: function() { if (/\/trading\.html/.test(window.location.pathname)) TradePage.onUnload(); },
    };
});

pjax_config_page('/trading_beta', function () {
    return {
        onLoad  : function() { TradePage_Beta.onLoad(); },
        onUnload: function() { TradePage_Beta.onUnload(); },
    };
});

pjax_config_page('/multi_barriers_trading', function () {
    return {
        onLoad  : function() { MBTradePage.onLoad(); },
        onUnload: function() { MBTradePage.onUnload(); },
    };
});

pjax_config_page_require_auth('user/profit_table', function() {
    return {
        onLoad: function() {
            ProfitTableWS.init();
        },
        onUnload: function() {
            ProfitTableWS.clean();
        },
    };
});

pjax_config_page_require_auth('user/statement', function() {
    return {
        onLoad: function() {
            StatementWS.init();
            StatementWS.attachDatePicker();
        },
        onUnload: function() {
            StatementWS.clean();
        },
    };
});

pjax_config_page('resources/asset_indexws', function() {
    return {
        onLoad: function() {
            AssetIndexUI.init();
        },
    };
});

pjax_config_page('resources/market_timesws', function() {
    return {
        onLoad: function() {
            MarketTimesUI.init();
        },
    };
});

pjax_config_page_require_auth('user/portfoliows', function() {
    return {
        onLoad: function() {
            PortfolioWS.onLoad();
        },
        onUnload: function() {
            PortfolioWS.onUnload();
        },
    };
});

pjax_config_page_require_auth('user/security/api_tokenws', function() {
    return {
        onLoad: function() {
            APITokenWS.init();
        },
    };
});

pjax_config_page_require_auth('user/security/self_exclusionws', function() {
    return {
        onLoad: function() {
            SelfExclusionWS.init();
        },
    };
});

pjax_config_page_require_auth('user/security/cashier_passwordws', function() {
    return {
        onLoad: function() {
            SecurityWS.init();
        },
    };
});

pjax_config_page_require_auth('account/account_transferws', function() {
    return {
        onLoad: function() {
            AccountTransferWS.onLoad();
        },
    };
});

pjax_config_page('/cashier', function() {
    return {
        onLoad: function() {
            Cashier.onLoad();
        },
    };
});

pjax_config_page('/cashier/payment_methods', function() {
    return {
        onLoad: function() {
            Cashier.onLoadPaymentMethods();
        },
    };
});

pjax_config_page_require_auth('cashier/forwardws|cashier/epg_forwardws', function() {
    return {
        onLoad: function() {
            ForwardWS.checkOnLoad();
        },
    };
});

pjax_config_page('payment_agent_listws', function() {
    return {
        onLoad: function() {
            PaymentAgentListWS.onLoad();
        },
    };
});

pjax_config_page_require_auth('paymentagent/withdrawws', function() {
    return {
        onLoad: function() {
            PaymentAgentWithdrawWS.checkOnLoad();
        },
    };
});

pjax_config_page_require_auth('user/authenticatews', function() {
    return {
        onLoad: function() {
            AuthenticateWS.init();
        },
    };
});

pjax_config_page_require_auth('user/security/change_password', function() {
    return {
        onLoad: function() {
            PasswordWS.initSocket();
        },
    };
});

pjax_config_page_require_auth('paymentagent/transferws', function() {
    return {
        onLoad: function() {
            PaymentAgentTransferSocket.initSocket();
        },
    };
});

pjax_config_page_require_auth('user/security/authorised_appsws', function() {
    return {
        onLoad: function() {
            AuthorisedApps.onLoad();
        },
        onUnload: function() {
            AuthorisedApps.onUnload();
        },
    };
});

pjax_config_page_require_auth('user/settings/assessmentws', function() {
    return {
        onLoad: function() {
            FinancialAssessment.onLoad();
        },
    };
});

pjax_config_page_require_auth('user/security/iphistoryws', function() {
    return {
        onLoad: function() {
            IPHistoryWS.onLoad();
        },
        onUnload: function() {
            IPHistoryWS.onUnload();
        },
    };
});

pjax_config_page_require_auth('limitsws', function() {
    return {
        onLoad: function() {
            Limits.onLoad();
        },
        onUnload: function() {
            Limits.onUnload();
        },
    };
});

pjax_config_page_require_auth('settings/detailsws', function() {
    return {
        onLoad: function() {
            SettingsDetailsWS.onLoad();
        },
        onUnload: function () {
            SettingsDetailsWS.onUnload();
        },
    };
});

pjax_config_page_require_auth('settingsws|securityws', function() {
    return {
        onLoad: function() {
            SettingsWS.onLoad();
        },
    };
});

pjax_config_page_require_auth('top_up_virtualws', function() {
    return {
        onLoad: function() {
            TopUpVirtualWS.onLoad();
        },
    };
});

pjax_config_page('user/lost_passwordws', function() {
    return {
        onLoad: function() {
            LostPasswordWS.onLoad();
        },
    };
});

pjax_config_page_require_auth('new_account/maltainvestws', function() {
    return {
        onLoad: function() {
            FinancialAccOpening.init();
        },
    };
});

pjax_config_page('new_account/japanws', function() {
    return {
        onLoad: function() {
            JapanAccOpening.init();
        },
    };
});

pjax_config_page('new_account/realws', function() {
    return {
        onLoad: function() {
            RealAccOpening.init();
        },
    };
});

pjax_config_page('new_account/virtualws', function() {
    return {
        onLoad: function() {
            VirtualAccOpening.onLoad();
        },
    };
});

pjax_config_page('user/reset_passwordws', function() {
    return {
        onLoad: function() {
            ResetPasswordWS.init();
        },
    };
});

pjax_config_page_require_auth('tnc_approvalws', function() {
    return {
        onLoad: function() {
            TNCApproval.init();
        },
    };
});

pjax_config_page('profit_tablews|statementws|portfoliows|trading', function() {
    return {
        onLoad: function() {
            $('#profit-table-ws-container, #statement-ws-container, #portfolio-table, #contract_confirmation_container')
                .on('click', '.open_contract_detailsws', function (e) {
                    e.preventDefault();
                    ViewPopupWS.init(this);
                });
        },
    };
});

pjax_config_page_require_auth('new_account/knowledge_testws', function() {
    return {
        onLoad: function() {
            KnowledgeTest.init();
        },
    };
});

pjax_config_page_require_auth('user/metatrader', function() {
    return {
        onLoad: function() {
            MetaTrader.init();
        },
    };
});
