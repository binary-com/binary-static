const url = require('../base/url').url;

const Scroll = (function() {
    const sidebar_scroll = function(elm_selector) {
        elm_selector.on('click', '#sidebar-nav li', function() {
            const clicked_li = $(this);
            $.scrollTo($('.section:eq(' + clicked_li.index() + ')'), 500);
            return false;
        }).addClass('unbind_later');

        if (elm_selector.length) {
            // grab the initial top offset of the navigation
            const selector = elm_selector.find('.sidebar');
            const width = selector.width();
            const sticky_navigation_offset_top = selector.offset().top;
            const container = elm_selector.find('.sidebar-container');

            // With thanks:
            // http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery

            // our function that decides weather the navigation bar should have "fixed" css position or not.
            const sticky_navigation = function() {
                const scroll_top = $(window).scrollTop(); // our current vertical position from the top

                // if we've scrolled more than the navigation, change its position to fixed to stick to top,
                // otherwise change it back to relative
                if (scroll_top + selector[0].offsetHeight > container[0].offsetHeight + container.offset().top) {
                    selector.css({ position: 'absolute', bottom: 0, top: '', width: width });
                } else if (scroll_top > sticky_navigation_offset_top) {
                    selector.css({ position: 'fixed', top: 0, bottom: '', width: width });
                } else {
                    selector.css({ position: 'relative' });
                }
            };

            // run our function on load
            sticky_navigation();

            const sidebar_nav = selector.find('#sidebar-nav');
            const length = elm_selector.find('.section').length;
            $(window).on('scroll', function() {
                // and run it again every time you scroll
                sticky_navigation();

                for (let i = 0; i < length; i++) {
                    const section = $('.section:eq(' + i + ')'),
                        sectionOffset = section.offset(),
                        isOffsetTop = sectionOffset && $(this).scrollTop() >= sectionOffset.top - 5;
                    if (($(window).scrollTop() === 0 || isOffsetTop) && section.css('display') !== 'none') { // ignore hidden elements
                        sidebar_nav.find('li').removeClass('selected');

                        if ($(window).scrollTop() === 0) {
                            // We're at the top of the screen, so highlight first nav item
                            sidebar_nav.find('li:first-child').addClass('selected');
                        } else if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                            // We're at bottom of screen so highlight last nav item.
                            sidebar_nav.find('li:last-child').addClass('selected');
                        } else {
                            sidebar_nav.find('li:eq(' + i + ')').addClass('selected');
                        }
                    }
                }
            });
        }
    };

    const goToHashSection = function() {
        if (url.location.hash !== '') {
            $('a[href="' + url.location.hash + '"]').click();
        }
    };

    const scrollToHashSection = function() {
        if (url.location.hash) {
            $.scrollTo($(url.location.hash));
        }
    };

    return {
        sidebar_scroll     : sidebar_scroll,
        offScroll          : function() { $(window).off('scroll'); },
        goToHashSection    : goToHashSection,
        scrollToHashSection: scrollToHashSection,
    };
})();

module.exports = {
    Scroll: Scroll,
};
