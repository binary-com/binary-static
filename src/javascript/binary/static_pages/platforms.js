const Platforms = (() => {
    'use strict';

    let sections = [];

    const onLoad = () => {
        sections = ['more-tools', 'trading-platforms'];

        const sidebar_list_item = $('.sidebar-nav li');
        sidebar_list_item.click(function() {
            sidebar_list_item.removeClass('selected');
            $(this).addClass('selected');
        });

        $(window).on('hashchange', () => {
            showSelectedDiv();
        });

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
            showSelectedDiv();
        } else {
            $('.sections').setVisibility(1);
        }
        // $('.inner th').hide().fadeIn(1); // force to refresh in order to maintain correct positions
    };

    const getHash = () => {
        const hash = window.location.hash;
        return hash && $.inArray(hash.substring(1), sections) !== -1 ? hash : '#trading-platforms';
    };

    const showSelectedDiv = () => {
        const $sections_with_hash = $(`.sections[id="${getHash().substring(1)}"]`);
        if ($sections_with_hash.is(':visible') && $('.sections:visible').length === 1) {
            return;
        }
        $('.sections').setVisibility(0);
        $sections_with_hash.setVisibility(1);
        $(`.sidebar-nav a[href="${getHash()}"]`).parent().addClass('selected');
    };

    const onUnload = () => {
        $(window).off('resize hashchange');
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = Platforms;
