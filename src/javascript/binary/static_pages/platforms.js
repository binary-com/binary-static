var Platforms = (function () {
    var sections = [];
    function init() {
        sections = ['more-tools', 'trading-platforms', 'platforms-comparison'];
        var sidebarListItem = $('.sidebar-nav li');
        sidebarListItem.click(function(e) {
            sidebarListItem.removeClass('selected');
            $(this).addClass('selected');
        });
        $(window).on('hashchange', function(){
            showSelectedDiv();
        });
        checkWidth();
        $(window).resize(checkWidth);
        $('.inner').scroll(checkScroll);
    }
    function checkScroll() {
        var $elem = $('.inner'),
            $fade = $('.fade-to-right');
        var newScrollLeft = $elem.scrollLeft(),
            width = $elem.width(),
            scrollWidth = $elem.get(0).scrollWidth;
        if (scrollWidth - newScrollLeft - width === 0) {
            $fade.css('opacity', '0');
        }
    }
    function checkWidth() {
        if ($('.sidebar-left').is(':visible')) {
            showSelectedDiv();
        } else {
            $('.sections').removeClass('invisible');
        }
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
    return {
        init: init
    };
})();

module.exports = {
    Platforms: Platforms,
};
