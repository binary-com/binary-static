var account_transferws = require('./cashier/account_transferws').account_transferws;
var Cashier = require('./cashier/cashier').Cashier;
var ForwardWS = require('./cashier/deposit_withdraw_ws').ForwardWS;
var PaymentAgentListWS = require('./cashier/payment_agent_listws').PaymentAgentListWS;
var PaymentAgentWithdrawWS = require('./cashier/payment_agent_withdrawws').PaymentAgentWithdrawWS;
var AssetIndexUI = require('./resources/asset_index/asset_indexws.ui').AssetIndexUI;
var MarketTimesUI = require('./resources/market_times/market_timesws.ui').MarketTimesUI;
var AuthenticateWS = require('./user/account/authenticate').AuthenticateWS;
var PasswordWS = require('./user/account/change_password').PasswordWS;
var PaymentAgentTransferSocket = require('./user/account/payment_agent_transfer').PaymentAgentTransferSocket;
var japanese_client = require('../common_functions/country_base').japanese_client;
var PortfolioWS = require('./user/account/portfolio/portfolio.init').PortfolioWS;
var ProfitTableWS = require('./user/account/profit_table/profit_table.init').ProfitTableWS;
var APITokenWS = require('./user/account/settings/api_token').APITokenWS;
var AuthorisedApps = require('./user/account/settings/authorised_apps').AuthorisedApps;
var FinancialAssessmentws = require('./user/account/settings/financial_assessment').FinancialAssessmentws;
var IPHistoryWS = require('./user/account/settings/iphistory').IPHistoryWS;
var Limits = require('./user/account/settings/limits').Limits;
var SelfExclusionWS = require('./user/account/settings/self_exclusion').SelfExclusionWS;
var SettingsDetailsWS = require('./user/account/settings/settings_detailsws').SettingsDetailsWS;
var SecurityWS = require('./user/account/settings/settings_securityws').SecurityWS;

pjax_config_page_require_auth("user/profit_table", function(){
    return {
        onLoad: function() {
            ProfitTableWS.init();
        },
        onUnload: function() {
            ProfitTableWS.clean();
        }
    };
});

pjax_config_page_require_auth("user/statement", function(){
    return {
        onLoad: function() {
            StatementWS.init();
            Statement.attachDatePicker();
        },
        onUnload: function() {
            StatementWS.clean();
        }
    };
});

pjax_config_page("resources/asset_indexws", function() {
    return {
        onLoad: function() {
            AssetIndexUI.init();
        }
    };
});

pjax_config_page("resources/market_timesws", function() {
    return {
        onLoad: function() {
            MarketTimesUI.init();
        }
    };
});

pjax_config_page_require_auth("user/portfoliows", function() {
    return {
        onLoad: function() {
            PortfolioWS.onLoad();
        },
        onUnload: function() {
            PortfolioWS.onUnload();
        },
    };
});

pjax_config_page_require_auth("user/security/api_tokenws", function() {
    return {
        onLoad: function() {
            APITokenWS.init();
        }
    };
});

pjax_config_page_require_auth("user/security/self_exclusionws", function() {
    return {
        onLoad: function() {
            SelfExclusionWS.init();
        }
    };
});

pjax_config_page_require_auth("user/security/cashier_passwordws", function() {
    return {
        onLoad: function() {
            SecurityWS.init();
        }
    };
});

pjax_config_page_require_auth("account/account_transferws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        account_transferws.apiResponse(response);
                    }
                }
            });

            if(TUser.get().hasOwnProperty('is_virtual')) {
                account_transferws.init();
            }
        }
    };
});

pjax_config_page("/cashier", function(){
    return {
        onLoad: function() {
          if (!/\/cashier\.html/.test(window.location.pathname) || !page.client.is_logged_in) {
              return;
          } else {
              Cashier.check_locked();
              Cashier.check_virtual_top_up();
              page.contents.topbar_message_visibility(TUser.get().landing_company);
          }
        }
    };
});

pjax_config_page("/cashier/payment_methods", function(){
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('/');
            }
            if (!page.client.is_logged_in || page.client.is_virtual()) {
                return;
            } else {
                Cashier.check_locked();
            }
        }
    };
});

pjax_config_page_require_auth("cashier/forwardws|cashier/epg_forwardws", function() {
    return {
        onLoad: function() {
          ForwardWS.checkOnLoad();
        }
    };
});

pjax_config_page("payment_agent_listws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "paymentagent_list") {
                            PaymentAgentListWS.responseHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            PaymentAgentListWS.init();
        }
    };
});

pjax_config_page_require_auth("paymentagent/withdrawws", function() {
    return {
        onLoad: function() {
            PaymentAgentWithdrawWS.checkOnLoad();
        }
    };
});

pjax_config_page_require_auth("user/authenticatews", function(){
    return {
        onLoad: function() {
            AuthenticateWS.init();
        }
    };
});

pjax_config_page_require_auth('user/security/change_password', function() {
    return {
        onLoad: function() {
            PasswordWS.initSocket();
        }
    };
});

pjax_config_page_require_auth("paymentagent/transferws", function(){
    return {
        onLoad: function() {
            PaymentAgentTransferSocket.initSocket();
        }
    };
});

pjax_config_page_require_auth("user/security/authorised_appsws", function(){
    return {
        onLoad: function() {
            AuthorisedApps.onLoad();
        },
        onUnload: function(){
            AuthorisedApps.onUnload();
        }
    };
});

pjax_config_page_require_auth("user/settings/assessmentws", function() {
    return {
        onLoad: function() {
            FinancialAssessmentws.onLoad();
        }
    };
});

pjax_config_page_require_auth("user/security/iphistoryws", function(){
    return {
        onLoad: function() {
            IPHistoryWS.onLoad();
        },
        onUnload: function() {
            IPHistoryWS.onUnload();
        }
    };
});

pjax_config_page_require_auth("limitsws", function(){
    return {
        onLoad: function() {
            Limits.onLoad();
        },
        onUnload: function(){
            Limits.onUnload();
        }
    };
});

pjax_config_page_require_auth("settings/detailsws", function() {
    return {
        onLoad: function() {
            SettingsDetailsWS.onLoad();
        }
    };
});
