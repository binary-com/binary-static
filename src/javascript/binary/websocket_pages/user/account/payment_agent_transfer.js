const PaymentAgentTransferUI = require('./payment_agent_transfer/payment_agent_transfer.ui');
const Client                 = require('../../../base/client').Client;
const State                  = require('../../../base/storage').State;
const Content                = require('../../../common_functions/content').Content;
const FormManager            = require('../../../common_functions/form_manager');

const PaymentAgentTransfer = (function() {
    const hiddenClass = 'invisible';

    let balance,
        is_authenticated_payment_agent,
        common_request_fields,
        $insufficient_balance;

    const onLoad = function() {
        Content.populate();
        PaymentAgentTransferUI.initValues();
        BinarySocket.wait('get_settings', 'balance').then(() => {
            is_authenticated_payment_agent = State.get(['response', 'get_settings', 'get_settings', 'is_authenticated_payment_agent']);
            if (is_authenticated_payment_agent) {
                init();
            } else {
                setFormVisibility(false);
            }
        });
    };

    const init = function() {
        const form_id = '#frm_paymentagent_transfer';
        const $no_bal_err = $('#no_balance_error');
        const currency = Client.get('currency');
        balance = State.get(['response', 'balance', 'balance', 'balance']);
        $insufficient_balance = $('#insufficient_balance');

        if (!currency || +balance === 0) {
            $('#pa_transfer_loading').remove();
            $no_bal_err.removeClass(hiddenClass);
            return;
        }

        $no_bal_err.addClass(hiddenClass);
        setFormVisibility(true);
        PaymentAgentTransferUI.updateFormView(currency);

        common_request_fields = [
            { request_field: 'paymentagent_transfer', value: 1 },
            { request_field: 'currency',              value: currency },
        ];

        FormManager.init(form_id, [
            { selector: '#client_id', validations: ['req', ['regular', { regex: /^\w+\d+$/, message: 'Please enter a valid Login ID.' }]], request_field: 'transfer_to' },
            { selector: '#amount',    validations: ['req', ['number', { type: 'float', decimals: '1, 2', min: 10, max: 2000 }]] },

            { request_field: 'dry_run', value: 1 },
        ].concat(common_request_fields));

        FormManager.handleSubmit(form_id, {}, responseHandler, additionalCheck);

        $('#amount').on('input change', function() {
            checkBalance($(this).val());
        });
    };

    const checkBalance = (amount) => {
        if (+amount > +balance) {
            $insufficient_balance.removeClass(hiddenClass);
            return false;
        }
        $insufficient_balance.addClass(hiddenClass);
        return true;
    };

    const additionalCheck = req => checkBalance(req.amount);

    const setFormVisibility = function(is_visible) {
        if (is_visible) {
            $('#pa_transfer_loading').remove();
            PaymentAgentTransferUI.showForm();
            PaymentAgentTransferUI.showNotes();
        } else {
            PaymentAgentTransferUI.hideForm();
            PaymentAgentTransferUI.hideNotes();
            if (!is_authenticated_payment_agent) {
                $('#pa_transfer_loading').remove();
                $('#not_pa_error').removeClass('invisible');
            }
        }
    };

    const responseHandler = (response) => {
        const req = response.echo_req;
        const error = response.error;

        if (error) {
            if (req.dry_run === 1) {
                $('#form_error').text(error.message).removeClass(hiddenClass);
                return;
            }
            PaymentAgentTransferUI.showTransferError(error.message);
            return;
        }

        if (response.paymentagent_transfer === 2) {
            PaymentAgentTransferUI.hideFirstForm();
            PaymentAgentTransferUI.showConfirmation();
            PaymentAgentTransferUI.updateConfirmView(response.client_to_full_name, req.transfer_to.toUpperCase(),
                req.amount, req.currency);
            initConfirm(req);
            return;
        }

        if (response.paymentagent_transfer === 1) {
            PaymentAgentTransferUI.hideFirstForm();
            PaymentAgentTransferUI.showDone();
            PaymentAgentTransferUI.updateDoneView(Client.get('loginid'), req.transfer_to.toUpperCase(), req.amount, req.currency);
        }
    };

    const initConfirm = (req) => {
        const confirm_form_id = '#frm_confirm_transfer';

        FormManager.init(confirm_form_id, [
            { request_field: 'transfer_to', value: req.transfer_to },
            { request_field: 'amount',      value: req.amount },
        ].concat(common_request_fields));

        FormManager.handleSubmit(confirm_form_id, {}, responseHandler);

        $('#back_transfer').off('click').click(function() {
            PaymentAgentTransferUI.showForm();
            PaymentAgentTransferUI.showNotes();
            PaymentAgentTransferUI.hideConfirmation();
            PaymentAgentTransferUI.hideDone();
            $('#form_error').addClass(hiddenClass);
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = PaymentAgentTransfer;
