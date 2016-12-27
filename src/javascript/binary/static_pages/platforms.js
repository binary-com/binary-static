var Platforms = (function () {
    var sections = [];
    function init() {
        sections = ['more-tools', 'trading-platforms'];
        var sidebarListItem = $('.sidebar-nav li');
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
    }
    function setHeights() {
        $('.inner tr').each(function() {
            var $td = $(this).find('td:first');
            var $th = $(this).find('th');
            if ($th.height() > $td.height()) {
                $(this).find('td').height($th.height());
            }
        });
    }
    function checkScroll() {
        var $elem = $('.inner'),
            $fadeL = $('.fade-to-left'),
            $fadeR = $('.fade-to-right');
        var newScrollLeft = $elem.scrollLeft(),
            width = $elem.width(),
            scrollWidth = $elem.get(0).scrollWidth;
        $fadeL.css('opacity', newScrollLeft === 0 ? '0' : '100');
        $fadeR.css('opacity', scrollWidth === newScrollLeft + width ? '0' : '100');
    }
    function checkWidth() {
        if ($('.sidebar-left').is(':visible')) {
            showSelectedDiv();
        } else {
            $('.sections').removeClass('invisible');
        }
        $('.inner th').hide().fadeIn(1); // force to refresh in order to maintain correct positions
    }
    function get_hash() {
        return (
            page.url.location.hash && $.inArray(page.url.location.hash.substring(1), sections) !== -1 ?
            page.url.location.hash : '#trading-platforms'
        );
    }
    function showSelectedDiv() {
        if ($('.sections[id="' + get_hash().substring(1) + '"]').is(':visible') &&
            $('.sections:visible').length === 1) return;
        $('.sections').addClass('invisible');
        $('.sections[id="' + get_hash().substring(1) + '"]').removeClass('invisible');
        $('.sidebar-nav a[href="' + get_hash() + '"]').parent().addClass('selected');
    }
    function unload() {
        $(window).off('resize');
        $(window).off('hashchange');
    }
    return {
        init  : init,
        unload: unload,
    };
})();

module.exports = {
    Platforms: Platforms,
};
