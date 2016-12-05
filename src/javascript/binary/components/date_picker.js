var moment = require('moment');

var DatePicker = function(component_id, select_type) {
    this.component_id = component_id;
    this.select_type = (typeof select_type === 'undefined') ? 'date' : select_type;

    this.localizations = {};
    this.localizations.monthNames = [page.text.localize('January'), page.text.localize('February'), page.text.localize('March'), page.text.localize('April'), page.text.localize('May'), page.text.localize('June'), page.text.localize('July'), page.text.localize('August'), page.text.localize('September'), page.text.localize('October'), page.text.localize('November'), page.text.localize('December')];

    this.localizations.monthNamesShort = [page.text.localize('Jan'), page.text.localize('Feb'), page.text.localize('Mar'), page.text.localize('Apr'), page.text.localize('May'), page.text.localize('Jun'), page.text.localize('Jul'), page.text.localize('Aug'), page.text.localize('Sep'), page.text.localize('Oct'), page.text.localize('Nov'), page.text.localize('Dec')];

    this.localizations.dayNames = [page.text.localize('Sunday'), page.text.localize('Monday'), page.text.localize('Tuesday'), page.text.localize('Wednesday'), page.text.localize('Thursday'), page.text.localize('Friday'), page.text.localize('Saturday')];

    this.localizations.nextText = page.text.localize('Next');
    this.localizations.prevText = page.text.localize('Previous');
};

DatePicker.prototype = {
    show: function(max_days) {
        this.create(this.config(max_days));
    },
    hide: function() {
        if ($('#' + this.component_id + '.hasDatepicker').length > 0)            { $('#' + this.component_id).datepicker('destroy'); }
        $('#' + this.component_id).off('keydown');
    },
    create: function(config) {
        var that = this;
        $('#' + this.component_id).keydown(function(e) {
            if (e.which === 13) {
                e.preventDefault();
                e.stopPropagation();
                if (that.select_type === 'date') {
                    $(this).datepicker('setDate', $(this).val());
                }
                $(this).datepicker('hide');
                $(this).blur();
                $(that).trigger('enter_pressed');
                return false;
            }
            return true;
        }).datepicker(config);

        // Not possible to tell datepicker where to put it's
        // trigger calendar icon on the page, so we remove it
        // from the DOM and use our own one.
        $('button.ui-datepicker-trigger').remove();
    },
    config: function(max_days) {
        max_days = (typeof max_days === 'undefined') ? 365 : max_days;
        var today = new Date();
        var next_year = new Date();
        next_year.setDate(today.getDate() + max_days);

        var config = {
            dateFormat     : 'yy-mm-dd',
            monthNames     : this.localizations.monthNames,
            monthNamesShort: this.localizations.monthNamesShort,
            dayNames       : this.localizations.dayNames,
            nextText       : this.localizations.nextText,
            prevText       : this.localizations.prevText,
            minDate        : today,
            maxDate        : next_year,
        };

        var that = this;
        config.onSelect = function(date_text) {
            if (that.select_type === 'diff') {
                var today_m = moment.utc();
                var selected_date = moment.utc(date_text + ' 23:59:59');
                var duration  = selected_date.diff(today_m, 'days');
                $(this).val(duration);
                $(that).trigger('change', [duration]);
            } else if (that.select_type === 'date') {
                $(this).val(date_text);
                $(that).trigger('change', [date_text]);
            }
        };

        return config;
    },
};

module.exports = {
    DatePicker: DatePicker,
};
