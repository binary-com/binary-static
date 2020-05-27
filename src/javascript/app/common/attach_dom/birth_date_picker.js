const moment           = require('moment');
const DatePicker       = require('../../components/date_picker');
const dateValueChanged = require('../../../_common/common_functions').dateValueChanged;
const toISOFormat      = require('../../../_common/string_util').toISOFormat;

const generateBirthDate = (min_age) => {
    const date_of_birth = '#date_of_birth';

    if (!$(date_of_birth).val()) {
        DatePicker.init({
            selector : date_of_birth,
            minDate  : -100 * 365,
            maxDate  : (-min_age * 365) - Math.trunc(min_age / 4) - 1,
            yearRange: '-100:-18',
        });
        $(date_of_birth)
            .attr('data-value', toISOFormat(moment()))
            .change(function () {
                return dateValueChanged(this, 'date');
            })
            .val('');
    }
};

module.exports = generateBirthDate;
