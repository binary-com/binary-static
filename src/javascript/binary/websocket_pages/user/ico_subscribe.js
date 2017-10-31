const moment                = require('moment');
const ICOPortfolio          = require('./ico_portfolio');
const BinarySocket          = require('../socket');
const BinaryPjax            = require('../../base/binary_pjax');
const Client                = require('../../base/client');
const localize              = require('../../base/localize').localize;
const State                 = require('../../base/storage').State;
const urlFor                = require('../../base/url').urlFor;
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
                showContent();
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
            $price    = $('#price');
            $total    = $('#total');
            calculateTotal();
            showContent();

            const balance = response.balance.balance;
            if (+balance === 0) {
                $(`${form_id} input`).attr('disabled', 'disabled');
                $(form_id)
                    .on('submit', (evt) => { evt.preventDefault(); })
                    .find('button').addClass('inactive');
                $('#topup_wrapper').setVisibility(1);
            } else {
                const decimal_places = getDecimalPlaces(currency);
                $form_error          = $('#form_error');
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
        const price_val    = $price.val();
        let total          = 0;
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

    const showContent = () => {
        BinarySocket.wait('landing_company').then((response) => {
            let to_show = 'feature_not_allowed';
            if (Client.get('landing_company_shortcode') === 'costarica') {
                to_show = 'ico_subscribe';
            } else if (Client.hasCostaricaAccount()) {
                to_show = 'ico_account_message';
            } else if (Client.canOpenICO() || Client.canUpgradeVirtualToReal(response.landing_company)) {
                to_show = 'ico_new_account_message';
                const button_new_account = document.getElementById('ico_new_account');
                if (button_new_account) {
                    button_new_account.removeEventListener('click', newAccountOnClick);
                    button_new_account.addEventListener('click', newAccountOnClick);
                }
            }
            const el_to_show = document.getElementById(to_show);
            if (el_to_show) {
                el_to_show.setVisibility(1);
            }
        });
    };

    const newAccountOnClick = () => {
        if (Client.hasAccountType('real')) {
            BinarySocket.wait('get_settings').then((response) => {
                BinarySocket.send(populateReq(response.get_settings)).then((response_new_account_real) => {
                    if (response_new_account_real.error) {
                        const el_error = document.getElementById('new_account_error');
                        if (el_error) {
                            el_error.setVisibility(1).textContent = response_new_account_real.error.message;
                        }
                    } else {
                        localStorage.setItem('is_new_account', 1);
                        Client.processNewAccount({
                            email       : Client.get('email'),
                            loginid     : response_new_account_real.new_account_real.client_id,
                            token       : response_new_account_real.new_account_real.oauth_token,
                            redirect_url: urlFor('user/set-currency'),
                        });
                    }
                });
            });
        } else {
            BinaryPjax.load(urlFor('new_account/realws') + (Client.canUpgradeVirtualToReal(State.getResponse('landing_company')) ? '' : '#ico'));
        }
    };

    const populateReq = (get_settings) => {
        const dob = moment(+get_settings.date_of_birth * 1000).format('YYYY-MM-DD');
        const req = {
            new_account_real      : 1,
            account_type          : 'ico',
            date_of_birth         : dob,
            salutation            : get_settings.salutation,
            first_name            : get_settings.first_name,
            last_name             : get_settings.last_name,
            address_line_1        : get_settings.address_line_1,
            address_line_2        : get_settings.address_line_2,
            address_city          : get_settings.address_city,
            address_state         : get_settings.address_state,
            address_postcode      : get_settings.address_postcode,
            phone                 : get_settings.phone,
            account_opening_reason: get_settings.account_opening_reason,
            residence             : Client.get('residence'),
        };
        if (get_settings.tax_identification_number) {
            req.tax_identification_number = get_settings.tax_identification_number;
        }
        if (get_settings.tax_residence) {
            req.tax_residence = get_settings.tax_residence;
        }
        return req;
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
