var moment      = require('moment');
var checkInput  = require('../common_functions/common_functions').checkInput;
var toReadableFormat = require('../common_functions/string_util').toReadableFormat;

var DatePicker = function(component_selector, select_type) {
    this.component_selector = component_selector;
    this.select_type = (typeof select_type === "undefined") ? "date" : select_type;

    this.localizations = {};
    this.localizations.monthNames = [page.text.localize('January'), page.text.localize('February'), page.text.localize('March'), page.text.localize('April'), page.text.localize('May'), page.text.localize('June'),page.text.localize('July'), page.text.localize('August'), page.text.localize('September'), page.text.localize('October'), page.text.localize('November'), page.text.localize('December') ];

    this.localizations.monthNamesShort = [page.text.localize('Jan'), page.text.localize('Feb'), page.text.localize('Mar'), page.text.localize('Apr'), page.text.localize('May'), page.text.localize('Jun'), page.text.localize('Jul'), page.text.localize('Aug'), page.text.localize('Sep'), page.text.localize('Oct'), page.text.localize('Nov'), page.text.localize('Dec')];

    this.localizations.dayNames = [page.text.localize('Sunday'), page.text.localize('Monday'), page.text.localize('Tuesday'), page.text.localize('Wednesday'), page.text.localize('Thursday'), page.text.localize('Friday'), page.text.localize('Saturday')];

    this.localizations.dayNamesMin = [page.text.localize('Su'), page.text.localize('Mo'), page.text.localize('Tu'), page.text.localize('We'), page.text.localize('Th'), page.text.localize('Fr'), page.text.localize('Sa')];

    this.localizations.nextText = page.text.localize('Next');
    this.localizations.prevText = page.text.localize('Previous');
};

DatePicker.prototype = {
    show: function(min_day, max_days, setValue, noNative) {
        this.checkWidth(this.config(min_day, max_days, setValue, noNative), this.component_selector, this);
        var that = this;
        $(window).resize(function() { that.checkWidth(that.config_data, that.component_selector, that); });
    },
    hide: function() {
        if ($(this.component_selector + '.hasDatepicker').length > 0) {
            $(this.component_selector).datepicker('destroy')
                                      .removeAttr('data-picker');
        }
        $(this.component_selector).off('keydown');
    },
    create: function(config) {
        var that = this;
        $(this.component_selector).keydown(function(e) {
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
    config: function(min_day, max_days, setValue, noNative) {
        var today = new Date();

        var config = {
            dateFormat: 'dd M, yy',
            monthNames: this.localizations.monthNames,
            monthNamesShort: this.localizations.monthNamesShort,
            dayNames: this.localizations.dayNames,
            dayNamesMin: this.localizations.dayNamesMin,
            nextText: this.localizations.nextText,
            prevText: this.localizations.prevText,
            changeMonth: true,
            changeYear: true,
        };

        if (min_day) {
            config.minDate = min_day === 'today' ? today : min_day;
        }

        if (max_days) {
            max_days = (typeof max_days == "undefined") ? 365 : max_days;
            var next_year = new Date();
            next_year.setDate(today.getDate() + Number(max_days));
            config.maxDate = next_year;
        }

        this.setValue = setValue;
        this.noNative = noNative;

        var that = this;
        config.onSelect = function(date_text) {
            var day = date_text.split(' ')[0],
                month = ('0' + (Number($('.ui-datepicker-month').val()) + 1)).slice(-2),
                year = $('.ui-datepicker-year').val(),
                date = [year, month, day].join('-'),
                oldValue = $(this).attr('data-value');

            $(this).attr('data-value', date);
            if(that.select_type == "diff") {
                var today = moment.utc();
                var selected_date = moment.utc(date + " 23:59:59");
                var duration  = selected_date.diff(today, 'days');
                $(this).val(duration);
                if (oldValue && oldValue === date) return false;
                $(that.component_selector).trigger("change", [ duration ]);
            } else if(that.select_type == "date") {
                if (that.setValue == "attr") {
                    $(this).val('');
                } else {
                    $(this).val(date_text);
                }
                if (oldValue && oldValue === date) return false;
                $(that.component_selector).trigger("change", [ date_text ]);
            }
        };

        this.config_data = config;

        return config;
    },
    getDate: function(date) {
        var year = date.getFullYear(),
            month = ('0' + (date.getMonth() + 1)).slice(-2),
            day = ('0' + date.getDate()).slice(-2);
        return (year + '-' + month + '-' + day);
    },
    checkWidth: function(config, component_selector, that) {
        var $selector = $(component_selector);
        if ($(window).width() < 770 && that.noNative) {
            that.hide($selector);
            $selector.attr('type', 'number');
        } else if ($(window).width() < 770 &&
                    checkInput('date', 'not-a-date') &&
                    $selector.attr('data-picker') !== 'native' &&
                    !that.noNative) {

            that.hide($selector);
            $selector.attr({type: 'date', 'data-picker': 'native'})
                     .val($selector.attr('data-value'));
            if ($selector.attr('readonly')) {
                $selector.attr('data-readonly', 'readonly')
                         .removeAttr('readonly');
            }
            if (config.minDate) {
                $selector.attr('min', that.getDate(config.minDate));
            }
            if (config.maxDate) {
                $selector.attr('max', that.getDate(config.maxDate));
            }
        } else if (($(window).width() > 769 && $selector.attr('data-picker') !== 'jquery') ||
                    $(window).width() < 770 && !checkInput('date', 'not-a-date')) {
            var value = $selector.attr('data-value'),
                format_value = value && that.select_type === 'date' ? toReadableFormat(moment(value)) : $selector.val();
            $selector.attr({'type': 'text', 'data-picker': 'jquery'})
                     .removeAttr('min')
                     .removeAttr('max')
                     .val(format_value);
            if ($selector.attr('data-readonly')) {
                $selector.attr('readonly', 'readonly')
                         .removeAttr('data-readonly');
            }
            that.create(config);
        }
    },
};

module.exports = {
    DatePicker: DatePicker,
};
