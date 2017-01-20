const onlyNumericOnKeypress    = require('../../../../common_functions/event_handler').onlyNumericOnKeypress;
const Client                   = require('../../../../base/client').Client;
const PaymentAgentTransferData = require('./payment_agent_transfer.data').PaymentAgentTransferData;
const PaymentAgentTransferUI   = require('./payment_agent_transfer.ui').PaymentAgentTransferUI;

const PaymentAgentTransfer = (function() {
    const hiddenClass = 'invisible';
    let paymentagent;

    const init_variable = function() {
        paymentagent = false;
    };

    const paymentAgentTransferHandler = function(response) {
        const req = response.echo_req;

        if (response.error) {
            if (req.dry_run === 1) {
                $('#transfer_error_client_id').removeClass(hiddenClass)
                                              .text(response.error.message);
                return;
            }
            PaymentAgentTransferUI.showTransferError(response.error.message);
        }

        if (response.paymentagent_transfer === 2) {
            PaymentAgentTransferUI.hideForm();
            PaymentAgentTransferUI.hideDone();
            PaymentAgentTransferUI.hideNotes();

            PaymentAgentTransferUI.showConfirmation();

            PaymentAgentTransferUI
                .updateConfirmView(response.client_to_full_name, req.transfer_to, req.amount, req.currency);
        }

        if (response.paymentagent_transfer === 1) {
            PaymentAgentTransferUI.hideForm();
            PaymentAgentTransferUI.hideConfirmation();
            PaymentAgentTransferUI.hideNotes();

            PaymentAgentTransferUI.showDone();

            PaymentAgentTransferUI.updateDoneView(Client.get('loginid'), req.transfer_to, req.amount, req.currency);
        }
    };

    const init = function(auth) {
        const $pa_form = $('#paymentagent_transfer'),
            $no_bal_err = $('#no_balance_error'),
            currency = Client.get('currency');

        if (auth && !currency) {
            $no_bal_err.removeClass(hiddenClass);
            $pa_form.addClass(hiddenClass);

            return;
        }

        $no_bal_err.addClass(hiddenClass);
        $pa_form.removeClass(hiddenClass);
        $('#paymentagent_transfer_notes').removeClass('invisible');

        PaymentAgentTransferUI.updateFormView(currency);

        const $submitFormButton = $pa_form.find('button#submit');
        const $clientIDInput = $pa_form.find('input#client_id');
        const $amountInput = $pa_form.find('input[name="amount"]');

        const $clientIDError = $('#transfer_error_client_id');
        const $amountError = $('#transfer_error_amount');
        const $insufficientBalError = $('#insufficient-balance-error');

        const $paConfirmTransferButton = $('#pa_confirm_transfer').find('#confirm_transfer');
        const $paConfirmBackButton = $('#back_transfer');

        $submitFormButton.off('click').click(function() {
            const clientID = $clientIDInput.val();
            const amount = $amountInput.val();

            if (!clientID) {
                $clientIDError.removeClass(hiddenClass);
                $clientIDError.text('Please enter the Login ID to transfer funds.');
                return;
            }

            if (!(/^\w+\d+$/.test(clientID))) {
                $clientIDError.removeClass(hiddenClass);
                $clientIDError.text('Please enter a valid Login ID.');
                return;
            }

            if (!amount) {
                $amountError.removeClass(hiddenClass);
                return;
            }

            if (amount > 2000 || amount < 10) {
                $amountError.removeClass(hiddenClass);
                return;
            }

            const bal = +(Client.get('balance'));
            if (amount > bal) {
                $insufficientBalError.removeClass(hiddenClass);
                return;
            }

            PaymentAgentTransferData.transfer(clientID, currency, amount, true);
        });

        $paConfirmTransferButton.off('click').click(function() {
            $paConfirmTransferButton.attr('disabled', 'disabled');
            const clientID = $clientIDInput.val();
            const amount = $amountInput.val();
            PaymentAgentTransferData.transfer(clientID, currency, amount, false);
        });

        $paConfirmBackButton.off('click').click(function() {
            PaymentAgentTransferUI.showForm();
            PaymentAgentTransferUI.showNotes();
            PaymentAgentTransferUI.hideConfirmation();
            PaymentAgentTransferUI.hideDone();
        });

        $clientIDInput.keyup(function(ev) {
            $clientIDError.addClass(hiddenClass);

            if (ev.which === 13) {
                $submitFormButton.click();
            }
        });

        $amountInput.keypress(onlyNumericOnKeypress);

        $amountInput.keyup(function(ev) {
            $amountError.addClass(hiddenClass);
            $insufficientBalError.addClass(hiddenClass);

            if (ev.which === 13) {
                $submitFormButton.click();
            }
        });
    };

    const error_if_virtual = function() {
        if (Client.get('is_virtual')) {
            $('#virtual_error').removeClass('invisible');
            return true;
        }
        return false;
    };

    const error_if_not_pa = function(response) {
        if (response.get_settings.hasOwnProperty('is_authenticated_payment_agent') && response.get_settings.is_authenticated_payment_agent === 0) {
            $('#not_pa_error').removeClass('invisible');
        } else if (!error_if_virtual() && response.get_settings.is_authenticated_payment_agent) {
            $('#paymentagent_transfer').removeClass('invisible');
            $('#paymentagent_transfer_notes').removeClass('invisible');
            paymentagent = true;
            PaymentAgentTransfer.init(true);
        }
    };

    const handleResponse = function(response) {
        const type = response.msg_type;
        if (type === 'get_settings') {
            error_if_not_pa(response);
        }

        if (type === 'authorize' && paymentagent) {
            PaymentAgentTransfer.init(true);
        }

        if (type === 'paymentagent_transfer') {
            PaymentAgentTransfer.paymentAgentTransferHandler(response);
        }
    };

    return {
        init                       : init,
        init_variable              : init_variable,
        handleResponse             : handleResponse,
        paymentAgentTransferHandler: paymentAgentTransferHandler,
    };
})();

module.exports = {
    PaymentAgentTransfer: PaymentAgentTransfer,
};
