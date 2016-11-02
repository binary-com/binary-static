var account_transferws = require('./cashier/account_transferws').account_transferws;
var Cashier = require('./cashier/cashier').Cashier;
var ForwardWS = require('./cashier/deposit_withdraw_ws').ForwardWS;
var PaymentAgentListWS = require('./cashier/payment_agent_listws').PaymentAgentListWS;
var PaymentAgentWithdrawWS = require('./cashier/payment_agent_withdrawws').PaymentAgentWithdrawWS;
var AssetIndexUI = require('./resources/asset_index/asset_indexws.ui').AssetIndexUI;
var MarketTimesUI = require('./resources/market_times/market_timesws.ui').MarketTimesUI;

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
