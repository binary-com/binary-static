var DatePicker = require('../date_picker').DatePicker;
var moment = require('moment');

DatePicker.SelectedDates = function(component_id, select_type) {
    this.component_id = component_id;
    this._super = new DatePicker(component_id, select_type);
    this.dates = [];

    var that = this;
    $(this._super).on('enter_pressed', function() {
        $(that).trigger('enter_pressed');
    });

    $(this._super).on('change', function(event, selected) {
        $(that).trigger('change', [selected]);
    });
};

DatePicker.SelectedDates.prototype = {
    show: function(dates) {
        this.dates = dates;
        this._super.create(this.config());
    },
    hide: function() {
        if ($('#' + this.component_id + '.hasDatepicker').length > 0)            {
            $('#' + this.component_id).datepicker('destroy');
        }
    },
    config: function() {
        var config = this._super.config();
        var that = this;
        config.beforeShowDay = function(date) {
            var lookup = moment.utc([date.getFullYear(), date.getMonth(), date.getDate()]).format('YYYY-MM-DD');
            if (that.dates.indexOf(lookup) >= 0) {
                return [1];
            }

            return [0];
        };

        config.beforeShow = function() {
            return { defaultDate: $('#' + that.component_id).val() };
        };

        return config;
    },
//    handlers: function() {
//        var handlers = {};
//        var that = this;
//        if (that.all_days_selectable) {
//            handlers.beforeShowDay = function(date) {
//                return [1];
//            }
//        } else if(that.today_selectable) {
//            handlers.beforeShowDay = function(date) {
//                if(new Date().toDateString() == date.toDateString()) {
//                    return [1];
//                } else {
//                    return [that.isTradingDay(date)];
//                }
//            }
//        } else {
//            handlers.beforeShowDay = function(date) {
//                return [that.isTradingDay(date)];
//            }
//        };
//
//        handlers.beforeShow = function(input, inst) {
//            that.hideToday(inst);
//            return { defaultDate: $('#duration_amount').val()};
//        };
//
//        handlers.onChangeMonthYear = function(year, month, inst) {
//            that.hideToday(inst);
//        };
//
//        return handlers;
//    },
//    isTradingDay: function(date) {
//        var year = date.getFullYear();
//        var underlying_symbol = this.underlying_symbol;
//        var form_name = this.form_name;
//
//        var cache_key = underlying_symbol + '-' + form_name;
//        varyy lookup = year + '-' + (date.getMonth()+1) + '-' + date.getDate();
//
//        if (typeof this.cache[cache_key] === 'undefined') {
//            var that = this;
//            $.ajax({
//                url: page.url.url_for('trade_get.cgi'),
//                data: { controller_action: 'trading_days',
//                        underlying_symbol: underlying_symbol,
//                        form_name: form_name
//                    },
//                success: function(trading_days) {
//                        that.cache[cache_key] = trading_days;
//                    },
//                dataType:'json',
//                async: false
//            });
//        }
//        return this.cache[cache_key][lookup];
//    },
//    hideToday: function(inst) {
//        window.setTimeout(function() {
//                $(inst.dpDiv).find('.ui-state-highlight').removeClass('ui-state-highlight');
//            }, 0);
//    },
//    localizations: function() {
//        var localizations = {};
//
//        localizations.monthNames = [page.text.localize('January'), page.text.localize('February'),
//          page.text.localize('March'), page.text.localize('April'), page.text.localize('May'),
//          page.text.localize('June'),page.text.localize('July'), page.text.localize('August'),
//          page.text.localize('September'), page.text.localize('October'), page.text.localize('November'),
//          page.text.localize('December') ];
//
//        localizations.monthNamesShort = [page.text.localize('Jan'), page.text.localize('Feb'),
//          page.text.localize('Mar'), page.text.localize('Apr'), page.text.localize('May'),
//          page.text.localize('Jun'), page.text.localize('Jul'), page.text.localize('Aug'),
//          page.text.localize('Sep'), page.text.localize('Oct'), page.text.localize('Nov'),
//          page.text.localize('Dec')];
//
//        localizations.dayNames = [page.text.localize('Sunday'), page.text.localize('Monday'),
//          page.text.localize('Tuesday'), page.text.localize('Wednesday'),
//          page.text.localize('Thursday'), page.text.localize('Friday'),
//          page.text.localize('Saturday')];
//
//        localizations.nextText = page.text.localize('Next');
//        localizations.prevText = page.text.localize('Previous');
//
//        return localizations;
//    },
};
