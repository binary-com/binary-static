const BinaryPjax      = require('../../../../base/binary_pjax');
const localize        = require('../../../../base/localize').localize;
const Content         = require('../../../../common_functions/content').Content;
const ValidateV2      = require('../../../../common_functions/validation_v2').ValidateV2;
const bind_validation = require('../../../../validator').bind_validation;
const dv              = require('../../../../../lib/validation');

const SecurityWS = (function() {
    'use strict';

    let $form,
        current_state,
        redirect_url;
    const STATE = {
        WAIT_AUTH   : 'WAIT_AUTH',
        QUERY_LOCKED: 'QUERY_LOCKED',
        LOCKED      : 'LOCKED',
        UNLOCKED    : 'UNLOCKED',
        TRY_UNLOCK  : 'TRY_UNLOCK',
        TRY_LOCK    : 'TRY_LOCK',
        DONE        : 'DONE',
    };

    const clearErrors = function() {
        $('#SecuritySuccessMsg').text('');
        $('#invalidinputfound').text('');
    };

    const onLoad = function() {
        Content.populate();
        $form = $('#changeCashierLock');

        current_state = STATE.WAIT_AUTH;
        BinarySocket.init({ onmessage: handler });
        current_state = STATE.QUERY_LOCKED;
        BinarySocket.send({ cashier_password: '1' });
    };

    const updatePage = function(config) {
        $('legend').text(localize(config.legend));
        $('#lockInfo').text(localize(config.info));
        $form.find('button')
            .attr('value', config.button)
            .html(localize(config.button));
    };

    const setupRepeatPasswordForm = function() {
        $('#repasswordrow').show();
    };

    const lockedStatus = function(response) {
        const locked = +response.cashier_password === 1;
        if (locked) {
            updatePage({
                legend: 'Unlock Cashier',
                info  : 'Your cashier is locked as per your request - to unlock it, please enter the password.',
                button: 'Unlock Cashier',
            });
            $('#repasswordrow').hide();
        } else {
            updatePage({
                legend: 'Lock Cashier',
                info  : 'An additional password can be used to restrict access to the cashier.',
                button: 'Update',
            });
            setupRepeatPasswordForm();
        }
        current_state = locked ? STATE.LOCKED : STATE.UNLOCKED;
        bind_validation.simple($form[0], {
            schema: locked ? {} : getUnlockedSchema(),
            submit: function(e, info) {
                e.preventDefault();
                e.stopPropagation();
                if (info.errors.length > 0) {
                    return;
                }
                current_state = locked ?
                    STATE.TRY_UNLOCK :
                    STATE.TRY_LOCK;
                makeTryingRequest();
            },
        });
        $form.show();
    };

    const getUnlockedSchema = function() {
        const err = Content.localize().textPasswordsNotMatching;
        const matches = function(value, data) {
            return value === data.cashierlockpassword1;
        };

        return {
            cashierlockpassword1: [ValidateV2.password],
            cashierlockpassword2: [dv.check(matches, err)],
        };
    };

    const makeTryingRequest = function() {
        const key = current_state === STATE.TRY_UNLOCK ?
            'unlock_password' :
            'lock_password';
        const params  = { cashier_password: '1' };
        params[key] = $('#cashierlockpassword1').val();
        BinarySocket.send(params);
    };

    const tryStatus = function(response) {
        if (response.error) {
            current_state = current_state === STATE.TRY_UNLOCK ?
                STATE.LOCKED :
                STATE.UNLOCKED;
            let message = response.error.message;
            if (current_state === STATE.LOCKED &&
                response.error.code === 'InputValidationFailed') {
                message = 'Sorry, you have entered an incorrect cashier password';
            }
            $('#invalidinputfound').text(localize(message));
            return;
        }
        $form.hide();
        clearErrors();
        $('#SecuritySuccessMsg').text(localize('Your settings have been updated successfully.'));
        redirect_url = current_state === STATE.TRY_UNLOCK ? sessionStorage.getItem('cashier_lock_redirect') : '';
        setTimeout(redirect, 2000);
        current_state = STATE.DONE;
    };

    const redirect = function() {
        if (redirect_url) {
            sessionStorage.removeItem('cashier_lock_redirect');
            BinaryPjax.load(redirect_url);
        }
    };

    const handler = function(msg) {
        const response = JSON.parse(msg.data);
        if (response.msg_type === 'cashier_password') {
            switch (current_state) {
                case STATE.QUERY_LOCKED:
                    lockedStatus(response);
                    break;
                case STATE.TRY_UNLOCK:
                case STATE.TRY_LOCK:
                    tryStatus(response);
                    break;
                default:
                    break;
            }
        }
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SecurityWS;
