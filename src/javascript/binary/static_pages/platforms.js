var Platforms = (function () {
    var sections = [];
    function init() {
        checkWidth();
        $(window).resize(checkWidth);
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
