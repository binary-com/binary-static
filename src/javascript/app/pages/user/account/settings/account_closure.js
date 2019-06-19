const getCurrencies       = require('../../get_currency').getCurrencies;
const MetaTrader          = require('../../../user/metatrader/metatrader');
const BinarySocket        = require('../../../../base/socket');
const getCurrencyFullName = require('../../../../common/currency').getCurrencyFullName;
const localize            = require('../../../../../_common/localize').localize;
const Url                 = require('../../../../../_common/url');
const isCryptocurrency    = require('../../../../../_common/base/currency_base').isCryptocurrency;

const AccountClosure = (() => {
    const form_selector = '#form_closure';
    let $form,
        $txt_other_reason,
        $closure_loading,
        $closure_container,
        $success_msg,
        $error_msg,
        $crypto,
        $fiat;

    const onLoad = () => {
        $txt_other_reason  = $('#other_reason');
        $closure_loading   = $('#closure_loading');
        $closure_container = $('#closure_container');
        $success_msg       = $('#msg_main');
        $error_msg         = $('#msg_form');
        $crypto            = $('#crypto');
        $fiat              = $('#change-fiat');
        $form              = $(form_selector);

        BinarySocket.wait('landing_company').then((response) => {
            const currencies = getCurrencies(response.landing_company, true);
            if (currencies) {
                currencies.forEach((currency) => {
                    if (isCryptocurrency(currency)) {
                        $crypto.find('ul').append(`<li>${getCurrencyFullName(currency)}</li>`);
                    } else {
                        $fiat.find('ul').append(`<li>${getCurrencyFullName(currency)}</li>`);
                    }
                });
                if (!$crypto.find('li').length) $crypto.setVisibility(0);
                if (!$fiat.find('li').length) $fiat.setVisibility(0);
            }
            if (!MetaTrader.isEligible()) {
                $('#mt5_withdraw').setVisibility(0);
            }
        }).catch((error) => {
            showFormMessage(error.message);
        });
        $closure_container.setVisibility(1);

        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            submitForm();
        });

        $txt_other_reason.on('keyup', () => {
            const input = $txt_other_reason.val();
            if (input && validateReasonTextField(false)) {
                $txt_other_reason.removeClass('error-field');
                $error_msg.css('display', 'none');
            }
        });
    };

    const submitForm = () => {
        const $btn_submit = $form.find('#btn_submit');
        const reason = getReason();
        if (reason) {
            $closure_loading.setVisibility(1);
            $btn_submit.attr('disabled', true);

            const data  = { account_closure: 1, reason };
            BinarySocket.send(data).then((response) => {
                if (response.error) {
                    $closure_loading.setVisibility(0);
                    showFormMessage(response.error.message || localize('Sorry, an error occurred while processing your request.'));
                    $btn_submit.attr('disabled', false);
                } else {
                    $closure_loading.setVisibility(0);
                    $closure_container.setVisibility(0);
                    $success_msg.setVisibility(1);

                    setTimeout(() => window.location.href = Url.urlFor('home'), 10000);
                }
            });
        } else {
            setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
        }
    };

    const showFormMessage = (localized_msg, scroll_on_error) => {
        if (scroll_on_error) $.scrollTo($('#reason'), 500, { offset: -20 });
        $error_msg
            .attr('class', 'errorfield')
            .html(localized_msg)
            .css('display', 'block');
    };

    const validateReasonTextField = (scroll_on_error) => {
        const other_reason_input = $txt_other_reason.val();
        if (!other_reason_input) {
            $txt_other_reason.addClass('error-field');
            showFormMessage(localize('Please specify the reasons for closing your accounts'), scroll_on_error);
            return false;
        } else if (other_reason_input.length < 5 || other_reason_input.length > 250) {
            $txt_other_reason.addClass('error-field');
            showFormMessage(localize('The reason should be between 5 and 250 characters'), scroll_on_error);
            return false;
        } else if (!/^[0-9A-Za-z .,'-]{5,250}$/.test(other_reason_input)) {
            $txt_other_reason.addClass('error-field');
            showFormMessage(localize('Only letters, numbers, space, hyphen, period, comma, and apostrophe are allowed.'), scroll_on_error);
            return false;
        }
        return true;
    };

    const getReason = () => {
        const $selected_reason   = $('#reason input[type=radio]:checked');
        const reason_radio_val   = $selected_reason.val();
        const reason_radio_id    = $selected_reason.attr('id');
        const reason_radio_text  = $(`label[for=${reason_radio_id }]`).text();
        const other_reason_input = $txt_other_reason.val();

        if (reason_radio_val) {
            if (reason_radio_val === 'other') {
                if (validateReasonTextField(true)){
                    return other_reason_input;
                }
                return false;
            }
            return reason_radio_text;
        }
        showFormMessage(localize('Please select a reason.'));
        return false;
    };

    return {
        onLoad,
    };
})();

module.exports = AccountClosure;
