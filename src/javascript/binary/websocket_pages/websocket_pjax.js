var AssetIndexUI      = require('websocket_pages/resources/asset_index/asset_indexws.ui');
var MarketTimesUI     = require('websocket_pages/resources/market_times/market_timesws.ui');
var PortfolioWS       = require('account/portfolio/portfolio.init');
var ProfitTableWS     = require('account/profit_table/profit_table.init');
var StatementWS       = require('account/statement/statement.init');
var TopUpVirtualWS    = require('account/top_up_virtualws');
var SettingsWS        = require('account/settings');
var MyAccountWS       = require('websocket_pages/user/my_accountws');
var SettingsDetailsWS = require('account/settings/settings_detailsws');
var SecurityWS        = require('account/settings/settings_securityws');
var SecurityWS        = require('account/settings/self_exclusion');
var MetaTraderUI      = require('account/settings/metatrader/metatrader.ui');
var LostPassword      = require('websocket_pages/user/lost_password');
var APITokenWS        = require('websocket_pages/user/account/settings/api_token');
var account_trasferws = require('websocket_pages/cashier/account_transferws');
var Cashier           = require('websocket_pages/cashier/cashier');

pjax_config_page("/cashier", function(){
    return {
        onLoad: function() {
          if (!/\/cashier\.html/.test(window.location.pathname) || !page.client.is_logged_in) {
            return;
          } else {
            Cashier.check_withdrawal_locked();
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
                Cashier.check_withdrawal_locked();
            }
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

pjax_config_page_require_auth("user/settings/api_tokenws", function() {
    return {
        onLoad: function() {
            APITokenWS.init();
        }
    };
});

pjax_config_page_require_auth("user/settings/self_exclusionws", function() {
    return {
        onLoad: function() {
            SelfExclusionWS.init();
        }
    };
});

pjax_config_page_require_auth("user/settings/metatrader", function() {
    return {
        onLoad: function() {
            MetaTraderUI.init();
        }
    };
});

pjax_config_page_require_auth("user/settings/securityws", function() {
    return {
        onLoad: function() {
            SecurityWS.init();
        }
    };
});

pjax_config_page_require_auth("top_up_virtualws", function() {
    return {
        onLoad: function() {
            TopUpVirtualWS.init();
        }
    };
});

pjax_config_page_require_auth("settingsws", function() {
    return {
        onLoad: function() {
            SettingsWS.init();
        }
    };
});

pjax_config_page_require_auth("user/my_accountws", function() {
    return {
        onLoad: function() {
            MyAccountWS.init();
        }
    };
});

pjax_config_page_require_auth("settings/detailsws", function() {
    return {
        onLoad: function() {
            SettingsDetailsWS.init();
        }
    };
});

pjax_config_page('user/lost_passwordws', function() {
    return {
        onLoad: function() {
            LostPassword.init();
        }
    };
});
