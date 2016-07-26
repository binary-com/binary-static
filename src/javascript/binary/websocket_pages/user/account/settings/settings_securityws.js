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
        if (page.client.is_virtual()) {
            $form.hide();
            $('#SecuritySuccessMsg').addClass('notice-msg center-text').text(Content.localize().textFeatureUnavailable);
            return true;
        }
        return false;
    }

    function makeAuthRequest() {
        var loginToken = CommonData.getApiToken();
        BinarySocket.send({
            authorize: loginToken,
        });
    }

    function init() {
        Content.populate();
        $form = $("#changeCashierLock");

        if (checkIsVirtual()) {
            return;
        }

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
        $('#legend').text(text.localize(config.legend));
        $('#lockInfo').text(text.localize(config.info));
        $form.find('button')
            .attr('value', config.button)
            .html(text.localize(config.button));
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
            $("#repasswordrow").show();
            $('#password-meter-div').attr('style', 'display:block');
            if (!isIE()) {
              $('#cashierlockpassword1').on('input', function() {
                $('#password-meter').attr('value', testPassword($('#cashierlockpassword1').val())[0]);
              });
            } else {
              $('#password-meter').remove();
            }
        }
        $('#changeCashierLock').show();
        current_state = locked ? STATE.LOCKED : STATE.UNLOCKED;
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
        var isValid = true;
        clearErrors();

        var pwd1 = document.getElementById("cashierlockpassword1").value,
            pwd2 = document.getElementById("cashierlockpassword2").value,
            errorPassword = document.getElementById('errorcashierlockpassword1'),
            errorRPassword = document.getElementById('errorcashierlockpassword2'),
            isVisible = $("#repasswordrow").is(':visible');

        if(isVisible === true){
          if (!Validate.errorMessagePassword(pwd1, pwd2, errorPassword, errorRPassword)){
            isValid = false;
          }
        } else if (!/[ -~]{6,25}/.test(pwd1)) {
          errorPassword.textContent = Content.errorMessage('min', 6);
          isValid = false;
        }
        return isValid;
    }

    function makeTryingRequest() {
        var pwd = $('#cashierlockpassword1').val();
        var params = current_state === STATE.TRY_UNLOCK ?
            { unlock_password: pwd } :
            { lock_password: pwd };

        params.cashier_password = "1";
        BinarySocket.send(params);
    }

    function tryStatus(response) {
        if (response.error) {
            $("#invalidinputfound").text(text.localize(response.error.message));
            return;
        }
        $("#changeCashierLock").hide();
        $("#invalidinputfound").text('');
        $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
        current_state = STATE.DONE;
    }

    function handler(msg) {
        if (checkIsVirtual()) return;
        var res = JSON.parse(msg.data);
        if (res.msg_type === 'authorize') {
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
            return;
        } else if (res.msg_type === 'cashier_password') {
            switch (current_state) {
                case STATE.QUERY_LOCKED:
                    lockedStatus(res);
                    break;
                case STATE.TRY_UNLOCK:
                case STATE.TRY_LOCK:
                    tryStatus(res);
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

pjax_config_page_require_auth("user/settings/securityws", function() {
    return {
        onLoad: function() {
            Content.populate();
            SecurityWS.init();
        }
    };
});
