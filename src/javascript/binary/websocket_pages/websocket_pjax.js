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
var TNCApproval       = require('websocket_pages/user/tnc_approval');
var ViewPopupWS       = require('websocket_pages/user/view_popup/view_popupws');

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

pjax_config_page("profit_tablews|statementws|portfoliows|trading", function() {
    return {
        onLoad: function() {
            $('#profit-table-ws-container, #statement-ws-container, #portfolio-table, #contract_confirmation_container')
                .on('click', '.open_contract_detailsws', function (e) {
                    e.preventDefault();
                    ViewPopupWS.init(this);
                });
        }
    };
});

pjax_config_page_require_auth("tnc_approvalws", function() {
    return {
        onLoad: function() {
            TNCApproval.init();
        }
    };
});
