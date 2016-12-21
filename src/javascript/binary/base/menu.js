var Url    = require('./url').Url;
var Client = require('./client').Client;

var Menu = (function() {
    var page_url;

    var init = function (url) {
        page_url = url;
        $(page_url).on('change', function() { activate(); });
    };

    var activate = function() {
        $('#menu-top li').removeClass('active');
        hide_main_menu();

        var active = active_menu_top();
        var trading = new RegExp('\/(jp_|multi_barriers_|)trading\.html');
        var trading_is_active = trading.test(window.location.pathname);
        if (active) {
            active.addClass('active');
        }
        var is_trading_submenu = /\/cashier|\/resources/.test(window.location.pathname) || trading_is_active;
        if (Client.get_boolean('is_logged_in') || trading_is_active || is_trading_submenu) {
            show_main_menu();
        }
    };

    var show_main_menu = function() {
        $('#main-menu').removeClass('hidden');
        activate_main_menu();
    };

    var hide_main_menu = function() {
        $('#main-menu').addClass('hidden');
    };

    var activate_main_menu = function() {
        // First unset everything.
        $('#main-menu li.item').removeClass('active');
        $('#main-menu li.item').removeClass('hover');
        $('#main-menu li.sub_item a').removeClass('a-active');

        var active = active_main_menu();
        if (active.subitem) {
            active.subitem.addClass('a-active');
        }

        if (active.item) {
            active.item.addClass('active');
            active.item.addClass('hover');
        }

        on_mouse_hover(active.item);
    };

    var on_unload = function() {
        $('#main-menu .item').unbind();
        $('#main-menu').unbind();
    };

    var on_mouse_hover = function(active_item) {
        $('#main-menu .item').on('mouseenter', function() {
            $('#main-menu li.item').removeClass('hover');
            $(this).addClass('hover');
        });

        $('#main-menu').on('mouseleave', function() {
            $('#main-menu li.item').removeClass('hover');
            if (active_item) active_item.addClass('hover');
        });
    };

    var active_menu_top = function() {
        var active = '';
        var path = window.location.pathname;
        $('#menu-top li a').each(function() {
            if (path.indexOf(this.pathname.replace(/\.html/i, '')) >= 0) {
                active = $(this).closest('li');
            }
        });

        return active;
    };

    var active_main_menu = function() {
        var new_url = page_url;
        if (/cashier/i.test(new_url.location.href) && !(/cashier_password/.test(new_url.location.href))) {
            new_url = new Url($('#topMenuCashier a').attr('href'));
        }

        var item = '';
        var subitem = '';

        // Is something selected in main items list
        $('#main-menu .items a').each(function () {
            var url = new Url($(this).attr('href'));
            if (url.is_in(new_url)) {
                item = $(this).closest('.item');
            }
        });

        $('#main-menu .sub_items a').each(function() {
            var link_href = $(this).attr('href');
            if (link_href) {
                var url = new Url(link_href);
                if (url.is_in(new_url)) {
                    item = $(this).closest('.item');
                    subitem = $(this);
                }
            }
        });

        return { item: item, subitem: subitem };
    };

    return {
        init     : init,
        on_unload: on_unload,
    };
})();

module.exports = {
    Menu: Menu,
};
