DatePicker = function(component_id, select_type) {
    this.component_id = component_id;
    this.select_type = (typeof select_type === "undefined") ? "date" : select_type;

    this.localizations = {};
    this.localizations.monthNames = [text.localize('January'), text.localize('February'), text.localize('March'), text.localize('April'), text.localize('May'), text.localize('June'),text.localize('July'), text.localize('August'), text.localize('September'), text.localize('October'), text.localize('November'), text.localize('December') ];

    this.localizations.monthNamesShort = [text.localize('Jan'), text.localize('Feb'), text.localize('Mar'), text.localize('Apr'), text.localize('May'), text.localize('Jun'), text.localize('Jul'), text.localize('Aug'), text.localize('Sep'), text.localize('Oct'), text.localize('Nov'), text.localize('Dec')];

    this.localizations.dayNames = [text.localize('Sunday'), text.localize('Monday'), text.localize('Tuesday'), text.localize('Wednesday'), text.localize('Thursday'), text.localize('Friday'), text.localize('Saturday')];

    this.localizations.nextText = text.localize('Next');
    this.localizations.prevText = text.localize('Previous');
};

DatePicker.prototype = {
    show: function(max_days) {
        this.create(this.config(max_days));
    },
    hide: function() {
        if($('#' + this.component_id + '.hasDatepicker').length > 0)
            $('#' + this.component_id).datepicker('destroy');
        $('#' + this.component_id).off('keydown');
    },
    create: function(config) {
        var that = this;
        $('#' + this.component_id).keydown(function(e) {
                if(e.which == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    if(that.select_type == "date") {
                        $(this).datepicker('setDate', $(this).val());
                    }
                    $(this).datepicker('hide');
                    $(this).blur();
                    $(that).trigger('enter_pressed');
                    return false;
                }
        }).datepicker(config);

        // Not possible to tell datepicker where to put it's
        // trigger calendar icon on the page, so we remove it
        // from the DOM and use our own one.
        $('button.ui-datepicker-trigger').remove();
    },
    config: function(max_days) {
        max_days = (typeof max_days == "undefined") ? 365 : max_days;
        var today = new Date();
        var next_year = new Date();
        next_year.setDate(today.getDate() + max_days);

        var config = {
            dateFormat: 'yy-mm-dd',
            monthNames: this.localizations.monthNames,
            monthNamesShort: this.localizations.monthNamesShort,
            dayNames: this.localizations.dayNames,
            nextText: this.localizations.nextText,
            prevText: this.localizations.prevText,
            minDate: today,
            maxDate: next_year,
        };

        var that = this;
        config.onSelect = function(date_text) {
            if(that.select_type == "diff") {
                var today = moment.utc();
                var selected_date = moment.utc(date_text + " 23:59:59");
                var duration  = selected_date.diff(today, 'days');
                $(this).val(duration);
                $(that).trigger("change", [ duration ]);
            } else if(that.select_type == "date") {
                $(this).val(date_text);
                $(that).trigger("change", [ date_text ]);
            }
        };

        return config;
    },
};
