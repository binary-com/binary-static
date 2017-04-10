const Client = require('./client');
require('../../lib/mmenu/jquery.mmenu.min.all.js');

const Menu = (() => {
    'use strict';

    let $main_menu;

    const init = () => {
        $main_menu = $('#main-menu');

        $('#menu-top').find('li').removeClass('active');
        hideMainMenu();

        const active = activeMenuTop();
        if (active) active.addClass('active');

        if (Client.isLoggedIn() || /\/(cashier|resources|trading|trading_beta|multi_barriers_trading)/i.test(window.location.pathname)) {
            showMainMenu();
        }
    };

    const showMainMenu = () => {
        $main_menu.removeClass('hidden');
        activateMainMenu();
    };

    const hideMainMenu = () => {
        $main_menu.addClass('hidden');
    };

    const activateMainMenu = () => {
        // First unset everything.
        $main_menu
            .find('li.item')
            .removeClass('active hover')
            .end()
            .find('li.sub_item a')
            .removeClass('a-active');

        const active = activeMainMenu();
        const active_item = active.item;
        const active_subitem = active.subitem;
        if (active_subitem) {
            active_subitem.addClass('a-active');
        }

        if (active_item) {
            active_item.addClass('active hover');
            onMouseHover(active_item);
        }
    };

    const onUnload = () => { $main_menu.unbind().find('.item').unbind(); };

    const removeHover = () => { $main_menu.find('li.item').removeClass('hover'); };

    const onMouseHover = (active_item) => {
        $main_menu
            .on('mouseleave', () => {
                removeHover();
                if (active_item) active_item.addClass('hover');
            })
            .find('.item')
            .on('mouseenter', function() {
                removeHover();
                $(this).addClass('hover');
            });
    };

    const activeMenuTop = () => {
        let active = '';
        const path = window.location.pathname;
        $('#menu-top').find('li a').each(function() {
            if (path.indexOf(this.pathname.replace(/\.html/i, '')) >= 0) {
                active = $(this).closest('li');
            }
        });
        return active;
    };

    const activeMainMenu = () => {
        let pathname = window.location.pathname;
        if (/cashier/i.test(pathname) && !(/(cashier_password|payment_methods)/.test(pathname))) {
            pathname = $('#topMenuCashier').find('a').attr('href');
        }
        let $item,
            $subitem;
        // Is something selected in main items list
        $item = $main_menu.find(`a[href*="${pathname}"]`);
        const $parent = $item.closest('li');
        if ($parent.hasClass('sub_item')) {
            $subitem = $item;
            $item = $subitem.closest('.item');
        } else {
            $item = $parent;
        }
        return { item: $item, subitem: $subitem };
    };

    const makeMobileMenu = () => {
        if ($('#mobile-menu-container').is(':visible')) {
            $('#mobile-menu').mmenu({
                position       : 'right',
                zposition      : 'front',
                slidingSubmenus: false,
                searchfield    : true,
                onClick        : { close: true },
            }, { selectedClass: 'active' });
        }
    };

    return {
        init          : init,
        onUnload      : onUnload,
        makeMobileMenu: makeMobileMenu,
    };
})();

module.exports = Menu;
