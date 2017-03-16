const moment           = require('moment');
const checkInput       = require('../common_functions/common_functions').checkInput;
const toReadableFormat = require('../common_functions/string_util').toReadableFormat;
const localize         = require('../base/localize').localize;

const DatePicker = function(component_selector, select_type) {
    this.component_selector = component_selector;
    this.select_type = (typeof select_type === 'undefined') ? 'date' : select_type;

    this.localizations = {};
    this.localizations.monthNames = localize(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);

    this.localizations.monthNamesShort = localize(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    this.localizations.dayNames = localize(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

    this.localizations.dayNamesMin = localize(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

    this.localizations.nextText = localize('Next');
    this.localizations.prevText = localize('Previous');
};

DatePicker.prototype = {
    show: function(options) {
        this.checkWidth(this.config(options), this.component_selector, this);
        const that = this;
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
        const that = this;
        $(this.component_selector).keydown(function(e) {
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
    config: function(options) {
        const today = new Date();

        if (options.additional) {
            this.setValue = options.additional.setValue;
            this.noNative = !options.additional.native;
            delete options.additional;
        }

        let config = {
            dateFormat     : 'dd M, yy',
            monthNames     : this.localizations.monthNames,
            monthNamesShort: this.localizations.monthNamesShort,
            dayNames       : this.localizations.dayNames,
            dayNamesMin    : this.localizations.dayNamesMin,
            nextText       : this.localizations.nextText,
            prevText       : this.localizations.prevText,
            changeMonth    : true,
            changeYear     : true,
        };

        config = $.extend(config, options);

        const set_date = (date) => {
            let new_date;
            if (typeof options[date] === 'number') {
                new_date = new Date();
                new_date.setDate(today.getDate() + Number(options[date]));
            }
            config[date] = new_date || date;
        };

        if (options.minDate) {
            if (options.minDate === 'today') {
                config.minDate = today;
            } else {
                set_date('minDate');
            }
        }

        if (options.maxDate) {
            set_date('maxDate');
        }

        const that = this;
        config.onSelect = function(date_text) {
            const day = date_text.split(' ')[0],
                month = ('0' + (Number($('.ui-datepicker-month').val()) + 1)).slice(-2),
                year = $('.ui-datepicker-year').val(),
                date = [year, month, day].join('-'),
                oldValue = $(this).attr('data-value');

            $(this).attr('data-value', date);
            if (that.select_type === 'diff') {
                const today_utc = moment.utc();
                const selected_date = moment.utc(date + ' 23:59:59');
                const duration  = selected_date.diff(today_utc, 'days');
                $(this).val(duration);
                if (oldValue && oldValue === date) return false;
                $(that.component_selector).trigger('change', [duration]);
            } else if (that.select_type === 'date') {
                if (that.setValue === 'attr') {
                    $(this).val('');
                } else {
                    $(this).val(date_text);
                }
                if (oldValue && oldValue === date) return false;
                $(that.component_selector).trigger('change', [date_text]);
            }
            return true;
        };

        this.config_data = config;

        return config;
    },
    getDate: function(date) {
        const year = date.getFullYear(),
            month = ('0' + (date.getMonth() + 1)).slice(-2),
            day = ('0' + date.getDate()).slice(-2);
        return (year + '-' + month + '-' + day);
    },
    checkWidth: function(config, component_selector, that) {
        const $selector = $(component_selector);
        if ($(window).width() < 770 && that.noNative) {
            that.hide($selector);
            $selector.attr('type', 'number');
        } else if ($(window).width() < 770 &&
                    checkInput('date', 'not-a-date') &&
                    $selector.attr('data-picker') !== 'native' &&
                    !that.noNative) {
            that.hide($selector);
            $selector.attr({ type: 'date', 'data-picker': 'native' })
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
        } else if (
            ($(window).width() > 769 && $selector.attr('data-picker') !== 'jquery') ||
            ($(window).width() < 770 && !checkInput('date', 'not-a-date'))
        ) {
            const value = $selector.attr('data-value'),
                format_value = value && that.select_type === 'date' ? toReadableFormat(moment(value)) : $selector.val();
            $selector.attr({ type: 'text', 'data-picker': 'jquery' })
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
