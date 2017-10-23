const Client             = require('./client');
const applyToAllElements = require('./utility').applyToAllElements;
require('../../lib/mmenu/jquery.mmenu.min.all.js');

const Menu = (() => {
    let main_menu,
        menu_top,
        items;

    const init = () => {
        main_menu = document.getElementById('main-menu');
        menu_top  = document.getElementById('menu-top');
        if (!main_menu || !menu_top) {
            return;
        }

        items = main_menu.getElementsByClassName('item');

        applyToAllElements('li', (el) => { el.classList.remove('active'); }, '', menu_top);
        hideMainMenu();

        const active = activeMenuTop();
        if (active) active.classList.add('active');

        if (Client.isLoggedIn() || /\/(cashier|resources|trading|trading_beta|multi_barriers_trading)/i.test(window.location.pathname)) {
            showMainMenu();
        }
    };

    const showMainMenu = () => {
        if (main_menu) {
            main_menu.setVisibility(1);
        }
        activateMainMenu();
    };

    const hideMainMenu = () => {
        if (main_menu) {
            main_menu.setVisibility(0);
        }
    };

    const activateMainMenu = () => {
        // First unset everything.
        applyToAllElements(items, (el) => { el.classList.remove('active', 'hover'); });
        applyToAllElements('.sub_item a', (el) => { el.classList.remove('a-active'); }, '', main_menu);

        const active         = activeMainMenu();
        const active_item    = active.item;
        const active_subitem = active.subitem;
        if (active_subitem) {
            active_subitem.classList.add('a-active');
        }

        if (active_item) {
            active_item.classList.add('active', 'hover');
            onMouseHover(active_item);
        }
    };

    const onUnload = () => {
        if (main_menu) {
            main_menu.removeEventListener('mouseleave', onMouseLeave);
        }
        applyToAllElements(items, (el) => { el.removeEventListener('mouseenter', onMouseEnter); });
    };

    const removeHover = () => {
        applyToAllElements(items, (el) => { el.classList.remove('hover'); });
    };

    const onMouseHover = (active_item) => {
        main_menu.addEventListener('mouseleave', () => {
            onMouseLeave(active_item);
        });
        applyToAllElements(items, (el) => { el.addEventListener('mouseenter', onMouseEnter); });
    };

    const onMouseLeave = (active_item) => {
        removeHover();
        if (active_item) active_item.classList.add('hover');
    };

    const onMouseEnter = (e) => {
        removeHover();
        e.target.classList.add('hover');
    };

    const activeMenuTop = () => {
        let active = '';
        const path = window.location.pathname;
        const link_menu_top = menu_top.getElementsByTagName('a');
        for (let i = 0; i < link_menu_top.length; i++) {
            if (path.indexOf(link_menu_top[i].pathname.replace(/\.html/i, '')) >= 0) {
                active = link_menu_top[i].closest('li');
            }
        }
        return active;
    };

    const activeMainMenu = () => {
        let pathname = window.location.pathname;
        if (/cashier/i.test(pathname) && !(/cashier_password|payment_methods/.test(pathname))) {
            const cashier = document.getElementById('topMenuCashier');
            if (cashier) {
                const link = cashier.getElementsByTagName('a')[0];
                if (link) {
                    pathname = link.getAttribute('href');
                }
            }
        }
        if (!main_menu) {
            return {};
        }
        let subitem;
        let item = main_menu.querySelector(`a[href*="${pathname}"]`);

        if (item) {
            const parent = item.closest('li');
            // Is something selected in main items list
            if (parent && parent.classList.contains('sub_item')) {
                subitem = item;
                item    = subitem.closest('.item');
            } else {
                item = parent;
            }
        }

        return { item, subitem };
    };

    const makeMobileMenu = () => {
        const mobile_menu = document.getElementById('mobile-menu-container');
        if (mobile_menu && mobile_menu.offsetParent) {
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
        init,
        onUnload,
        makeMobileMenu,
    };
})();

module.exports = Menu;
