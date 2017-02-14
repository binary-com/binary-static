const url    = require('../base/url').url;
const Scroll = require('../common_functions/scroll').Scroll;

const TermsAndConditions = (function() {
    const init = function() {
        handleActiveTab();
        Scroll.sidebar_scroll($('.tac-binary'));

        const year = document.getElementsByClassName('currentYear');
        for (let i = 0; i < year.length; i++) {
            year[i].innerHTML = new Date().getFullYear();
        }
    };

    const handleActiveTab = function() {
        const hash    = window.location.hash || '#legal';
        const menu    = '.tab-menu-wrap';
        const content = '.tab-content-wrapper';

        const parent_active = 'active';
        const child_active  = 'a-active';
        const hidden_class  = 'invisible';

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
            .addClass(hidden_class)
            .end()
            .find(content_to_show)
            .removeClass(hidden_class);

        const section = url.param('section');
        if (section) {
            const $section = $(`a[name="${section}"]`);
            if ($section.length) setTimeout(() => { $.scrollTo($section, 0, { offset: -10 }); }, 500);
        } else if (window.location.hash) {
            setTimeout(() => { $.scrollTo($('#content .tab-menu'), 0, { offset: -10 }); }, 500);
        }
    };

    return {
        init: init,
    };
})();

module.exports = {
    TermsAndConditions: TermsAndConditions,
};
