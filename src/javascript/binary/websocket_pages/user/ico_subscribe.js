const ICOPortfolio          = require('./ico_portfolio');
const BinarySocket          = require('../socket');
const BinaryPjax            = require('../../base/binary_pjax');
const Client                = require('../../base/client');
const localize              = require('../../base/localize').localize;
const defaultRedirectUrl    = require('../../base/url').defaultRedirectUrl;
const jpClient              = require('../../common_functions/country_base').jpClient;
const getDecimalPlaces      = require('../../common_functions/currency').getDecimalPlaces;
const onlyNumericOnKeypress = require('../../common_functions/event_handler');
const FormManager           = require('../../common_functions/form_manager');

const ICOSubscribe = (() => {
    const form_id = '#frm_ico_bid';
    let $form_error;

    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load(defaultRedirectUrl());
            return;
        }

        BinarySocket.wait('website_status').then((response) => {
            if (response.website_status.ico_status === 'closed') { // TODO: update property name and value once back-end is done
                $(form_id).replaceWith($('<p/>', { class: 'notice-msg center-text', text: localize('The ICO auction is already closed.') }));
                $('#ico_subscribe').setVisibility(1);
            } else {
                init();
            }
        });
    };

    const init = () => {
        BinarySocket.wait('balance').then(() => {
            const currency = Client.get('currency');
            if (!Client.get('currency') || +Client.get('balance') === 0) {
                $('#msg_no_balance').setVisibility(1);
            } else {
                $('#ico_subscribe').setVisibility(1);
                ICOPortfolio.onLoad();
                $('label[for="price"]').append(` ${currency}`);
                $(`${form_id} input`).on('keypress', onlyNumericOnKeypress);
                const decimal_places = getDecimalPlaces(currency);
                FormManager.init(form_id, [
                    { selector: '#duration', validations: ['req', ['number', { min: 1, max: 1000000 }]], parent_node: 'parameters' },
                    { selector: '#price',    validations: ['req', ['number', { type: 'float', decimals: `1, ${decimal_places}`, min: Math.pow(10, -decimal_places), max: 999999999999999 }]] },

                    { request_field: 'buy', value: 1 },
                    { request_field: 'amount',        parent_node: 'parameters', value: () => document.getElementById('price').value },
                    { request_field: 'contract_type', parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'symbol',        parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'basis',         parent_node: 'parameters', value: 'stake' },
                    { request_field: 'currency',      parent_node: 'parameters', value: currency },
                    { request_field: 'duration_unit', parent_node: 'parameters', value: 'c' },
                ]);
                $form_error = $('#form_error');
                FormManager.handleSubmit({
                    form_selector       : form_id,
                    enable_button       : 1,
                    fnc_response_handler: handleResponse,
                });
            }
        });
    };

    const handleResponse = (response) => {
        if (response.error) {
            $form_error.text(response.error.message).setVisibility(1);
        } else {
            $form_error.setVisibility(0);
            $('#duration, #price').val('');
            $.scrollTo($('#ico_bids'), 500, { offset: -10 });
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
