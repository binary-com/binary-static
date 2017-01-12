const localize = require('../../../../base/localize').localize;

const PaymentAgentTransferUI = (function () {
    'use strict';

    const hiddenClass = 'invisible';

    const hideForm = function() {
        $('#paymentagent_transfer').addClass(hiddenClass);
    };
    const showForm = function() {
        $('#paymentagent_transfer').removeClass(hiddenClass);
    };

    const hideConfirmation = function() {
        $('#pa_confirm_transfer').addClass(hiddenClass);
    };
    const showConfirmation = function() {
        $('#pa_confirm_transfer').removeClass(hiddenClass)
                                 .find('.errorfield').addClass(hiddenClass);
    };

    const hideDone = function() {
        $('#pa_transfer_done').addClass(hiddenClass);
    };
    const showDone = function() {
        $('#pa_transfer_done').removeClass(hiddenClass);
    };

    const hideNotes = function() {
        $('#paymentagent_transfer_notes').addClass(hiddenClass);
    };
    const showNotes = function() {
        $('#paymentagent_transfer_notes').removeClass(hiddenClass);
    };
    const updateFormView = function(currency) {
        $('#paymentagent_transfer').find('label[for="amount"]').text(localize('Amount') + ' ' + currency);
    };

    const updateConfirmView = function(username, loginid, amount, currency) {
        $('#pa_confirm_transfer')
            .find('td#user-name')
                .html(username)
            .end()
            .find('td#login-id')
                .html(loginid)
            .end()
            .find('td#amount')
                .html(currency + ' ' + amount);
    };

    const showTransferError = function(err) {
        $('#pa_confirm_transfer').find('.errorfield')
                                 .removeClass(hiddenClass)
                                 .text(localize(err));
    };

    const updateDoneView = function(fromID, toID, amount, currency) {
        const templateString = 'Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.';
        const confirmMsg = localize(templateString, [
            amount,
            currency,
            fromID,
            toID,
        ]);

        $('#pa_transfer_done').find(' > #confirm-msg').text(confirmMsg)
                                             .removeClass(hiddenClass);
    };

    return {
        hideForm         : hideForm,
        showForm         : showForm,
        hideConfirmation : hideConfirmation,
        showConfirmation : showConfirmation,
        hideDone         : hideDone,
        showDone         : showDone,
        hideNotes        : hideNotes,
        showNotes        : showNotes,
        showTransferError: showTransferError,
        updateFormView   : updateFormView,
        updateConfirmView: updateConfirmView,
        updateDoneView   : updateDoneView,
    };
})();

module.exports = {
    PaymentAgentTransferUI: PaymentAgentTransferUI,
};
