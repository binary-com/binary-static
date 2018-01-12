const Client             = require('./client');
const getElementById     = require('../../_common/common_functions').getElementById;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const findParent         = require('../../_common/utility').findParent;
require('../../_common/lib/mmenu/jquery.mmenu.min.all.js');

const Menu = (() => {
    let main_menu,
        items;

    const init = () => {
        main_menu = getElementById('main-menu');
        items     = main_menu.getElementsByClassName('item');

        activateMenuTop();

        if (Client.isLoggedIn() || /\/(cashier|resources|trading|trading_beta|multi_barriers_trading)/i.test(window.location.pathname)) {
            main_menu.setVisibility(1);
            activateMainMenu();
            Client.activateByClientType('main-menu');
        } else {
            main_menu.setVisibility(0);
        }
    };

    const activateMenuTop = () => {
        const menu_top = getElementById('menu-top');

        applyToAllElements('li', (el) => { el.classList.remove('active'); }, '', menu_top);

        const menu_top_item_for_page =  Array.from(menu_top.getElementsByTagName('a'))
            .find(link => link.offsetParent && window.location.pathname.indexOf(link.pathname.replace(/\.html/, '')) >= 0);

        if (menu_top_item_for_page) {
            findParent(menu_top_item_for_page, 'li').classList.add('active');
        }
    };

    const activateMainMenu = () => {
        // First unset everything.
        applyToAllElements('.sub_item a', (el) => { el.classList.remove('a-active'); }, '', main_menu);

        applyToAllElements(items, (el) => {
            el.classList.remove('active', 'hover');
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        let pathname = window.location.pathname;

        // this is so cashier item becomes highlighted in deposit/withdrawal pages
        if (/cashier/i.test(pathname) && !(/cashier_password|payment_methods/.test(pathname))) {
            const cashier = getElementById('topMenuCashier');
            const link = cashier.getElementsByTagName('a')[0];
            if (link) {
                pathname = link.getAttribute('href');
            }
        }

        let subitem;
        let menu_item_for_page = main_menu.querySelector(`a[href*="${pathname}"]`);

        if (menu_item_for_page) {
            const parent = findParent(menu_item_for_page, 'li');
            // Is something selected in main items list
            if (parent && parent.classList.contains('sub_item')) {
                subitem            = menu_item_for_page;
                menu_item_for_page = findParent(subitem, '.item');
            } else {
                menu_item_for_page = parent;
            }
        }

        if (subitem) {
            subitem.classList.add('a-active');
        }

        if (menu_item_for_page) {
            menu_item_for_page.classList.add('active', 'hover');
        }
    };

    const onMouseEnter = (e) => {
        e.target.classList.add('hover');
    };

    const onMouseLeave = (e) => {
        e.target.classList.remove('hover');
    };

    const makeMobileMenu = () => {
        // avoid creating mobile menu in desktop view as it duplicates menu items with the same id
        if (getElementById('mobile-menu-container').offsetParent) {
            $('#mobile-menu').mmenu({
                position       : 'right',
                zposition      : 'front',
                slidingSubmenus: false,
                searchfield    : true,
                onClick        : { close: true },
            }, { selectedClass: 'active' });
        }
    };

    const onUnload = () => {
        applyToAllElements(items, (el) => {
            el.removeEventListener('mouseenter', onMouseEnter);
            el.removeEventListener('mouseleave', onMouseLeave);
        });
    };

    return {
        init,
        makeMobileMenu,
        onUnload,
    };
})();

module.exports = Menu;
