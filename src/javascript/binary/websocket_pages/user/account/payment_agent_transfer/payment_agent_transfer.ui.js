const localize = require('../../../../base/localize').localize;

const PaymentAgentTransferUI = (() => {
    'use strict';

    const hidden_class = 'invisible';
    let $paymentagent_transfer,
        $confirm_transfer,
        $done_transfer,
        $notes_transfer;

    const initValues = () => {
        $paymentagent_transfer = $('#frm_paymentagent_transfer');
        $confirm_transfer = $('#frm_confirm_transfer');
        $done_transfer = $('#pa_transfer_done');
        $notes_transfer = $('#paymentagent_transfer_notes');
    };

    const hideForm = () => { $paymentagent_transfer.addClass(hidden_class); };

    const showForm = () => { $paymentagent_transfer.removeClass(hidden_class); };

    const hideConfirmation = () => { $confirm_transfer.addClass(hidden_class); };

    const showConfirmation = () => { $confirm_transfer.find('.errorfield').addClass(hidden_class).end().removeClass(hidden_class); };

    const hideDone = () => { $done_transfer.addClass(hidden_class); };

    const showDone = () => { $done_transfer.removeClass(hidden_class); };

    const hideNotes = () => { $notes_transfer.addClass(hidden_class); };

    const showNotes = () => { $notes_transfer.removeClass(hidden_class); };

    const showTransferError = (err) => { $confirm_transfer.find('.errorfield').text(localize(err)).removeClass(hidden_class); };

    const updateFormView = (currency) => { $paymentagent_transfer.find('label[for="amount"]').text(localize('Amount') + ' ' + currency); };

    const updateConfirmView = (username, loginid, amount, currency) => {
        $confirm_transfer
            .find('#user_name')
                .empty()
                .text(username)
            .end()
            .find('#loginid')
                .empty()
                .text(loginid)
            .end()
            .find('#confirm_amount')
                .empty()
                .text(currency + ' ' + amount);
    };

    const updateDoneView = (fromID, toID, amount, currency) => {
        const templateString = 'Your request to transfer [_1] [_2] from [_3] to [_4] has been successfully processed.';
        const confirmMsg = localize(templateString, [
            amount,
            currency,
            fromID,
            toID,
        ]);
        $done_transfer.find(' > #confirm_msg').text(confirmMsg).removeClass(hidden_class);
    };

    const hideFirstForm = () => {
        hideForm();
        hideConfirmation();
        hideNotes();
    };

    return {
        initValues       : initValues,
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
        hideFirstForm    : hideFirstForm,
    };
})();

module.exports = PaymentAgentTransferUI;
