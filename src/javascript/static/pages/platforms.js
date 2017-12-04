const MenuSelector = require('../../_common/menu_selector');

const Platforms = (() => {
    let sections = [];

    const onLoad = () => {
        sections = ['trading-platforms', 'more-tools'];
        MenuSelector.init(sections, false);
        checkWidth();
        $(window).resize(checkWidth);
    };

    const checkWidth = () => {
        if ($('.sidebar').is(':visible')) {
            MenuSelector.showSelectedDiv(sections);
        } else {
            $('.sections').setVisibility(1);
        }
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
