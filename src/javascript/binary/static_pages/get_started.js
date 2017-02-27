const Scroll = require('../common_functions/scroll');

const GetStarted = (function() {
    const select_nav_element = function() {
        const $navLink = $('.nav li a');
        const $navList = $('.nav li');
        $navList.removeClass('selected');
        for (let i = 0; i < $navLink.length; i++) {
            if ($navLink[i].href.match(window.location.pathname)) {
                document.getElementsByClassName('nav')[0].getElementsByTagName('li')[i].setAttribute('class', 'selected');
                break;
            }
        }
    };

    const onLoad = function() {
        const update_active_subsection = function(to_show) {
            const subsection = $('.subsection');
            subsection.addClass('hidden');
            to_show.removeClass('hidden');
            const nav_back = $('.subsection-navigation .back');
            const nav_next = $('.subsection-navigation .next');

            if (to_show.hasClass('first')) {
                nav_back.addClass('button-disabled');
                nav_next.removeClass('button-disabled');
            } else if (to_show.hasClass('last')) {
                nav_back.removeClass('button-disabled');
                nav_next.addClass('button-disabled');
            } else {
                nav_back.removeClass('button-disabled');
                nav_next.removeClass('button-disabled');
            }

            const new_hash = to_show.find('a[name]').attr('name').slice(0, -8);
            if (window.location.hash !== `#${new_hash}`) {
                window.location.hash = new_hash;
            }

            return false;
        };

        let to_show,
            fragment;
        const nav = $('.get-started').find('.subsection-navigation');

        if (nav.length) {
            nav.on('click', 'a', function() {
                const button = $(this);
                if (button.hasClass('button-disabled')) {
                    return false;
                }
                const now_showing = $('.subsection:not(.hidden)');
                const show = button.hasClass('next') ? now_showing.next('.subsection') : now_showing.prev('.subsection');
                return update_active_subsection(show);
            });

            fragment = (location.href.split('#'))[1];
            to_show = fragment ? $('a[name=' + fragment + '-section]').parent('.subsection') : $('.subsection.first');
            update_active_subsection(to_show);
        }
        select_nav_element();
    };

    const onUnload = function() {
        Scroll.offScroll();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = GetStarted;
