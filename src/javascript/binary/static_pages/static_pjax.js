var Login = require('../base/login').Login;
var Endpoint = require('./endpoint').Endpoint;
var GetStartedJP = require('./get_started_jp').GetStartedJP;
var JobDetails = require('./job_details').JobDetails;
var Platforms = require('./platforms').Platforms;
var Regulation = require('./regulation').Regulation;
var submit_email = require('../websocket_pages/user/verify_email').submit_email;
var MBTradePage = require('../websocket_pages/mb_trade/mb_tradepage').MBTradePage;

pjax_config_page('/home', function() {
    return {
        onLoad: function() {
            if(!page.client.redirect_if_login()) {
                check_login_hide_signup();
                submit_email();
            }
        }
    };
});

pjax_config_page('/why-us', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.why-us'));
            hide_if_logged_in();
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/volidx-markets', function() {
    return {
        onLoad: function() {
            if (page.url.location.hash !== "") {
              $('a[href="' + page.url.location.hash + '"]').click();
            }
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/open-source-projects', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.open-source-projects'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/payment-agent', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.payment-agent'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/get-started', function() {
    return {
        onLoad: function() {
            if (!/get-started-jp/.test(window.location.pathname)) {
                get_started_behaviour();
            }
        },
        onUnload: function() {
            $(window).off('scroll');
        },
    };
});

pjax_config_page('/contact', function() {
    return {
        onLoad: function() {
            $('#faq_url').attr('href', 'https://binary.desk.com/customer/' + page.language() + "/portal/articles");
            display_cs_contacts();
            show_live_chat_icon();
        },
    };
});

pjax_config_page('/careers', function() {
    return {
        onLoad: function() {
            display_career_email();
        },
    };
});


pjax_config_page('/charity', function() {
    return {
        onLoad: CharityPage.onLoad,
        onUnload: CharityPage.onUnload
    };
});

pjax_config_page('/terms-and-conditions', function() {
    return {
        onLoad: function() {
            var selected_tab = page.url.params_hash().selected_tab;
            if(selected_tab) {
              $('li#' + selected_tab + ' a').click();
            }
            var year = document.getElementsByClassName('currentYear');
            for (i = 0; i < year.length; i++){
              year[i].innerHTML = new Date().getFullYear();
            }
        },
    };
});

pjax_config_page('\/login|\/loginid_switch', function() {
    return {
        onLoad: function() {
            if(!$('body').hasClass('BlueTopBack')) {
                window.location.href = Login.login_url();
            }
        }
    };
});

pjax_config_page('/trading', function () {
    return {
        onLoad: function(){if(/\/trading\.html/.test(window.location.pathname)) TradePage.onLoad();},
        onUnload: function(){if(/\/trading\.html/.test(window.location.pathname)) TradePage.onUnload();}
    };
});

pjax_config_page('/trading_beta', function () {
    return {
        onLoad: function(){TradePage_Beta.onLoad();},
        onUnload: function(){TradePage_Beta.onUnload();}
    };
});

pjax_config_page('/multi_barriers_trading', function () {
    return {
        onLoad: function(){MBTradePage.onLoad();},
        onUnload: function(){MBTradePage.onUnload();}
    };
});

pjax_config_page('/jp_trading', function () {
    return {
        onLoad: function(){JPTradePage.onLoad();},
        onUnload: function(){JPTradePage.onUnload();}
    };
});

pjax_config_page('/platforms', function() {
    return {
        onLoad: function() {
            Platforms.init();
        }
    };
});

pjax_config_page_require_auth("/cashier/deposit-jp", function(){
    return {
        onLoad: function() {
            CashierJP.init('deposit');
        }
    };
});

pjax_config_page_require_auth("/cashier/withdraw-jp", function(){
    return {
        onLoad: function() {
            CashierJP.init('withdraw');
        }
    };
});

pjax_config_page("/endpoint", function(){
    return {
        onLoad: function() {
            Endpoint.init();
        }
    };
});

pjax_config_page('/get-started-jp', function() {
    return {
        onLoad: function() {
            GetStartedJP.init();
        }
    };
});

pjax_config_page('/open-positions', function() {
  return {
      onLoad: function() {
        if (document.getElementById('Information_Technology')) {
          if (page.url.location.hash) {
              $.scrollTo($(page.url.location.hash));
          }
        }
      }
  };
});

pjax_config_page('/open-positions/job-details', function() {
    return {
        onLoad: function() {
            JobDetails.init();
            JobDetails.addEventListeners();
        }
    };
});

pjax_config_page('/regulation', function() {
    return {
        onLoad: function() {
            Regulation.init();
        }
    };
});
