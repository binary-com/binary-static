const DatePicker       = require('../../components/date_picker').DatePicker;
const toISOFormat      = require('../string_util').toISOFormat;
const dateValueChanged = require('../common_functions').dateValueChanged;
const moment           = require('moment');

function generateBirthDate() {
    const date_of_birth = '#date_of_birth';
    const datePickerInst = new DatePicker(date_of_birth);
    datePickerInst.hide();
    datePickerInst.show(-100 * 365, (-18 * 365) - 5, '', '', '-100:-18');
    $(date_of_birth)
        .attr('data-value', toISOFormat(moment()))
        .change(function() {
            return dateValueChanged(this, 'date');
        })
        .val('');
}

module.exports = {
    generateBirthDate: generateBirthDate,
};
