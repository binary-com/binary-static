var SecurityWS = (function() {
    "use strict";
    var $form;
    var current_state;
    var STATE = {
        WAIT_AUTH:    'WAIT_AUTH',
        QUERY_LOCKED: 'QUERY_LOCKED',
        LOCKED:       'LOCKED',
        UNLOCKED:     'UNLOCKED',
        TRY_UNLOCK:   'TRY_UNLOCK',
        TRY_LOCK:     'TRY_LOCK',
        DONE:         'DONE',
    };

    function clearErrors() {
        $("#SecuritySuccessMsg").text('');
        $("#invalidinputfound").text('');
        $('#errorcashierlockpassword1').contents().filter(function () {
            return this.nodeType === Node.TEXT_NODE;
        }).remove();
    }

    function checkIsVirtual() {
        if (!page.client.is_virtual()) {
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
            authorize: CommonData.getApiToken(),
        });
    }

    function init() {
        Content.populate();
        $form = $("#changeCashierLock");
        if (checkIsVirtual()) return;

        current_state = STATE.WAIT_AUTH;
        BinarySocket.init({onmessage: handler});
        makeAuthRequest();
    }

    function authorised() {
        current_state = STATE.QUERY_LOCKED;
        BinarySocket.send({
            cashier_password: "1",
        });
    }

    function updatePage(config) {
        $('legend').text(text.localize(config.legend));
        $('#lockInfo').text(text.localize(config.info));
        $form.find('button')
            .attr('value', config.button)
            .html(text.localize(config.button));
    }

    function setupRepeatPasswordForm() {
        $("#repasswordrow").show();
        $('#password-meter-div').css({display: 'block'});
        if (isIE()) {
            $('#password-meter').remove();
            return;
        }
        $('#cashierlockpassword1').on('input', function() {
            $('#password-meter').attr('value', testPassword($('#cashierlockpassword1').val())[0]);
        });
    }

    function lockedStatus(response) {
        var locked = +response.cashier_password === 1;
        if (locked) {
            updatePage({
                legend: 'Unlock Cashier',
                info:   'Your cashier is locked as per your request - to unlock it, please enter the password.',
                button: 'Unlock Cashier',
            });
            $("#repasswordrow").hide();
        } else {
            updatePage({
                legend: 'Lock Cashier',
                info:   'An additional password can be used to restrict access to the cashier.',
                button: 'Update',
            });
            setupRepeatPasswordForm();
        }
        current_state = locked ? STATE.LOCKED : STATE.UNLOCKED;
        $form.show();
        $form.find('button').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!validateForm()) {
                return false;
            }
            current_state = locked ? STATE.TRY_UNLOCK : STATE.TRY_LOCK;
            makeAuthRequest();
        });
    }

    function validateForm() {
        clearErrors();
        var pwd1 = $("#cashierlockpassword1").val(),
            pwd2 = $("#cashierlockpassword2").val(),
            errorPassword  = $('#errorcashierlockpassword1')[0],
            errorRPassword = $('#errorcashierlockpassword2')[0],
            checkRepeat = current_state === STATE.UNLOCKED;

        if (checkRepeat && !Validate.errorMessagePassword(pwd1, pwd2, errorPassword, errorRPassword)) {
            return false;
        } else if (!/[ -~]{6,25}/.test(pwd1)) {
            errorPassword.textContent = Content.errorMessage('min', 6);
            return false;
        }
        return true;
    }

    function makeTryingRequest() {
        var key = current_state === STATE.TRY_UNLOCK ?
            'unlock_password' :
            'lock_password';
        var params  = {cashier_password: '1'};
        params[key] = $('#cashierlockpassword1').val();
        BinarySocket.send(params);
    }

    function tryStatus(response) {
        if (response.error) {
            current_state = current_state === STATE.TRY_UNLOCK ?
                STATE.LOCKED :
                STATE.UNLOCKED;
            $("#invalidinputfound").text(text.localize(response.error.message));
            return;
        }
        $form.hide();
        clearErrors();
        $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
        current_state = STATE.DONE;
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
