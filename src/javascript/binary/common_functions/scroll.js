var Scroll = (function() {
    var sidebar_scroll = function(elm_selector) {
        elm_selector.on('click', '#sidebar-nav li', function() {
            var clicked_li = $(this);
            $.scrollTo($('.section:eq(' + clicked_li.index() + ')'), 500);
            return false;
        }).addClass('unbind_later');

        if (elm_selector.length) {
            // grab the initial top offset of the navigation
            var selector = elm_selector.find('.sidebar');
            var width = selector.width();
            var sticky_navigation_offset_top = selector.offset().top;
            // With thanks:
            // http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery

            // our function that decides weather the navigation bar should have "fixed" css position or not.
            var sticky_navigation = function() {
                var scroll_top = $(window).scrollTop(); // our current vertical position from the top

                // if we've scrolled more than the navigation, change its position to fixed to stick to top,
                // otherwise change it back to relative
                if (scroll_top > sticky_navigation_offset_top && scroll_top + selector[0].offsetHeight < document.getElementById('footer').offsetTop) {
                    selector.css({ position: 'fixed', top: 0, width: width });
                } else if (scroll_top + selector[0].offsetHeight > document.getElementById('footer').offsetTop) {
                    selector.css({ position: 'absolute', bottom: document.getElementById('footer').offsetHeight + 'px', top: '', width: width });
                } else {
                    selector.css({ position: 'relative' });
                }
            };

            // run our function on load
            sticky_navigation();

            var sidebar_nav = selector.find('#sidebar-nav');
            var length = elm_selector.find('.section').length;
            $(window).on('scroll', function() {
                // and run it again every time you scroll
                sticky_navigation();

                for (var i = 0; i < length; i++) {
                    var offset = $('.section:eq(' + i + ')').offset();
                    if ($(window).scrollTop() === 0 || (offset && $(this).scrollTop() >= offset.top - 5)) {
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

    var goToHashSection = function() {
        if (page.url.location.hash !== '') {
            $('a[href="' + page.url.location.hash + '"]').click();
        }
    };

    var scrollToHashSection = function() {
        if (page.url.location.hash) {
            $.scrollTo($(page.url.location.hash));
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
