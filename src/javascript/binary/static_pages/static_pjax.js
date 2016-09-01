pjax_config_page('/\?.+|/home', function() {
    return {
        onLoad: function() {
            if(/^(\/|\/home)$/i.test(window.location.pathname)) {
                page.client.redirect_if_login();
            }
            check_login_hide_signup();
            submit_email();
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
            if (!/jp/.test(window.location.pathname) && japanese_client()) {
              window.location.href = page.url.url_for('get-started-jp');
            } else if (/jp/.test(window.location.pathname)) {
              return;
          } else {
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
            if (japanese_client()) {
                window.location.href = page.url.url_for('/');
            }
            display_career_email();
        },
    };
});

pjax_config_page('/terms-and-conditions', function() {
    return {
        onLoad: function() {
            if (japanese_client() && !/jp/.test(window.location.pathname)) {
              window.location.href = page.url.url_for('terms-and-conditions-jp');
            } else if (!japanese_client() && /jp/.test(window.location.pathname)) {
              window.location.href = page.url.url_for('terms-and-conditions');
            }
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
        onLoad: function(){TradePage.onLoad();},
        onUnload: function(){TradePage.onUnload();}
    };
});

pjax_config_page('/jptrading', function () {
    return {
        onLoad: function(){JPTradePage.onLoad();},
        onUnload: function(){JPTradePage.onUnload();}
    };
});

pjax_config_page('/affiliate/signup', function() {
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('partners');
            }
        }
    };
});

pjax_config_page('/(us_patents|responsible-trading|partners)', function() {
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('/');
            }
        }
    };
});
