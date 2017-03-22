const Platforms = (function () {
    let sections = [];

    const onLoad = function() {
        sections = ['more-tools', 'trading-platforms'];
        const sidebarListItem = $('.sidebar-nav li');
        sidebarListItem.click(function() {
            sidebarListItem.removeClass('selected');
            $(this).addClass('selected');
        });
        $(window).on('hashchange', function() {
            showSelectedDiv();
        });
        checkWidth();
        $(window).resize(checkWidth);
        $('.inner').scroll(checkScroll);
        setHeights();
    };

    const setHeights = function() {
        $('.inner tr').each(function() {
            const $td = $(this).find('td:first');
            const $th = $(this).find('th');
            if ($th.height() > $td.height()) {
                $(this).find('td').height($th.height());
            }
        });
    };

    const checkScroll = function() {
        const $elem = $('.inner'),
            $fadeL = $('.fade-to-left'),
            $fadeR = $('.fade-to-right');
        const newScrollLeft = $elem.scrollLeft(),
            width = $elem.width(),
            scrollWidth = $elem.get(0).scrollWidth;
        $fadeL.css('opacity', newScrollLeft === 0 ? '0' : '100');
        $fadeR.css('opacity', scrollWidth === newScrollLeft + width ? '0' : '100');
    };

    const checkWidth = function() {
        if ($('.sidebar-left').is(':visible')) {
            showSelectedDiv();
        } else {
            $('.sections').removeClass('invisible');
        }
        $('.inner th').hide().fadeIn(1); // force to refresh in order to maintain correct positions
    };

    const get_hash = function() {
        const hash = window.location.hash;
        return hash && $.inArray(hash.substring(1), sections) !== -1 ? hash : '#trading-platforms';
    };

    const showSelectedDiv = function() {
        const $sections_with_hash = $('.sections[id="' + get_hash().substring(1) + '"]');
        if ($sections_with_hash.is(':visible') &&
            $('.sections:visible').length === 1) return;
        $('.sections').addClass('invisible');
        $sections_with_hash.removeClass('invisible');
        $('.sidebar-nav a[href="' + get_hash() + '"]').parent().addClass('selected');
    };

    const onUnload = function() {
        $(window).off('resize');
        $(window).off('hashchange');
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = Platforms;
