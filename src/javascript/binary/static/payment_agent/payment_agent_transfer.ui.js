var PaymentAgentTransferUI = (function () {
    "use strict";
    var hiddenClass = 'invisible';
    
    function hideForm() {
        $('#paymentagent_transfer').addClass(hiddenClass);
    }
    function showForm() {
        $('#paymentagent_transfer').removeClass(hiddenClass);
    }

    function hideConfirmation() {
        $('#pa_confirm_transfer').addClass(hiddenClass);
    }
    function showConfirmation() {
        $('#pa_confirm_transfer').removeClass(hiddenClass);
        $('#pa_confirm_transfer .errorfield').addClass(hiddenClass);
    }

    function hideDone() {
        $('#pa_transfer_done').addClass(hiddenClass);
    }
    function showDone() {
        $('#pa_transfer_done').removeClass(hiddenClass);
    }

    function hideNotes() {
        $('#paymentagent_transfer_notes').addClass(hiddenClass);
    }
    function showNotes() {
        $('#paymentagent_transfer_notes').removeClass(hiddenClass);
    }
    function updateFormView(currency) {
        $('#paymentagent_transfer label[for="amount"]').text(text.localize('Amount') + ' ' + currency);
    }

    function updateConfirmView(username, loginid, amount, currency) {
        $('#pa_confirm_transfer td#user-name').html(username);
        $('#pa_confirm_transfer td#login-id').html(loginid);
        $('#pa_confirm_transfer td#amount').html(currency + ' ' + amount);
    }

    function showTransferError(err) {
        $('#pa_confirm_transfer .errorfield')
            .removeClass(hiddenClass)
            .text(text.localize(err));
    }

    function updateDoneView(fromID, toID, amount, currency) {
        var templateString = "Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.";
        var translated = text.localize(templateString);
        var confirmMsg = translated
            .replace('[_1]', amount)
            .replace('[_2]', currency)
            .replace('[_3]', fromID)
            .replace('[_4]', toID);

        $('#pa_transfer_done > #confirm-msg').text(confirmMsg);
        $('#pa_transfer_done > #confirm-msg').removeClass(hiddenClass);
    }

    return {
        hideForm: hideForm,
        showForm: showForm,
        hideConfirmation: hideConfirmation,
        showConfirmation: showConfirmation,
        hideDone: hideDone,
        showDone: showDone,
        hideNotes: hideNotes,
        showNotes: showNotes,
        showTransferError: showTransferError,
        updateFormView: updateFormView,
        updateConfirmView: updateConfirmView,
        updateDoneView: updateDoneView
    };
}());
