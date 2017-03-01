const template = require('../../base/utility').template;
const Cookies  = require('../../../lib/js-cookie');
const Content  = require('../../common_functions/content').Content;
const localize = require('../../base/localize').localize;
const Client   = require('../../base/client').Client;
const url_for  = require('../../base/url').url_for;

const PaymentAgentWithdrawWS = (function() {
    'use strict';

    let containerID,
        viewIDs,
        fieldIDs,
        errorClass,
        hiddenClass,
        $views,
        formData,
        isValid,
        withdrawCurrency,
        minAmount,
        maxAmount;

    const init = function() {
        containerID = '#paymentagent_withdrawal';
        $views      = $(containerID + ' .viewItem');
        errorClass  = 'errorfield';
        hiddenClass = 'hidden';
        viewIDs = {
            error  : '#viewError',
            success: '#viewSuccess',
            confirm: '#viewConfirm',
            form   : '#viewForm',
        };
        fieldIDs = {
            verificationCode: '#verification-code',
            ddlAgents       : '#ddlAgents',
            txtAmount       : '#txtAmount',
            txtDesc         : '#txtDescription',
        };
        withdrawCurrency = 'USD';
        minAmount = 10;
        maxAmount = 2000;

        $views.addClass(hiddenClass);

        BinarySocket.wait('get_account_status').then((response) => {
            if (/(withdrawal|cashier)_locked/.test(response.get_account_status.status)) {
                showPageError('', 'withdrawal-locked-error');
            } else {
                BinarySocket.send({ paymentagent_list: Cookies.get('residence') });
            }

            $(viewIDs.form + ' button').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                formData = formValidate();
                if (formData) {
                    withdrawRequest(true);
                }
            });
        });
    };

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    const populateAgentsList = function(response) {
        const $ddlAgents = $(fieldIDs.ddlAgents);
        $ddlAgents.empty();
        const paList = response.paymentagent_list.list;
        if (paList.length > 0) {
            BinarySocket.send({ verify_email: Client.get('email'), type: 'paymentagent_withdraw' });
            insertListOption($ddlAgents, localize('Please select a payment agent'), '');
            for (let i = 0; i < paList.length; i++) {
                insertListOption($ddlAgents, paList[i].name, paList[i].paymentagent_loginid);
            }
            setActiveView(viewIDs.form);
        } else {
            showPageError(localize('The Payment Agent facility is currently not available in your country.'));
        }
    };

    const insertListOption = function($ddlObject, itemText, itemValue) {
        $ddlObject.append($('<option/>', { value: itemValue, text: itemText }));
    };

    // ----------------------------
    // ----- Form Validations -----
    // ----------------------------
    const formValidate = function() {
        clearError();
        isValid = true;

        const agent  = $(fieldIDs.ddlAgents).val(),
            amount = $(fieldIDs.txtAmount).val().trim(),
            desc   = $(fieldIDs.txtDesc).val().trim(),
            token  = $(fieldIDs.verificationCode).val().trim();

        const letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            period  = Content.localize().textPeriod,
            comma   = Content.localize().textComma;

        // Payment Agent
        isRequiredError(fieldIDs.ddlAgents);

        // verification token
        if (!isRequiredError(fieldIDs.verificationCode)) {
            if (token.length !== 48) {
                showError(fieldIDs.verificationCode, Content.errorMessage('valid', localize('verification token')));
            }
        }

        // Amount
        if (!isRequiredError(fieldIDs.txtAmount)) {
            if (!(/^\d+(\.\d+)?$/).test(amount) || !$.isNumeric(amount)) {
                showError(fieldIDs.txtAmount, Content.errorMessage('reg', [numbers]));
            } else if (!(/^\d+(\.\d{1,2})?$/).test(amount)) {
                showError(fieldIDs.txtAmount, localize('Only 2 decimal points are allowed.'));
            } else if (amount < minAmount) {
                showError(fieldIDs.txtAmount, localize('Invalid amount, minimum is') + ' ' + withdrawCurrency + ' ' + minAmount);
            } else if (amount > maxAmount) {
                showError(fieldIDs.txtAmount, localize('Invalid amount, maximum is') + ' ' + withdrawCurrency + ' ' + maxAmount);
            }
        }

        // Description
        if (!(/^[a-zA-Z0-9\s\.\,\-']*$/).test(desc)) {
            showError(fieldIDs.txtDesc, Content.errorMessage('reg', [letters, numbers, space, period, comma, '- \'']));
        }

        if (!isValid) {
            return false;
        }
        return {
            agent           : agent,
            agentname       : $(fieldIDs.ddlAgents + ' option:selected').text(),
            currency        : withdrawCurrency,
            amount          : amount,
            desc            : desc,
            verificationCode: token,
        };
    };

    const isRequiredError = function(fieldID) {
        if (!$(fieldID).val() || !(/.+/).test($(fieldID).val().trim())) {
            showError(fieldID, Content.errorMessage('req'));
            return true;
        }
        return false;
    };

    /* const isCountError = function(fieldID, min, max) {
        const fieldValue = $(fieldID).val().trim();
        if((fieldValue.length > 0 && fieldValue.length < min) || fieldValue.length > max) {
            showError(fieldID, Content.errorMessage('range', '(' + min + '-' + max + ')'));
            return true;
        } else {
            return false;
        }
    };*/

    // ----------------------------
    // ----- Withdraw Process -----
    // ----------------------------
    const withdrawRequest = function(isDryRun) {
        const dry_run = isDryRun ? 1 : 0;
        BinarySocket.send({
            paymentagent_withdraw: 1,
            paymentagent_loginid : formData.agent,
            currency             : formData.currency,
            amount               : formData.amount,
            description          : formData.desc,
            dry_run              : dry_run,
            verification_code    : formData.verificationCode,
        });
    };

    const withdrawResponse = function(response) {
        const responseCode = response.paymentagent_withdraw;
        switch (responseCode) {
            case 2: // dry_run success: showing the confirmation page
                setActiveView(viewIDs.confirm);

                $('#lblAgentName').text(formData.agentname);
                $('#lblCurrency').text(formData.currency);
                $('#lblAmount').text(formData.amount);

                $(viewIDs.confirm + ' #btnConfirm').click(function() {
                    withdrawRequest(false);
                });
                $(viewIDs.confirm + ' #btnBack').click(function() {
                    setActiveView(viewIDs.form);
                });
                break;

            case 1: // withdrawal success
                setActiveView(viewIDs.success);
                $('#successMessage').css('display', '')
                    .attr('class', 'success-msg')
                    .html(
                        '<ul class="checked"><li>' +
                        localize('Your request to withdraw [_1] [_2] from your account [_3] to Payment Agent [_4] account has been successfully processed.', [
                            formData.currency,
                            formData.amount,
                            Cookies.get('loginid'),
                            formData.agentname,
                        ]) +
                        '</li></ul>');
                break;

            default: // error
                if (response.echo_req.dry_run === 1) {
                    setActiveView(viewIDs.form);
                    $('#formMessage').css('display', '')
                        .attr('class', errorClass)
                        .html(response.error.message);
                } else if (response.error.code === 'InvalidToken') {
                    showPageError(template(Content.localize().textClickHereToRestart, [url_for('paymentagent/withdrawws')]));
                } else {
                    showPageError(response.error.message);
                }
                break;
        }
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    const showPageError = function(errMsg, id) {
        $(viewIDs.error + ' > p').addClass(hiddenClass);
        if (id) {
            $(viewIDs.error + ' #' + id).removeClass(hiddenClass);
        } else {
            $(viewIDs.error + ' #custom-error').html(errMsg).removeClass(hiddenClass);
        }
        setActiveView(viewIDs.error);
    };

    const showError = function(fieldID, errMsg) {
        $(fieldID).parent().append($('<p/>', { class: errorClass, text: errMsg }));
        isValid = false;
    };

    const clearError = function(fieldID) {
        $(fieldID || viewIDs.form + ' .' + errorClass).remove();
    };

    // ----- View Control -----
    const setActiveView = function(viewID) {
        $views.addClass(hiddenClass);
        $(viewID).removeClass(hiddenClass);
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    const type = response.msg_type;
                    switch (type) {
                        case 'paymentagent_list':
                            PaymentAgentWithdrawWS.populateAgentsList(response);
                            break;
                        case 'paymentagent_withdraw':
                            PaymentAgentWithdrawWS.withdrawResponse(response);
                            break;
                        default:
                            break;
                    }
                }
            },
        });

        Content.populate();
        BinarySocket.wait('get_account_status').then(() => {
            init();
        });
    };

    return {
        onLoad            : onLoad,
        populateAgentsList: populateAgentsList,
        withdrawResponse  : withdrawResponse,
    };
})();

module.exports = PaymentAgentWithdrawWS;
