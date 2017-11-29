const tabListener = require('binary-style').tabListener;
const sidebar     = require('binary-style').sidebarCollapsible;
const localize    = require('../../_common/localize').localize;
const urlParam    = require('../../_common/url').param;
const TNCApproval = require('../../app/pages/user/tnc_approval');

const TermsAndConditions = (() => {
    const onLoad = () => {
        handleActiveTab();
        TNCApproval.requiresTNCApproval(
            $('#btn_accept'),
            () => { $('.tnc_accept').setVisibility(1); },
            () => { $('#tnc_accept').html(localize('Your settings have been updated successfully.')); });
        tabListener();
        sidebar();
        handleSidebar();
        $('.currentYear').text(new Date().getFullYear());
    };

    const handleActiveTab = () => {
        const params      = window.location.hash.split('&');
        const hash        = params[0] || '#legal';
        const sub_content = params[1];
        const menu        = '.tab-menu-wrap';
        const content     = '.tab-content-wrapper';

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
        } else if (hash) {
            setTimeout(() => { $.scrollTo($content.find('.tab-menu'), 0, { offset: -10 }); }, 500);
        }
        if (sub_content) {
            setTimeout(() => { $.scrollTo($content.find(`#${sub_content}`), 500, { offset: -10 }); }, 500);
        }
    };

    const handleSidebar = () => {
        const hash = window.location.hash;
        $('.sidebar-collapsible').find(hash ? `${hash} a` : 'a:first').trigger('click');
    };

    const onUnload = () => {
        $('.sidebar-collapsible a').off('click');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = TermsAndConditions;
