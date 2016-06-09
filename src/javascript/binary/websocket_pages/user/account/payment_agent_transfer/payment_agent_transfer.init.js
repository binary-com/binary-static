var PaymentAgentTransfer = (function () {
    var hiddenClass = 'invisible',
        paymentagent;

    function init_variable() {
      paymentagent = false;
    }

    function handleResponse(response) {
      var type = response.msg_type;
      if (type === 'get_settings') {
        error_if_not_pa(response);
      }

      if (type === 'authorize' && paymentagent) {
          PaymentAgentTransfer.init(true);
      }

      if (type === 'paymentagent_transfer'){
          PaymentAgentTransfer.paymentAgentTransferHandler(response);
      }
    }

    function paymentAgentTransferHandler(response) {
        var req = response.echo_req;

        if (response.error) {
            if (req.dry_run === 1) {
                $('#transfer_error_client_id').removeClass(hiddenClass);
                $('#transfer_error_client_id').text(response.error.message);
                return;
            } else {
                PaymentAgentTransferUI.showTransferError(response.error.message);
            }
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

            PaymentAgentTransferUI.updateDoneView(TUser.get().loginid, req.transfer_to, req.amount, req.currency);
        }
    }

    function init(auth) {
        var $pa_form = $('#paymentagent_transfer');

        var currency = TUser.get().currency;

        if (auth && !currency) {
            $('#no_balance_error').removeClass(hiddenClass);
            $pa_form.addClass(hiddenClass);

            return;
        } else {
            $('#no_balance_error').addClass(hiddenClass);
            $pa_form.removeClass(hiddenClass);
            $('#paymentagent_transfer_notes').removeClass('invisible');
        }

        PaymentAgentTransferUI.updateFormView(currency);

        var $submitFormButton = $pa_form.find('button#submit');
        var $clientIDInput = $pa_form.find('input#client_id');
        var $amountInput = $pa_form.find('input[name="amount"]');

        var $clientIDError = $('#transfer_error_client_id');
        var $amountError = $('#transfer_error_amount');
        var $insufficientBalError = $('#insufficient-balance-error');

        var $paConfirmTransferButton = $('#pa_confirm_transfer #confirm_transfer');
        var $paConfirmBackButton = $('#back_transfer');

        $submitFormButton.click(function() {
            var clientID = $clientIDInput.val();
            var amount = $amountInput.val();

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

            var bal = +(TUser.get().balance);
            if (amount > bal) {
                $insufficientBalError.removeClass(hiddenClass);
                return;
            }

            PaymentAgentTransferData.transfer(clientID, currency, amount, true);
        });

        $paConfirmTransferButton.click(function() {
            $paConfirmTransferButton.attr('disabled','disabled');
            var clientID = $clientIDInput.val();
            var amount = $amountInput.val();
            PaymentAgentTransferData.transfer(clientID, currency, amount, false);
        });

        $paConfirmBackButton.click(function() {
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

        $amountInput.keyup(function(ev){
            $amountError.addClass(hiddenClass);
            $insufficientBalError.addClass(hiddenClass);

            if (ev.which === 13) {
                $submitFormButton.click();
            }
        });
    }

    function error_if_virtual() {
      if (page.client.is_virtual()) {
        $('#virtual_error').removeClass('invisible');
        return true;
      }
      return false;
    }

    function error_if_not_pa(response) {
      if (response.get_settings.hasOwnProperty('is_authenticated_payment_agent') && response.get_settings.is_authenticated_payment_agent === 0) {
        $('#not_pa_error').removeClass('invisible');
        return;
      } else if (error_if_virtual()) {
        return;
      } else if (response.get_settings.is_authenticated_payment_agent) {
        $('#paymentagent_transfer').removeClass('invisible');
        $('#paymentagent_transfer_notes').removeClass('invisible');
        paymentagent = true;
        PaymentAgentTransfer.init(true);
        return;
      }
    }

    return {
        init: init,
        init_variable: init_variable,
        handleResponse: handleResponse,
        paymentAgentTransferHandler: paymentAgentTransferHandler
    };
}());
