const ICOPortfolio          = require('./ico_portfolio');
const BinarySocket          = require('../socket');
const Client                = require('../../base/client');
const onlyNumericOnKeypress = require('../../common_functions/event_handler');
const FormManager           = require('../../common_functions/form_manager');

const ICOSubscribe = (() => {
    let $form_error;

    const onLoad = () => {
        BinarySocket.wait('get_account_status').then((response) => {
            const authenticated = /authenticated/.test(response.get_account_status.status);
            if (!Client.get('currency') || +Client.get('balance') === 0) {
                $('#msg_no_balance').setVisibility(1);
            } else if (authenticated) {
                $('#ico_subscribe').setVisibility(1);
                ICOPortfolio.onLoad();
                const form_id = '#frm_ico_bid';
                $('label[for="price"]').append(` ${Client.get('currency')}`);
                $(`${form_id} input`).on('keypress', onlyNumericOnKeypress);
                FormManager.init(form_id, [
                    { selector: '#duration', validations: ['req', ['number', { min: 1 }]], parent_node: 'parameters' },
                    { selector: '#price',    validations: ['req', ['number', { type: 'float', decimals: '1, 2' }]] },

                    { request_field: 'buy', value: 1 },
                    { request_field: 'amount',        parent_node: 'parameters', value: () => document.getElementById('price').value },
                    { request_field: 'contract_type', parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'symbol',        parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'basis',         parent_node: 'parameters', value: 'stake' },
                    { request_field: 'currency',      parent_node: 'parameters', value: Client.get('currency') },
                    { request_field: 'duration_unit', parent_node: 'parameters', value: 'c' },
                ]);
                $form_error = $('#form_error');
                FormManager.handleSubmit({
                    form_selector       : form_id,
                    enable_button       : 1,
                    fnc_response_handler: handleResponse,
                });
            } else {
                $('#msg_authenticate').setVisibility(1);
            }
        });
    };

    const handleResponse = (response) => {
        $form_error.setVisibility(0);
        if (response.error) {
            $form_error.text(response.error.message).setVisibility(1);
        }
    };

    const onUnload = () => {
        ICOPortfolio.onUnload();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = ICOSubscribe;
