const localize    = require('../base/localize').localize;
const urlParam    = require('../base/url').param;
const Scroll      = require('../common_functions/scroll');
const TNCApproval = require('../websocket_pages/user/tnc_approval');

const TermsAndConditions = (() => {
    const onLoad = () => {
        handleActiveTab();
        TNCApproval.requiresTNCApproval(
            $('#btn_accept'),
            () => { $('.tnc_accept').setVisibility(1); },
            () => { $('#tnc_accept').html(localize('Your settings have been updated successfully.')); });
        Scroll.sidebarScroll($('.tac-binary'));
        tabListener();

        $('.currentYear').text(new Date().getFullYear());
    };

    const handleActiveTab = () => {
        const hash    = window.location.hash || '#legal';
        const menu    = '.tab-menu-wrap';
        const content = '.tab-content-wrapper';

        const parent_active = 'active';
        const child_active  = 'a-active';

        $(menu)
            .find('li')
            .removeClass(parent_active)
            .find('span')
            .removeClass(child_active);

        let $tab_to_show = $(hash);
        // if hash is a subtab or has subtabs
        if ($tab_to_show.find('.tm-li-2').length > 0 || /tm-li-2/.test($(hash).attr('class'))) {
            $tab_to_show =
                $tab_to_show
                    .find('.tm-a-2')
                    .first()
                    .addClass(child_active)
                    .closest('.tm-li');
        }
        $tab_to_show.addClass(parent_active);

        let content_to_show = `div${hash}-content`;
        if ($(content_to_show).length === 0) {
            content_to_show = `div#${$(hash).find('.tm-li-2').first().attr('id')}-content`;
        }
        $(content)
            .find('> div')
            .setVisibility(0)
            .end()
            .find(content_to_show)
            .setVisibility(1);

        const section  = urlParam('section');
        const $content = $('#content');
        if (section) {
            const $section = $content.find(`a#${section}`);
            if ($section.length) setTimeout(() => { $.scrollTo($section, 0, { offset: -5 }); }, 500);
        } else if (window.location.hash) {
            setTimeout(() => { $.scrollTo($content.find('.tab-menu'), 0, { offset: -10 }); }, 500);
        }
    };

    const onUnload = () => {
        Scroll.offScroll();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = TermsAndConditions;
