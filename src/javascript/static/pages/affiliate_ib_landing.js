const Url         = require('../../../javascript/_common/url.js');
const TabSelector = require('../../_common/tab_selector');

const AffiliateIBLanding = (() => {
    const onLoad = () => {
        initializeTypeOfPartnersTab();
    };

    const initializeTypeOfPartnersTab = () => {
        const navigation_tabs = $('.has-tabs').children('ul').find('li');
        const params_hash = Url.paramsHash();

        if (params_hash.tabs === undefined) {
            Url.updateParamsWithoutReload({ tabs: getTabAnchorWithoutHashTag(navigation_tabs.first()) }, true);
            $('.has-tabs').tabs();
        } else {
            navigation_tabs.each((index, element) => {
                const tabIndex = (params_hash.tabs === getTabAnchorWithoutHashTag(element)) && index;
                $('.has-tabs').tabs({ active: tabIndex });
            });
        }

        navigation_tabs.each((index, element) => {
            $(element).on('click', () => {
                Url.updateParamsWithoutReload({ tabs: getTabAnchorWithoutHashTag(element) }, true);
                TabSelector.repositionSelector();
            });
        });

        TabSelector.onLoad();
    };

    const getTabAnchorWithoutHashTag = (element) => $(element).find('a').attr('href').replace('#', '');
    
    const onUnload = () => {
        TabSelector.onUnload();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = AffiliateIBLanding;
