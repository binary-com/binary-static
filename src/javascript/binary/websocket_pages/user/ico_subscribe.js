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
const getLanguage           = require('../../base/language').get;
const Url                   = require('../../base/url');

const ICOSubscribe = (() => {
    const form_id = '#frm_ico_bid';
    let currency,
        min_bid,
        unit_price,
        min_bid_usd,
        $form_error,
        $duration,
        $price,
        $total;

    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        const language = (getLanguage() || '').toLowerCase();
        const image = language.match(/(ru|id|pt)/gi)
            ? Url.urlForStatic(`images/pages/ico/auction-${language}.svg`)
            : Url.urlForStatic('images/pages/ico/auction.svg');
        // Set image based on language.
        $('.ico-auction')
            .off('error')
            .on('error', function () {
                // Just in case of error.
                $(this).attr('src',
                    Url.urlForStatic('images/pages/ico/auction.svg'));
            })
            .attr('src', image);

        BinarySocket.wait('ico_status', 'landing_company', 'get_settings', 'get_account_status').then(() => {
            if (State.getResponse('ico_status.ico_status') === 'closed') {
                $(form_id).replaceWith($('<p/>', { class: 'notice-msg center-text', text: localize('The ICO is currently unavailable.') }));
                ICOcountDown();
                ICOPortfolio.onLoad();
                showContent();
            } else {
                init();
            }
        });
        const ico_req = {
            ico_status: 1,
            currency  : Client.get('currency') || 'USD',
            subscribe : 1,
        };
        // get update on client currency.
        BinarySocket.send(ico_req, {callback: updateMinimumBid});
    };

    const init = () => {
        BinarySocket.wait('balance').then((response) => {
            ICOPortfolio.onLoad();
            $('#view_ico_info').setVisibility(1);
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
            const to_show = showContent();
            if (to_show !== 'ico_subscribe') {
                return;
            }

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
                    { selector: '#duration', validations: ['req', ['number', { min: 25, max: 10000000 }]], parent_node: 'parameters' },
                    { selector: '#price',    validations: ['req', ['number', { type: 'float', decimals: `1, ${decimal_places}`, min: Math.pow(10, -decimal_places).toFixed(decimal_places) }]] },

                    { request_field: 'buy', value: 1 },
                    { request_field: 'amount',        parent_node: 'parameters', value: () => document.getElementById('price').value },
                    { request_field: 'contract_type', parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'symbol',        parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'basis',         parent_node: 'parameters', value: 'stake' },
                    { request_field: 'currency',      parent_node: 'parameters', value: currency },
                    { request_field: 'duration_unit', parent_node: 'parameters', value: 'c' },
                ]);
                if (+State.getResponse('website_status.ico_info.final_price') === 0) {
                    $(form_id)
                        .on('submit', (evt) => { evt.preventDefault(); })
                        .find('button').addClass('inactive');
                } else {
                    FormManager.handleSubmit({
                        form_selector       : form_id,
                        enable_button       : 1,
                        fnc_response_handler: handleResponse,
                    });
                }
                $(`${form_id} input`).on('keypress', onlyNumericOnKeypress)
                    .on('input change', calculateTotal);
            }
        });
    };

    const calculateTotal = () => {
        const duration_val = $duration.val();
        const price_val    = $price.val();
        let total          = 0;
        let usd_total      = 0;
        if (duration_val && price_val) {
            total = +duration_val * +price_val;
        }
        let content = `${formatMoney(currency, total)}`;
        if(unit_price && unit_price < Infinity) {
            usd_total = +unit_price * total;
            content   = `${content} / ${formatMoney('USD', usd_total)}`;
        }
        $total.html(content);
        if (!$form_error) $form_error = $('#form_error');
        $form_error.setVisibility(0);
    };

    const ICOcountDown = () => {
        const timer = $('.timer');
        const days = timer.find('.time .days');
        const hours = timer.find('.time .hours');
        const minutes = timer.find('.time .minutes');
        const seconds = timer.find('.time .seconds');
        const timerID = window.setInterval(() => {
            const start_time = 1510704000;
            const current_time = window.time.unix();
            const time_left = start_time - current_time;
            if(time_left >= 0) {
                const s = (`0${  time_left % 60}`).slice(-2);
                const m = (`0${  Math.floor(time_left/ 60) % 60}`).slice(-2);
                const h = (`0${  Math.floor(time_left / 3600) % 24}`).slice(-2);
                const d = (`0${  Math.floor(time_left / (3600 * 24))}`).slice(-2);
                days.text(d);
                hours.text(h);
                minutes.text(m);
                seconds.text(s);
                timer.setVisibility(1); // Make the timer visible.
                // Force reload in case some-one's on the page and watching the timer.
                if(time_left === 0) {
                    setTimeout(() => window.location.reload(), 500);
                }
            } else {
                window.clearInterval(timerID);
            }
        }, 1000);
    };

    const handleResponse = (response) => {
        if (response.error) {
            $form_error.text(response.error.message).setVisibility(1);
        } else {
            $form_error.setVisibility(0);
            $('#duration, #price').val('');
            $.scrollTo($('#ico_bids'), 500, { offset: -10 });
            calculateTotal();
        }
    };

    const showContent = () => {
        $('#view_ico_info').setVisibility(1);
        let to_show = 'feature_not_allowed';
        if (Client.get('landing_company_shortcode') === 'costarica') {
            if(/au|ca|ch|nz|sg/.test(Client.get('residence'))
                && !/professional_requested|professional/.test(State.getResponse('get_account_status.status'))) {
                to_show = 'ico_professional_message';
            } else {
                to_show = 'ico_subscribe';
            }
        } else if (Client.hasCostaricaAccount()) {
            to_show = 'ico_account_message';
        } else if (Client.canOpenICO() || Client.canUpgradeVirtualToReal(State.getResponse('landing_company'))) {
            if(Client.isAccountOfType('virtual') && (Client.hasAccountType('gaming')
                || Client.hasAccountType('financial') || Client.hasAccountType('real'))){
                to_show = 'ico_virtual_message';
            } else {
                to_show = 'ico_new_account_message';
                let message_show = 'message_common';
                const landing_company = (Client.currentLandingCompany() || {}).shortcode;
                // Show message to user based on landing_company
                if(/^malta$/.test(landing_company)) {
                    message_show = 'message_gaming';
                } else if(/^maltainvest$/.test(landing_company)) {
                    message_show = 'message_financial';
                } else if (/^iom$/.test(landing_company)) {
                    message_show = 'message_iom';
                }

                // Check if user has account_opening_reason
                if(!State.getResponse('get_settings.account_opening_reason')
                    && !Client.isAccountOfType('virtual')) {
                    askForAccountOpeningReason();
                }

                // Show message to client.
                document.getElementById(message_show).setVisibility(1);

                const button_new_account = document.getElementById('ico_new_account');
                if (button_new_account) {
                    button_new_account.removeEventListener('click', newAccountOnClick);
                    button_new_account.addEventListener('click', newAccountOnClick);
                }
            }
        }
        const el_to_show = document.getElementById(to_show);
        if (el_to_show) {
            el_to_show.setVisibility(1);
        }
        return to_show;
    };

    const newAccountOnClick = () => {
        const el_account_opening_reason = document.getElementById('account_opening_reason');
        const el_error = document.getElementById('new_account_error');
        if (Client.hasAccountType('real')) {
            BinarySocket.wait('get_settings').then((response) => {
                const req = populateReq(response.get_settings);

                // Check if client has account_opening_reason set.
                if($(el_account_opening_reason).is(':visible') && !req.account_opening_reason) {
                    const value = el_account_opening_reason.value;
                    if(value) {
                        req.account_opening_reason = value;
                    } else {
                        el_error.setVisibility(1).textContent = localize('Please select a value for account_opening_reason.');
                        return;
                    }
                }

                BinarySocket.send(req).then((response_new_account_real) => {
                    if (response_new_account_real.error) {
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

    const askForAccountOpeningReason = () => {
        const el_to_show = document.getElementById('row_account_opening_reason');
        el_to_show.setVisibility(1);
    };

    const updateMinimumBid = (ico_status) => {
        const status      = ico_status.ico_status || {};
        const el_min_bid  = document.getElementById('minimum_bid');
        const res_currency    = (status.currency || '').toUpperCase();
        min_bid     = status.minimum_bid || 0;
        min_bid_usd = status.minimum_bid_usd || 1.35;
        unit_price = min_bid_usd/min_bid;
        let text = `${localize('Minimum bid')} = ${formatMoney('USD', min_bid_usd)}`; // Fallback value.
        // Show bid in client currency.
        if(min_bid_usd && min_bid && res_currency && res_currency !== 'USD'){
            text = `${localize('Minimum bid')} = ${formatMoney(res_currency, min_bid)} / ${formatMoney('USD', min_bid_usd)}`;
        }
        el_min_bid.innerHTML = text;
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
