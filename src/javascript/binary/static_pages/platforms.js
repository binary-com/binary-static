var Platforms = (function () {
    var sections = [];
    function showLoadingImage(container) {
        container.append('<div id="std_loading_img"><p>' + page.text.localize('loading...') + '</p>' +
            '<img src="' + page.url.url_for_static('images/common/hourglass_1.gif') + '" /></div>');
    }
    function hideLoadingImg() {
        $('#std_loading_img').remove();
    }
    function init() {
        showLoadingImage($('.platforms-section'));
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
            $fade.css('left', '100%');
        } else {
            $fade.css('left', '85%');
        }
    }
    function checkWidth() {
        if ($('.sidebar-left').is(':visible')) {
            sections = ['more-tools', 'trading-platforms', 'platforms-comparison'];
            var sidebarListItem = $('.sidebar-nav li');
            sidebarListItem.click(function(e) {
                sidebarListItem.removeClass('selected');
                $(this).addClass('selected');
            });
            $(window).on('hashchange', function(){
                showSelectedDiv();
            });
            showSelectedDiv();
        } else {
            hideLoadingImg();
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
        $('.sections').addClass('invisible');
        hideLoadingImg();
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
