const localize = require('../base/localize').localize;
const urlFor   = require('../base/url').urlFor;
const url      = require('../base/url').url;

const JobDetails = (function() {
    let dept,
        depts,
        sections;

    const showSelectedDiv = function() {
        if ($('.job-details').find('#title').text() === '') {
            onLoad();
        } else {
            const hash_substring = window.location.hash.substring(1);
            $('.sections div').hide();
            $('.sections div[id=' + dept + '-' + hash_substring + ']').show();
            $('.title-sections').html($('.sidebar li[class="selected"]').text());
            if (dept === 'Information_Technology' && hash_substring === 'section-three') {
                $('.senior_perl_message').removeClass('invisible');
            } else if (!$('.senior_perl_message').hasClass('invisible')) {
                $('.senior_perl_message').addClass('invisible');
            }
        }
    };

    const check_url = function() {
        let replace_dept,
            replace_section;
        if (!dept || $.inArray(dept, depts) === -1) {
            replace_dept = '?dept=Information_Technology';
        }
        const hash = window.location.hash;
        if (!hash || $.inArray(hash.substring(1), sections) === -1) {
            replace_section = '#section-one';
        }
        if (replace_dept || replace_section) {
            window.location = replace_dept && replace_section ? urlFor('open-positions/job-details') + replace_dept + replace_section :
                              replace_dept ? urlFor('open-positions/job-details') + replace_dept + hash :
                              urlFor('open-positions/job-details') + '?dept=' + dept + replace_section;
            return false;
        }
        return true;
    };

    const onLoad = function() {
        dept = url.param('dept');
        depts = ['Information_Technology', 'Quality_Assurance', 'Quantitative_Analysis', 'Marketing', 'Accounting', 'Compliance', 'Customer_Support', 'Human_Resources', 'Administrator', 'Internal_Audit'];
        sections = ['section-one', 'section-two', 'section-three', 'section-four', 'section-five', 'section-six', 'section-seven', 'section-eight'];
        if (check_url()) {
            $('.job-details').find('#title').html(localize(dept.replace(/_/g, ' ')));
            const deptImage = $('.dept-image'),
                sourceImage = deptImage.attr('src').replace('Information_Technology', dept);
            deptImage.attr('src', sourceImage)
                     .show();
            const deptContent = $('#content-' + dept + ' div'),
                $sidebar_nav = $('#sidebar-nav');
            let section;
            $sidebar_nav.find('li').slice(deptContent.length).hide();
            for (let i = 0; i < deptContent.length; i++) {
                section = $('#' + dept + '-' + sections[i]);
                section.insertAfter('.sections div:last-child');
                if (section.attr('class')) {
                    $sidebar_nav.find('a[href="#' + sections[i] + '"]').html(localize(section.attr('class').replace(/_/g, ' ')));
                }
            }
            const $sidebar = $('.sidebar');
            $sidebar.show();
            if ($sidebar.find('li:visible').length === 1) {
                $sidebar.hide();
            }
            $('#' + window.location.hash.substring(9)).addClass('selected');
            showSelectedDiv();
            $('#back-button').attr('href', urlFor('open-positions') + '#' + dept);
        }
        addEventListeners();
    };

    const addEventListeners = function() {
        const sidebarListItem = $('#sidebar-nav').find('li');
        sidebarListItem.click(function() {
            sidebarListItem.removeClass('selected');
            $(this).addClass('selected');
        });

        $(window).on('hashchange', function() {
            if (JobDetails.check_url()) {
                JobDetails.showSelectedDiv();
            }
        });
    };

    const onUnload = function() {
        $(window).off('hashchange');
    };

    return {
        onLoad         : onLoad,
        onUnload       : onUnload,
        showSelectedDiv: showSelectedDiv,
        check_url      : check_url,
    };
})();

module.exports = JobDetails;
