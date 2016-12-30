var getLoginToken   = require('../../../../common_functions/common_functions').getLoginToken;
var Content         = require('../../../../common_functions/content').Content;
var ValidateV2      = require('../../../../common_functions/validation_v2').ValidateV2;
var bind_validation = require('../../../../validator').bind_validation;
var dv              = require('../../../../../lib/validation');
var localize        = require('../../../../base/localize').localize;
var load_with_pjax  = require('../../../../base/pjax').load_with_pjax;
var Client          = require('../../../../base/client').Client;

var SecurityWS = (function() {
    'use strict';

    var $form;
    var current_state,
        redirect_url;
    var STATE = {
        WAIT_AUTH   : 'WAIT_AUTH',
        QUERY_LOCKED: 'QUERY_LOCKED',
        LOCKED      : 'LOCKED',
        UNLOCKED    : 'UNLOCKED',
        TRY_UNLOCK  : 'TRY_UNLOCK',
        TRY_LOCK    : 'TRY_LOCK',
        DONE        : 'DONE',
    };

    function clearErrors() {
        $('#SecuritySuccessMsg').text('');
        $('#invalidinputfound').text('');
    }

    function checkIsVirtual() {
        if (!Client.get_boolean('is_virtual')) {
            return false;
        }
        $form.hide();
        $('#SecuritySuccessMsg')
            .addClass('notice-msg center-text')
            .text(Content.localize().textFeatureUnavailable);
        return true;
    }

    function makeAuthRequest() {
        BinarySocket.send({
            authorize  : getLoginToken(),
            passthrough: { dispatch_to: 'cashier_password' },
        });
    }

    function init() {
        Content.populate();
        $form = $('#changeCashierLock');
        if (checkIsVirtual()) return;

        current_state = STATE.WAIT_AUTH;
        BinarySocket.init({ onmessage: handler });
        makeAuthRequest();
    }

    function authorised() {
        current_state = STATE.QUERY_LOCKED;
        BinarySocket.send({
            cashier_password: '1',
        });
    }

    function updatePage(config) {
        $('legend').text(localize(config.legend));
        $('#lockInfo').text(localize(config.info));
        $form.find('button')
            .attr('value', config.button)
            .html(localize(config.button));
    }

    function setupRepeatPasswordForm() {
        $('#repasswordrow').show();
    }

    function lockedStatus(response) {
        var locked = +response.cashier_password === 1;
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
                makeAuthRequest();
            },
        });
        $form.show();
    }

    function getUnlockedSchema() {
        var err = Content.localize().textPasswordsNotMatching;
        function matches(value, data) {
            return value === data.cashierlockpassword1;
        }

        return {
            cashierlockpassword1: [ValidateV2.password],
            cashierlockpassword2: [dv.check(matches, err)],
        };
    }

    function makeTryingRequest() {
        var key = current_state === STATE.TRY_UNLOCK ?
            'unlock_password' :
            'lock_password';
        var params  = { cashier_password: '1' };
        params[key] = $('#cashierlockpassword1').val();
        BinarySocket.send(params);
    }

    function tryStatus(response) {
        if (response.error) {
            current_state = current_state === STATE.TRY_UNLOCK ?
                STATE.LOCKED :
                STATE.UNLOCKED;
            var message = response.error.message;
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
    }

    function redirect() {
        if (redirect_url) {
            sessionStorage.removeItem('cashier_lock_redirect');
            load_with_pjax(redirect_url);
        }
    }

    function handler(msg) {
        if (checkIsVirtual()) return;
        var response = JSON.parse(msg.data);
        if (response.msg_type === 'authorize') {
            switch (current_state) {
                case STATE.WAIT_AUTH:
                    authorised();
                    break;
                case STATE.TRY_UNLOCK:
                case STATE.TRY_LOCK:
                    makeTryingRequest();
                    break;
                default:
                    break;
            }
        } else if (response.msg_type === 'cashier_password') {
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
    }

    return {
        init: init,
    };
})();

module.exports = {
    SecurityWS: SecurityWS,
};
