const SelectMatcher = require('@binary-com/binary-style').select2Matcher;
const Client = require('../../../../base/client');
const BinarySocket = require('../../../../base/socket');
const getElementById = require('../../../../../_common/common_functions').getElementById;
const makeOption = require('../../../../../_common/common_functions').makeOption;
const localize = require('../../../../../_common/localize').localize;

const AddressDetailForm = (() => {

    const init = async (fields) => {
        const text_fields = ['address_line_1', 'address_line_2', 'address_city', 'address_postcode'];
        fields.forEach(async field => {
            if (text_fields.includes(field.id)) {
                $(`#${field.id}`).text(field.default_value);
                $(`#${field.id}`)
                    .val(field.default_value) // Set value for validation
                    .attr({ 'data-force': true, 'data-value': field.default_value });
            }
            if (field.id === 'address_state') await initializeState(field);

            getElementById(`${field.section}_section`).setVisibility(1);
            getElementById(`${field.id}_row`).setVisibility(1);
        });
    };

    const initializeState = async (field) => {
        let $address_state = $('#address_state');
        const state_list = (await BinarySocket.send({ states_list: Client.get('residence') })).states_list;
        if (state_list && state_list.length > 0) {
            [{ text: localize('Please select'), value: '' }].concat(state_list).forEach((state) => {
                $address_state.append(makeOption({ text: state.text, value: state.value }));
            });
            if (field.default_value !== '') $address_state.val(field.default_value);
            $address_state.select2({
                matcher(params, data) {
                    return SelectMatcher(params, data);
                },
            });
        } else {
            $address_state.replaceWith($('<input/>',
                { id: 'address_state', name: 'address_state', type: 'text', maxlength: '35', 'data-lpignore': true }));
            $address_state = $('#address_state');
            if (field.default_value !== '') {
                const state_name = state_list.find(obj => obj.value === field.default_value).text;
                $address_state.text(state_name);
            }
        }
    };

    return {
        init,
    };

})();

module.exports = AddressDetailForm;
