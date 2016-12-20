var localize = require('../base/localize').localize;
var url_for  = require('../base/url').url_for;
var url      = require('../base/url').url;

var JobDetails = (function() {
    var dept;
    var depts;
    var sections;

    function showSelectedDiv() {
        if ($('.job-details').find('#title').text() === '') {
            init();
        } else {
            $('.sections div').hide();
            $('.sections div[id=' + dept + '-' + url.location.hash.substring(1) + ']').show();
            $('.title-sections').html($('.sidebar li[class="selected"]').text());
            if (dept === 'Information_Technology' && url.location.hash.substring(1) === 'section-three') {
                $('.senior_perl_message').removeClass('invisible');
            } else if (!$('.senior_perl_message').hasClass('invisible')) {
                $('.senior_perl_message').addClass('invisible');
            }
        }
    }

    function check_url() {
        var replace_dept;
        var replace_section;
        if (!dept || $.inArray(dept, depts) === -1) {
            replace_dept = '?dept=Information_Technology';
        }
        if (!url.location.hash || $.inArray(url.location.hash.substring(1), sections) === -1) {
            replace_section = '#section-one';
        }
        if (replace_dept || replace_section) {
            window.location = replace_dept && replace_section ? url_for('open-positions/job-details') + replace_dept + replace_section :
                              replace_dept ? url_for('open-positions/job-details') + replace_dept + url.location.hash :
                              url_for('open-positions/job-details') + '?dept=' + dept + replace_section;
            return false;
        }
        return true;
    }

    function init() {
        dept = url.params_hash().dept;
        depts = ['Information_Technology', 'Quality_Assurance', 'Quantitative_Analysis', 'Marketing', 'Accounting', 'Compliance', 'Customer_Support', 'Human_Resources', 'Administrator', 'Internal_Audit'];
        sections = ['section-one', 'section-two', 'section-three', 'section-four', 'section-five', 'section-six', 'section-seven', 'section-eight'];
        if (check_url()) {
            $('.job-details').find('#title').html(localize(dept.replace(/_/g, ' ')));
            var deptImage = $('.dept-image'),
                sourceImage = deptImage.attr('src').replace('Information_Technology', dept);
            deptImage.attr('src', sourceImage)
                     .show();
            var deptContent = $('#content-' + dept + ' div'),
                section;
            $('#sidebar-nav li').slice(deptContent.length).hide();
            for (var i = 0; i < deptContent.length; i++) {
                section = $('#' + dept + '-' + sections[i]);
                section.insertAfter('.sections div:last-child');
                if (section.attr('class')) {
                    $('#sidebar-nav a[href="#' + sections[i] + '"]').html(localize(section.attr('class').replace(/_/g, ' ')));
                }
            }
            $('.sidebar').show();
            if ($('.sidebar li:visible').length === 1) {
                $('.sidebar').hide();
            }
            $('#' + url.location.hash.substring(9)).addClass('selected');
            showSelectedDiv();
            $('#back-button').attr('href', url_for('open-positions') + '#' + dept);
        }
    }

    function addEventListeners() {
        var sidebarListItem = $('#sidebar-nav li');
        sidebarListItem.click(function() {
            sidebarListItem.removeClass('selected');
            $(this).addClass('selected');
        });

        $(window).on('hashchange', function() {
            if (JobDetails.check_url()) {
                JobDetails.showSelectedDiv();
            }
        });
    }

    return {
        showSelectedDiv  : showSelectedDiv,
        check_url        : check_url,
        init             : init,
        addEventListeners: addEventListeners,
    };
})();

module.exports = {
    JobDetails: JobDetails,
};
