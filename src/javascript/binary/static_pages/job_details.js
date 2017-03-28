const urlParam = require('../base/url').param;
const urlFor   = require('../base/url').urlFor;

const JobDetails = (() => {
    'use strict';

    const hidden_class = 'invisible';

    let dept;

    let $sections_div,
        dept_class,
        $senior_perl_message,
        $sidebar,
        $sidebar_dept;

    const showSelectedDiv = () => {
        const section = window.location.hash;
        $sections_div.addClass(hidden_class).filter(section).removeClass(hidden_class);
        if (dept === 'Information_Technology' && /senior_perl_developer/.test(section)) {
            $senior_perl_message.removeClass(hidden_class);
        } else {
            $senior_perl_message.addClass(hidden_class);
        }
    };

    const onLoad = () => {
        dept = urlParam('dept');
        dept_class = `.${dept}`;
        $sidebar = $('.sidebar');
        $sidebar_dept = $sidebar.filter(dept_class);
        $sections_div = $('.sections > div > div');
        $senior_perl_message = $('.senior_perl_message');
        // hide all first (to handle pjaxload)
        $sidebar.addClass(hidden_class);
        $('#title').find('h1').addClass(hidden_class);
        $('#image').find('img').addClass(hidden_class);
        // show section
        $(dept_class).removeClass(hidden_class);
        $sidebar_dept.removeClass(hidden_class).find(`a[href="${window.location.hash}"]`).parent('li').addClass('selected');
        showSelectedDiv();
        $('#back-button').attr('href', `${urlFor('open-positions')}#${dept}`);
        addEventListeners();
    };

    const addEventListeners = () => {
        const $sidebar_list_item = $sidebar_dept.find('#sidebar-nav li');
        $sidebar_list_item.click(function() {
            $sidebar_list_item.removeClass('selected');
            $(this).addClass('selected');
        });

        $(window).on('hashchange', () => {
            showSelectedDiv();
        });
    };

    const onUnload = () => {
        $(window).off('hashchange');
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = JobDetails;
