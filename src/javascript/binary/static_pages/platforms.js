const MenuSelector = require('../common_functions/menu_selector');

const Platforms = (() => {
    let sections = [];

    const onLoad = () => {
        sections = ['trading-platforms', 'more-tools'];
        MenuSelector.init(sections, false);
        checkWidth();
        $(window).resize(checkWidth);
        // $('.inner').scroll(checkScroll);
        // setHeights();
    };

    // const setHeights = () => {
    //     let $this;
    //     $('.inner tr').each(function() {
    //         $this = $(this);
    //         const $td = $this.find('td:first');
    //         const $th = $this.find('th');
    //         if ($th.height() > $td.height()) {
    //             $this.find('td').height($th.height());
    //         }
    //     });
    // };

    // const checkScroll = () => {
    //     const $elem = $('.inner');
    //     const $fade_left = $('.fade-to-left');
    //     const $fade_right = $('.fade-to-right');
    //     const new_scroll_left = $elem.scrollLeft();
    //     $fade_left.css('opacity', new_scroll_left === 0 ? '0' : '100');
    //     $fade_right.css('opacity', $elem.get(0).scrollWidth === new_scroll_left + $elem.width() ? '0' : '100');
    // };

    const checkWidth = () => {
        if ($('.sidebar').is(':visible')) {
            MenuSelector.showSelectedDiv(sections);
        } else {
            $('.sections').setVisibility(1);
        }
        // $('.inner th').hide().fadeIn(1); // force to refresh in order to maintain correct positions
    };

    const onUnload = () => {
        $(window).off('resize');
        MenuSelector.clean();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Platforms;
