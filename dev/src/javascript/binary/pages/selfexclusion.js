
var self_exclusion_date_picker = function () {
    // 6 months from now
    var start_date = new Date();
    start_date.setMonth(start_date.getMonth() + 6);

    // 5 years from now
    var end_date = new Date();
    end_date.setFullYear(end_date.getFullYear() + 5);

    var id = $('#EXCLUDEUNTIL');

    id.datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: start_date,
        maxDate: end_date,
        onSelect: function(dateText, inst) {
            id.attr("value", dateText);
        },
    });
};

onLoad.queue_for_url(function () {
// date picker for self exclusion
    self_exclusion_date_picker();
}, 'self_exclusion');
