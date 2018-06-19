const moment           = require('moment');
const DatePicker       = require('../../components/date_picker');
const isJPClient       = require('../../base/client').isJPClient;
const dateValueChanged = require('../../../_common/common_functions').dateValueChanged;
const localize         = require('../../../_common/localize').localize;
const toISOFormat      = require('../../../_common/string_util').toISOFormat;

const getDatePickerValue = (selector) => {
    const val = $(selector).attr('data-value');
    return val ? moment.utc(val).unix() + ((isJPClient() ? 15 : 24) * (60 * 60)) : 0;
};

const getDateToFrom = () => {
    const date_to_val = $('#date_to').attr('data-value');
    let date_to,
        date_from;
    if (date_to_val) {
        date_to   = getDatePickerValue('#date_to');
        date_from = 0;
    }
    return {
        date_to,
        date_from,
    };
};

const attachDateToPicker = (fncOnChange) => {
    const id_date_to = '#date_to';
    const $date_to   = $(id_date_to);
    $date_to
        .attr('data-value', toISOFormat(moment.utc()))
        .change(function () {
            if (!dateValueChanged(this, 'date')) {
                return false;
            }
            $('.table-container').remove();
            if (typeof fncOnChange === 'function') {
                fncOnChange();
            }
            return true;
        });
    DatePicker.init({
        selector: id_date_to,
        maxDate : 0,
    });
    if ($date_to.attr('data-picker') !== 'native') $date_to.val(localize('Today'));
};

const attachDateRangePicker = (date_from_id, date_to_id, fncOnChange) => {
    const $date_from = $(date_from_id);
    const $date_to   = $(date_to_id);
    $date_from
        .change(function() {
            if (!dateValueChanged(this, 'date')) {
                return false;
            }
            if (typeof fncOnChange === 'function') {
                fncOnChange();
            }
            const date = new Date(this.getAttribute('data-value'));
            DatePicker.init({
                selector: date_to_id,
                minDate : new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`),
                maxDate : 0,
            });
            return true;
        });
    $date_to.attr('data-value', toISOFormat(moment.utc()));
    DatePicker.init({
        selector: date_from_id,
        maxDate : 0,
    });
    if ($date_from.attr('data-picker') !== 'native') $date_from.val(localize('Select date'));
    if ($date_to.attr('data-picker') !== 'native') $date_to.val(localize('Select date'));
};

module.exports = {
    attachDateToPicker,
    attachDateRangePicker,
    getDatePickerValue,
    getDateToFrom,
};
