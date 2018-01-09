const ICOPortfolio          = require('./ico_portfolio');
const BinaryPjax            = require('../../base/binary_pjax');
const Client                = require('../../base/client');
const BinarySocket          = require('../../base/socket');
const jpClient              = require('../../common/country_base').jpClient;
const getDecimalPlaces      = require('../../common/currency').getDecimalPlaces;
const formatMoney           = require('../../common/currency').formatMoney;
const onlyNumericOnKeypress = require('../../common/event_handler');
const FormManager           = require('../../common/form_manager');
const getElementById        = require('../../../_common/common_functions').getElementById;
const getLanguage           = require('../../../_common/language').get;
const localize              = require('../../../_common/localize').localize;
const State                 = require('../../../_common/storage').State;
const Url                   = require('../../../_common/url');

const ICOSubscribe = (() => {
    const form_id = '#frm_ico_bid';
    let currency,
        min_bid,
        unit_price,
        min_bid_usd,
        initial_deposit_percent,
        $form_error,
        $duration,
        $price,
        $total,
        $price_per_unit,
        $payable_amount;

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
            const ico_status = State.getResponse('ico_status');

            if (ico_status.ico_status === 'closed') {
                let notice_msg = '';
                $('.ico-ended-hide').remove();
                if (ico_status.is_claim_allowed && +ico_status.final_price) {
                    const curr  = (Client.get('currency') || 'USD').toUpperCase();
                    const price_str = `${curr !=='USD' ? `${formatMoney(curr, ico_status.final_price)} / ` : ''}${formatMoney('USD', ico_status.final_price_usd)}`;
                    notice_msg = localize(`Thank you for participating in our ICO. The final price of the tokens has been set at ${price_str} per token. Investors must deposit the balance owed on each successful bid based on the final price by 8 January 2018. You can proceed to claim the tokens with no remaining balance.`);
                } else {
                    notice_msg = localize('The auction has ended. As the minimum target was not reached, all investors will receive a refund on their active bids.');
                }

                $(form_id).replaceWith($('<p/>', {class: 'notice-msg center-text', html: notice_msg}));
                ICOPortfolio.onLoad();
                showContent();
            } else {
                initial_deposit_percent = +(State.getResponse('ico_status.initial_deposit_percentage'));
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
            currency = Client.get('currency') || '';
            if (currency) {
                $('.currency').text(currency);
            } else {
                $(form_id).find('.topMenuBalance').html(formatMoney(currency, 0));
            }
            $duration       = $('#duration');
            $price          = $('#price');
            $total          = $('#total');
            $price_per_unit = $('#price_unit');
            $payable_amount = $('#payable_amount');

            // Set initial_deposit_percentage
            $('.initial_deposit_percent').text(initial_deposit_percent);

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
                    { selector: '#duration', validations: ['req', ['number', { min: 25, max: 10000000 }]], parent_node: 'parameters', no_scroll: 1 },
                    { selector: '#price',    validations: ['req', ['number', { type: 'float', decimals: decimal_places, min: Math.pow(10, -decimal_places).toFixed(decimal_places) }]], no_scroll: 1 },

                    { request_field: 'buy', value: 1 },
                    { request_field: 'amount',        parent_node: 'parameters', value: () => getElementById('price').value },
                    { request_field: 'contract_type', parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'symbol',        parent_node: 'parameters', value: 'BINARYICO' },
                    { request_field: 'basis',         parent_node: 'parameters', value: 'stake' },
                    { request_field: 'currency',      parent_node: 'parameters', value: currency },
                    { request_field: 'duration_unit', parent_node: 'parameters', value: 'c' },
                ]);
                if (+State.getResponse('ico_status.final_price') === 0) {
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
        const deposit_factor = initial_deposit_percent/100;
        if (duration_val && price_val) {
            total = +duration_val * +price_val;
        }
        let content                = `${formatMoney(currency, total)}`;
        let content_unit_price     = `${formatMoney(currency, +price_val)}`;
        let content_payable_amount = `${formatMoney(currency, total * deposit_factor)}`;
        if (unit_price && unit_price < Infinity && currency.toUpperCase() !== 'USD') {
            usd_total          = +unit_price * total;
            content            = `${content} / ${formatMoney('USD', usd_total)}`;
            // Price per unit
            content_unit_price = `${content_unit_price} / ${formatMoney('USD', unit_price * +price_val)}`;
            content_payable_amount = `${content_payable_amount} / ${formatMoney('USD', usd_total * deposit_factor)}`;
        }

        $payable_amount.html(content_payable_amount);
        $price_per_unit.html(content_unit_price);
        $total.html(content);
        if (!$form_error) $form_error = $('#form_error');
        $form_error.setVisibility(0);
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
        let to_show = 'feature_not_allowed';
        if (Client.get('landing_company_shortcode') === 'costarica') {
            to_show = 'ico_subscribe';
        } else if (Client.hasCostaricaAccount()) {
            if (Client.canOpenICO()) {
                to_show = 'ico_account_message';
            } else {
                to_show = 'ico_account_message_real';
            }
        } else if (Client.canOpenICO() || State.getResponse('authorize.upgradeable_landing_companies').indexOf('costarica') !== -1) {
            if (Client.isAccountOfType('virtual') && (Client.hasAccountType('gaming')
                || Client.hasAccountType('financial') || Client.hasAccountType('real'))){
                to_show = 'ico_virtual_message';
            } else {
                to_show = 'ico_new_account_message';
                let message_show = 'message_common';
                const landing_company = (Client.currentLandingCompany() || {}).shortcode;
                // Show message to user based on landing_company
                if (/^malta$/.test(landing_company)) {
                    message_show = 'message_gaming';
                } else if (/^maltainvest$/.test(landing_company)) {
                    message_show = 'message_financial';
                } else if (/^iom$/.test(landing_company)) {
                    message_show = 'message_iom';
                }

                // Show message to client.
                getElementById(message_show).setVisibility(1);
            }
        }
        getElementById(to_show).setVisibility(1);
        return to_show;
    };

    const updateMinimumBid = (ico_status) => {
        const status      = ico_status.ico_status || {};
        const el_min_bid  = document.getElementById('minimum_bid');
        if (!el_min_bid) return;
        const res_currency    = (status.currency || '').toUpperCase();
        min_bid     = status.minimum_bid || 0;
        min_bid_usd = status.minimum_bid_usd || 1.35;
        unit_price = min_bid_usd/min_bid;
        let text = `${localize('Minimum bid')} = ${formatMoney('USD', min_bid_usd)}`; // Fallback value.
        // Show bid in client currency.
        if (min_bid_usd && min_bid && res_currency && res_currency !== 'USD'){
            text = `${localize('Minimum bid')} = ${formatMoney(res_currency, min_bid)} / ${formatMoney('USD', min_bid_usd)}`;
        }

        const minBidOnClick = () => {
            $price.val(min_bid);
        };

        el_min_bid.innerHTML = text;
        el_min_bid.removeEventListener('click', minBidOnClick, false);
        el_min_bid.addEventListener('click', minBidOnClick, false);
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
