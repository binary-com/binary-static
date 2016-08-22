var AssetIndexUI       = require('websocket_pages/resources/asset_index/asset_indexws.ui');
var MarketTimesUI      = require('websocket_pages/resources/market_times/market_timesws.ui');
var PortfolioWS        = require('account/portfolio/portfolio.init');
var ProfitTableWS      = require('account/profit_table/profit_table.init');
var StatementWS        = require('account/statement/statement.init');
var TopUpVirtualWS     = require('account/top_up_virtualws');
var SettingsWS         = require('account/settings');
var MyAccountWS        = require('websocket_pages/user/my_accountws');
var SettingsDetailsWS  = require('account/settings/settings_detailsws');
var SecurityWS         = require('account/settings/settings_securityws');
var SecurityWS         = require('account/settings/self_exclusion');
var MetaTraderUI       = require('account/settings/metatrader/metatrader.ui');
var LostPassword       = require('websocket_pages/user/lost_password');
var APITokenWS         = require('websocket_pages/user/account/settings/api_token');
var account_trasferws  = require('websocket_pages/cashier/account_transferws');
var Cashier            = require('websocket_pages/cashier/cashier');
var ForwardWS          = require('websocket_pages/cashier/deposit_withdraw_ws');
var PaymentAgentListWS = require('websocket_pages/cashier/payment_agent_listws');
var PaymentAgentWithdrawWS = require('websocket_pages/cashier/payment_agent_withdrawws');

pjax_config_page_require_auth("paymentagent/withdrawws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        var type = response.msg_type;
                        switch(type){
                            case "authorize":
                                PaymentAgentWithdrawWS.init();
                                break;
                            case "paymentagent_list":
                                PaymentAgentWithdrawWS.populateAgentsList(response);
                                break;
                            case "paymentagent_withdraw":
                                PaymentAgentWithdrawWS.withdrawResponse(response);
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            if(TUser.get().hasOwnProperty('is_virtual') || sessionStorage.getItem('withdrawal_locked') === 'locked') {
                PaymentAgentWithdrawWS.init();
            } else if (!sessionStorage.getItem('withdrawal_locked')) {
              BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"PaymentAgentWithdrawWS"}});
            }
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
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            PaymentAgentListWS.init();
        }
    };
});

pjax_config_page_require_auth("cashier/forwardws", function() {
    return {
        onLoad: function() {
          function check_virtual() {
            if (page.client.is_virtual()) {
              ForwardWS.showError(text.localize('This feature is not relevant to virtual-money accounts.'));
            }
            return page.client.is_virtual();
          }
          if (!check_virtual()) {
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response && !check_virtual()) {
                  var type = response.msg_type;
                  var error = response.error;
                  if (type === 'cashier_password' && !error){
                    ForwardWS.init();
                    if (response.cashier_password === 1) {
                      ForwardWS.showMessage('cashier-locked-message');
                    } else {
                      var cashier_type = ForwardWS.getCashierType();
                      if (cashier_type === 'withdraw') {
                        BinarySocket.send({'verify_email': TUser.get().email, 'type': 'payment_withdraw'});
                        ForwardWS.showMessage('check-email-message');
                        $('#withdraw-form').show();
                      } else if (cashier_type === 'deposit') {
                        if (TUser.get().currency !== "") {
                          ForwardWS.getCashierURL();
                        } else {
                          ForwardWS.showMessage('choose-currency-message');
                          $('#currency-form').show();
                        }
                      }
                    }
                  } else if (type === 'cashier_password' && error) {
                    ForwardWS.showError(error.message);
                  } else if (type === 'cashier' && !error) {
                    ForwardWS.hideAll();
                    $('#deposit-withdraw-message').hide();
                    $('#deposit-withdraw-iframe-container iframe').attr('src', response.cashier);
                    $('#deposit-withdraw-iframe-container').show();
                  } else if (type === 'cashier' && error) {
                    ForwardWS.hideAll();
                    $('#deposit-withdraw-message').hide();
                    if (error.code && error.code === 'ASK_TNC_APPROVAL') {
                      window.location.href = page.url.url_for('user/tnc_approvalws');
                    } else if (error.code && error.code === 'ASK_FIX_DETAILS') {
                      var msgID = 'personal-details-message',
                          errorFields;
                      if(error.details) {
                        errorFields = {
                          province: 'State/Province',
                          country:  'Country',
                          city:     'Town/City',
                          street:   'First line of home address',
                          pcode:    'Postal Code / ZIP',
                          phone:    'Telephone',
                          email:    'Email address'
                        };
                      }
                      var errMsg = template($('#' + msgID).html(), [text.localize(error.details ? errorFields[error.details] : 'details')]);
                      $('#' + msgID).html(errMsg);
                      ForwardWS.showMessage(msgID);
                    } else if (error.code && error.code === 'ASK_UK_FUNDS_PROTECTION') {
                      $('#ukgc-funds-protection').show();
                    } else if (error.code && error.code === 'ASK_AUTHENTICATE') {
                      ForwardWS.showMessage('not-authenticated-message');
                    } else {
                        ForwardWS.showError(error.message);
                    }
                  } else if (type === 'set_account_currency' && !error) {
                    ForwardWS.getCashierURL();
                  } else if (type === 'set_account_currency' && error) {
                    ForwardWS.showError(error.message);
                  } else if (type === 'tnc_approval' && !error) {
                    ForwardWS.getCashierURL();
                  } else if (type === 'tnc_approval' && error) {
                    ForwardWS.showError(error.message);
                  }
                }
              }
            });
            if (sessionStorage.getItem('withdrawal_locked') === 'locked' && /withdraw/.test(window.location.hash)) {
              ForwardWS.lock_withdrawal('locked');
            } else if (!sessionStorage.getItem('withdrawal_locked') && /withdraw/.test(window.location.hash)) {
              BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"ForwardWS"}});
            } else {
              BinarySocket.send({"cashier_password": "1"});
            }
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
