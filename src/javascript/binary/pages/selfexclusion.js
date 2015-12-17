var Exclusion = (function(){
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

    var self_exclusion_validate_date = function () {
        $('#selfExclusion').on('click', '#self_exclusion_submit', function () {
            return client_form.self_exclusion.validate_exclusion_date();
        });
    };

    return{
        self_exclusion_validate_date : self_exclusion_validate_date,
        self_exclusion_date_picker :self_exclusion_date_picker
    };

})();
onLoad.queue_for_url(function () {
// date picker for self exclusion
    Exclusion.self_exclusion_date_picker();
    Exclusion.self_exclusion_validate_date();
}, 'self_exclusion');
