const SelectMatcher     = require('@binary-com/binary-style').select2Matcher;
const moment            = require('moment');
const Client            = require('../../../../base/client');
const generateBirthDate = require('../../../../../app/common/attach_dom/birth_date_picker');
const BinarySocket      = require('../../../../base/socket');
const localize          = require('../../../../../_common/localize').localize;
const getElementById    = require('../../../../../_common/common_functions').getElementById;
const makeOption        = require('../../../../../_common/common_functions').makeOption;
const State             = require('../../../../../_common/storage').State;
const toISOFormat       = require('../../../../../_common/string_util').toISOFormat;
const toReadableFormat  = require('../../../../../_common/string_util').toReadableFormat;

const PersonalDetailForm = (() => {

    const init = async (fields) => {
        const residence_list = (await BinarySocket.wait('residence_list')).residence_list;
        const client_residence = Client.get('residence') || '';
        const landing_company = State.getResponse('landing_company');

        const $options = $('<div/>');
        residence_list.forEach((residence) => {
            $options.append(makeOption({ text: residence.text, value: residence.value }));
        });

        if (fields.some(field => field.id === 'salutation')) getElementById('name_section_legend').innerHTML = localize('Title and name');

        const residence_select_fields = ['place_of_birth', 'citizen', 'tax_residence'];
        const simple_select_fields = ['salutation', 'account_opening_reason'];
        const text_fields = ['first_name', 'last_name', 'tax_identification_number'];

        fields.forEach(field => {
            if (residence_select_fields.includes(field.id)) {
                if (field.is_immutable && field.default_value !== '') {
                    const country_name = residence_list.find(obj => obj.value === field.default_value).text;
                    $(`#${field.id}`).replaceWith($('<span/>', { id: field.id, text: country_name, 'data-value': field.default_value }));
                } else {
                    $(`#${field.id}`).html($options.html()).val(field.default_value);
                    $(`#${field.id}`).select2({
                        matcher(params, data) {
                            return SelectMatcher(params, data);
                        },
                    });
                }
            }
            if (simple_select_fields.includes(field.id)) {
                $(`#${field.id}`).addClass('center-select-m').val(field.default_value);
            }
            if (text_fields.includes(field.id)) {
                $(`#${field.id}`).text(field.default_value);
                $(`#${field.id}`)
                    .val(field.default_value) // Set value for validation
                    .attr({ 'data-force': true, 'data-value': field.default_value });
            }
            if (field.id === 'date_of_birth') {
                generateBirthDate(landing_company.minimum_age);
                if (field.default_value !== '') {
                    const dob_moment_object = moment.unix(field.default_value);
                    $(`#${field.id}`)
                        .attr('data-value', toISOFormat(dob_moment_object))
                        .val(toReadableFormat(dob_moment_object));
                }
            }
            if (field.id === 'phone') {
                const residence_phone_idd =
                    residence_list.find(residence => residence.value === client_residence).phone_idd;
                $(`#${field.id}`).val(field.default_value !== '' ? field.default_value : `+${residence_phone_idd}`);
            }
            getElementById(`${field.section}_section`).setVisibility(1);
            getElementById(`${field.id}_row`).setVisibility(1);
            if (field.is_immutable && field.default_value !== '') $(`#${field.id}`).attr('disabled', 'disabled');
        });
    };

    return {
        init,
    };
})();

module.exports = PersonalDetailForm;
