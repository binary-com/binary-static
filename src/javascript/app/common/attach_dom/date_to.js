const moment           = require('moment');
const DatePicker       = require('../../components/date_picker');
const isJPClient       = require('../../base/client').isJPClient;
const dateValueChanged = require('../../../_common/common_functions').dateValueChanged;
const localize         = require('../../../_common/localize').localize;
const toISOFormat      = require('../../../_common/string_util').toISOFormat;
const toReadableFormat = require('../../../_common/string_util').toReadableFormat;

const id_date_to = '#date_to';
let $label;

const getDateToFrom = () => {
    const date_to_val = $('#date_to').attr('data-value');
    let date_to,
        date_from;
    if (date_to_val) {
        date_to   = moment.utc(date_to_val).unix() + ((isJPClient() ? 15 : 24) * (60 * 60));
        date_from = 0;
    }
    return {
        date_to,
        date_from,
    };
};

const attachDateToPicker = (fncOnChange) => {
    $label = $('#util_row').find('label');

    const $date_to = $(id_date_to);
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
            updateTooltip(moment.utc(this.getAttribute('data-value')));
            return true;
        });
    DatePicker.init({
        selector: id_date_to,
        maxDate : 0,
    });
    if ($date_to.attr('data-picker') !== 'native') $date_to.val(localize('Today'));
    updateTooltip(moment.utc());
};

const updateTooltip = (selected_date) => {
    $label.attr('data-balloon', localize('Data shows from [_1] in descending order.', [toReadableFormat(selected_date)]));
};

module.exports = {
    getDateToFrom,
    attachDateToPicker,
};
