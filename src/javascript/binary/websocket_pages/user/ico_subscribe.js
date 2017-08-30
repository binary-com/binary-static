const ICOPortfolio          = require('./ico_portfolio');
const BinarySocket          = require('../socket');
const BinaryPjax            = require('../../base/binary_pjax');
const Client                = require('../../base/client');
const localize              = require('../../base/localize').localize;
const jpClient              = require('../../common_functions/country_base').jpClient;
const getDecimalPlaces      = require('../../common_functions/currency').getDecimalPlaces;
const formatMoney           = require('../../common_functions/currency').formatMoney;
const onlyNumericOnKeypress = require('../../common_functions/event_handler');
const FormManager           = require('../../common_functions/form_manager');

const ICOSubscribe = (() => {
    const form_id = '#frm_ico_bid';
    let currency,
        $form_error,
        $duration,
        $price,
        $total;

    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        BinarySocket.wait('website_status').then((response) => {
            if (response.website_status.ico_status === 'closed') {
                $(form_id).replaceWith($('<p/>', { class: 'notice-msg center-text', text: localize('The ICO auction is already closed.') }));
                ICOPortfolio.onLoad();
                $('#ico_subscribe').setVisibility(1);
            } else {
                init();
            }
        });
    };

    const init = () => {
        BinarySocket.wait('balance').then((response) => {
            ICOPortfolio.onLoad();
            currency = Client.get('currency') || '';
            if (currency) {
                $('.currency').text(currency);
            } else {
                $(form_id).find('.topMenuBalance').html(formatMoney(currency, 0));
            }
            $duration = $('#duration');
            $price = $('#price');
            $total = $('#total');
            calculateTotal();
            $('#ico_subscribe').setVisibility(1);

            const balance = response.balance.balance;
            if (+balance === 0) {
                $(`${form_id} input`).attr('disabled', 'disabled');
                $(form_id)
                    .on('submit', (evt) => { evt.preventDefault(); })
                    .find('button').addClass('inactive');
                $('#topup_wrapper').setVisibility(1);
            } else {
                const decimal_places = getDecimalPlaces(currency);
                $form_error = $('#form_error');
                FormManager.init(form_id, [
                    { selector: '#duration', validations: ['req', ['number', { min: 1, max: 1000000 }]], parent_node: 'parameters' },
                        { selector: '#price',    validations: ['req', ['number', { type: 'float', decimals: `1, ${decimal_places}`, min: Math.pow(10, -decimal_places).toFixed(decimal_places), max: 999999999999999 }]] },

                    { request_field: 'buy', value: 1 },
                    { request_field: 'amount',        parent_node: 'parameters', value: () => document.getElementById('price').value },
                    { request_field: 'contract_type', parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'symbol',        parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'basis',         parent_node: 'parameters', value: 'stake' },
                    { request_field: 'currency',      parent_node: 'parameters', value: currency },
                    { request_field: 'duration_unit', parent_node: 'parameters', value: 'c' },
                ]);
                FormManager.handleSubmit({
                    form_selector       : form_id,
                    enable_button       : 1,
                    fnc_response_handler: handleResponse,
                });
                $(`${form_id} input`).on('keypress', onlyNumericOnKeypress)
                    .on('input change', calculateTotal);
            }
        });
    };

    const calculateTotal = () => {
        const duration_val = $duration.val();
        const price_val = $price.val();
        let total = 0;
        if (duration_val && price_val) {
            total = +duration_val * +price_val;
        }
        $total.html(formatMoney(currency, total));
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
        onLoad,
        onUnload,
    };
})();

module.exports = ICOSubscribe;
