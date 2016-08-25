var SecurityWS = (function() {
    "use strict";
    var $form;
    var current_state;

    function clearErrors() {
        $("#SecuritySuccessMsg").text('');
        $("#invalidinputfound").text('');
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

    function init() {
        Content.populate();
        $form = $("#changeCashierLock");
        if (checkIsVirtual()) return;

        LiveAPI().then(function(api) {
            return api
                .send({ authorize: CommonData.getLoginToken() })
                .then(function(r) {
                    if (checkIsVirtual()) {
                        return;
                    }
                    api.send({ cashier_password: '1' }).then(lockedStatus);
                });
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
        bind_validation.simple($form[0], {
            schema: locked ? {} : getUnlockedSchema(),
            submit: function(e, info) {
                e.preventDefault();
                e.stopPropagation();
                if (info.errors.length > 0) {
                    return;
                }
                LiveAPI().then(function(s) {
                    s.send({ authorize: CommonData.getLoginToken() })
                     .then(function(r) {
                         var key = locked ? 'unlock_password' : 'lock_password';
                         var params  = {cashier_password: '1'};
                         params[key] = $('#cashierlockpassword1').val();
                         s.send(params)
                          .then(trySuccess)
                          .catch(withFailureMessage(locked));
                     });
                });
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

    function withFailureMessage(locked) {
        return function(error) {
            var message = error.message;
            if (locked && error.code === 'InputValidationFailed') {
                message = 'Sorry, you have entered an incorrect cashier password';
            }
            $('#invalidinputfound').text(text.localize(message));
        };
    }

    function trySuccess(response) {
        $form.hide();
        clearErrors();
        $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
    }

    return {
        init: init,
    };
})();
