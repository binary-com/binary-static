const Url    = require('./url').Url;
const Client = require('./client').Client;

const Menu = (function() {
    let page_url;

    const init = function (url) {
        page_url = url;
        $(page_url).on('change', function() { activate(); });
    };

    const activate = function() {
        $('#menu-top').find('li').removeClass('active');
        hide_main_menu();

        const active = active_menu_top();
        const trading = new RegExp('\/(jp_|multi_barriers_|)trading\.html');
        const trading_is_active = trading.test(window.location.pathname);
        if (active) {
            active.addClass('active');
        }
        const is_trading_submenu = /\/cashier|\/resources/.test(window.location.pathname) || trading_is_active;
        if (Client.is_logged_in() || trading_is_active || is_trading_submenu) {
            show_main_menu();
        }
    };

    const show_main_menu = function() {
        $('#main-menu').removeClass('hidden');
        activate_main_menu();
    };

    const hide_main_menu = function() {
        $('#main-menu').addClass('hidden');
    };

    const activate_main_menu = function() {
        // First unset everything.
        const $main_menu = $('#main-menu');
        $main_menu.find('li.item').removeClass('active hover');
        $main_menu.find('li.sub_item a').removeClass('a-active');

        const active = active_main_menu();
        if (active.subitem) {
            active.subitem.addClass('a-active');
        }

        if (active.item) {
            active.item.addClass('active');
            active.item.addClass('hover');
        }

        on_mouse_hover(active.item);
    };

    const on_unload = function() {
        $('#main-menu').find('.item').unbind().end()
                       .unbind();
    };

    const on_mouse_hover = function(active_item) {
        const $main_menu = $('#main-menu');
        $main_menu.find('.item').on('mouseenter', function() {
            $('#main-menu').find('li.item').removeClass('hover');
            $(this).addClass('hover');
        });

        $main_menu.on('mouseleave', function() {
            $main_menu.find('li.item').removeClass('hover');
            if (active_item) active_item.addClass('hover');
        });
    };

    const active_menu_top = function() {
        let active = '';
        const path = window.location.pathname;
        $('#menu-top').find('li a').each(function() {
            if (path.indexOf(this.pathname.replace(/\.html/i, '')) >= 0) {
                active = $(this).closest('li');
            }
        });

        return active;
    };

    const active_main_menu = function() {
        let new_url = page_url;
        if (/cashier/i.test(new_url.location.href) && !(/cashier_password/.test(new_url.location.href))) {
            new_url = new Url($('#topMenuCashier').find('a').attr('href'));
        }

        let item = '',
            subitem = '';
        const $main_menu = $('#main-menu');
        // Is something selected in main items list
        $main_menu.find('.items a').each(function () {
            const url = new Url($(this).attr('href'));
            if (url.is_in(new_url)) {
                item = $(this).closest('.item');
            }
        });

        $main_menu.find('.sub_items a').each(function() {
            const link_href = $(this).attr('href');
            if (link_href) {
                const url = new Url(link_href);
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
