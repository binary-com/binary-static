var Platforms = (function () {
    var sections = [];
    function init() {
        $(window).resize(checkWidth);
        $('.inner').scroll(checkScroll);
        setHeights();
    }
    function setHeights() {
        $('.inner tr').each(function() {
            var $td = $(this).find('td:first'), $th = $(this).find('th');
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
        $('.inner th').hide().fadeIn(1); // force to refresh in order to maintain correct positions
    }
    return {
        init: init
    };
})();

module.exports = {
    Platforms: Platforms,
};
