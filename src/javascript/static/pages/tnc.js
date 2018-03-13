const tabListener = require('binary-style').tabListener;
const sidebar     = require('binary-style').sidebarCollapsible;
const localize    = require('../../_common/localize').localize;
const urlParam    = require('../../_common/url').param;
const TNCApproval = require('../../app/pages/user/tnc_approval');

const TermsAndConditions = (() => {
    let sidebar_width;

    const onLoad = () => {
        const container = document.getElementsByClassName('sidebar-collapsible-container')[0];
        if (container) sidebar_width = container.offsetWidth;

        handleActiveTab();
        TNCApproval.requiresTNCApproval(
            $('#btn_accept'),
            () => { $('.tnc_accept').setVisibility(1); },
            () => { $('#tnc_accept').html(localize('Your settings have been updated successfully.')); });
        tabListener();
        sidebar();

        handleSidebar();
        checkWidth();
        window.onresize = checkWidth;

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
        const hash     = window.location.hash || '#legal';
        const $sidebar = $('.sidebar-collapsible');
        const $content = $('.sidebar-collapsible-content');

        $sidebar.on('click', () => {
            if (!checkWidth()) $.scrollTo($content, 250, { offset: -10 });
        });

        const is_submenu = /-binary|-mt/.test(hash);
        if (is_submenu) {
            let parent_hash = hash;
            if (/-binary/.test(hash)) {
                parent_hash = hash.split('-binary')[0];
            } else if (/-mt/.test(hash)) {
                parent_hash = hash.split('-mt')[0];
            }
            $sidebar.find(`${parent_hash} a:first`).trigger('click'); // click mainmenu
            $sidebar.find(`${hash} a:first`).trigger('click');  // click submenu
        } else {
            $sidebar.find(`${hash} a:first`).trigger('click');
        }
    };

    const checkWidth = () => {
        const mq = window.matchMedia('(max-width: 1023px)').matches;
        if (mq) {
            $('.sidebar-collapsible').css({ position: 'relative' });
            $(window).off('scroll', stickySidebar);
        } else {
            $(window).on('scroll', stickySidebar);
        }
        return mq;
    };

    const stickySidebar = () => {
        const $sidebar   = $('.sidebar-collapsible');
        const $content   = $('.sidebar-collapsible-content');
        const $container = $('.sidebar-collapsible-container');

        if (!$sidebar.is(':visible')) return;

        if (window.scrollY < $content.offset().top) {
            $sidebar.css({ position: 'relative' });
        } else if (window.scrollY + $sidebar[0].offsetHeight + 20 >=
            $container[0].offsetHeight + $container.offset().top) { // 20 is the padding for content from bottom, to avoid menu snapping back up
            $sidebar.css({ position: 'absolute', bottom: '20px', top: '', width: sidebar_width });
        } else {
            $sidebar.css({ position: 'fixed', top: '0px', bottom: '', width: sidebar_width });
        }
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
