const getElementById     = require('../../_common/common_functions').getElementById;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const findParent         = require('../../_common/utility').findParent;
require('../../_common/lib/mmenu/jquery.mmenu.min.all.js');

const Menu = (() => {
    const init = () => {
        const menu_top = getElementById('menu-top');

        applyToAllElements('li', (el) => { el.classList.remove('active'); }, '', menu_top);

        const menu_top_item_for_page =  Array.from(menu_top.getElementsByTagName('a'))
            .find(link => link.offsetParent && window.location.pathname.indexOf(link.pathname.replace(/\.html/, '')) >= 0);

        if (menu_top_item_for_page) {
            findParent(menu_top_item_for_page, 'li').classList.add('active');
        }
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

    return {
        init,
        makeMobileMenu,
    };
})();

module.exports = Menu;
