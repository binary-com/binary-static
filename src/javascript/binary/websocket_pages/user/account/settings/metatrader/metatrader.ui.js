var MetaTraderUI = (function() {
    "use strict";

    var hiddenClass,
        errorClass,
        $form,
        isValid,
        mt5Logins,
        mt5Accounts;

    var init = function() {
        MetaTraderData.initSocket();
        if(!TUser.get().hasOwnProperty('is_virtual')) {
            return; // authorize response is not received yet
        }

        hiddenClass = 'invisible';
        errorClass  = 'errorfield';
        mt5Logins   = [];
        mt5Accounts = {};

        Content.populate();
        // Tab
        $('.sidebar-nav li a').click(function(e) {
            e.preventDefault();
            displayTab($(this).attr('href').substring(1));
        });

        var tab = page.url.location.hash.substring(1);
        if(!tab || !/demo|real|howto/.test(tab)) {
            tab = 'demo';
        }
        displayTab(tab);

        MetaTraderData.requestLoginList();
    };

    // --------------------------
    // ----- Tab Management -----
    // --------------------------
    var displayTab = function(tab) {
        // url
        window.history.replaceState(null, null, window.location.href.replace(/^(.*#).*/, '$1' + tab));

        // tab
        $('.sidebar-nav li').removeClass('selected');
        $('.sidebar-nav').find('#nav-' + tab).addClass('selected');

        // section
        $('.section').addClass(hiddenClass);
        $('#section-' + tab).removeClass(hiddenClass);
        if(/demo|real/.test(tab)) {
            manageTabContents();
        }
    };

    var manageTabContents = function() {
        var accType = $('.sidebar-nav li.selected').attr('id').split('-')[1];
        var hasMTDemo = mt5Accounts.hasOwnProperty('demo'),
            hasMTReal = mt5Accounts.hasOwnProperty('real');

        if(/demo/.test(accType)) {
            if(!hasMTDemo) {
                $form = $('#form-new-demo');
                $form.removeClass(hiddenClass);
                passwordMeter();
            }
        } else if(/real/.test(accType)) {
            if(!hasMTReal) {
                if(page.client.is_virtual()) {
                    // check if this client has real binary account
                    var hasReal = false;
                    page.user.loginid_array.map(function(loginInfo) {
                        if(loginInfo.real) hasReal = true;
                    });

                    $('#msgRealAccount').html(
                        '<strong>' + text.localize('To create a Real account for MetaTrader:') + '</strong> ' +
                        (hasReal ? text.localize('please switch to your Real account.') :
                            text.localize('please <a href="[_1]">upgrade to Real account</a>.', [page.url.url_for('new_account/realws')]))
                    ).removeClass(hiddenClass);
                } else {
                    $form = $('#form-new-real');
                    if($form.contents().length === 0) {
                        $('#form-new-demo').contents().clone().appendTo('#form-new-real');
                        $form.find('.account-type').text(text.localize('Real'));
                        passwordMeter();
                    }
                    $form.removeClass(hiddenClass);
                }
            }
        }

        if($form) {
            $form.find('button').unbind('click').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                createNewAccount();
            });
        }
    };

    var displayAccount = function(accType) {
        $('#form-new-' + accType).remove();
        var $details = $('<div/>').append($('<h3>' + text.localize(accType === 'demo' ? 'Demo Account' : 'Real Account') + ' #' + mt5Accounts[accType].login + '</h3>' +
            '<div class="gr-4">' + text.localize('Balance') + '</div><div class="gr-8">' + mt5Accounts[accType].balance + '</div>' +
            '<div class="gr-4">' + text.localize('Leverage') + '</div><div class="gr-8">' + mt5Accounts[accType].leverage + '</div>'
            // '<div class="separator-line"></div>' +
            ));
        $('#details-' + accType).html($details.html());
    };

    var createNewAccount = function() {
        if(formValidate()) {
            MetaTraderData.requestNewAccount({
                'mt5_new_account': 1,
                'account_type': /demo/.test($form.attr('id')) ? 'demo' : 'vanuatu',
                'email': TUser.get().email,
                'mainPassword': $form.find('#txtMainPass').val(),
                'investPassword': $form.find('#txtInvestPass').val(),
                'leverage': '100'
            });
        }
    };

    // -----------------------------
    // ----- Response Handlers -----
    // -----------------------------
    var responseLoginList = function(response) {
        if(response.hasOwnProperty('error')) {
            return showPageError(response.error.message, false);
        }

        mt5Logins = [];
        mt5Accounts = {};
        if(response.mt5_login_list && response.mt5_login_list.length > 0) {
            response.mt5_login_list.map(function(obj) {
                mt5Logins.push(obj.login);
                MetaTraderData.requestLoginDetails(obj.login);
            });
        } else {
            manageTabContents();
        }
    };

    var responseLoginDetails = function(response) {
        if(response.hasOwnProperty('error')){
            return showPageError(response.error.message, false);
        }

        var accType = response.mt5_get_settings.group.split('\\')[0];
        mt5Accounts[accType] = response.mt5_get_settings;
        displayAccount(accType);
    };

    var responseNewAccount = function(response) {
        if(response.hasOwnProperty('error')){
            return showFormMessage(response.error.message, false);
        }

        showFormMessage('Your new account has been created.', true);
        MetaTraderData.requestLoginDetails(response.mt5_new_account.login);
    };

    // --------------------------
    // ----- Form Functions -----
    // --------------------------
    var passwordMeter = function() {
        if (isIE()) {
            $form.find('.password-meter').remove();
            return;
        }

        if($form.find('meter').length === 0) {
            $form.find('.password').on('input', function() {
                $form.find('.password-meter').attr('value', testPassword($form.find('.password').val())[0]);
            });
        }
    };

    var formValidate = function() {
        clearError();
        isValid = true;

        var passwords = ['#txtMainPass', '#txtMainPass2', '#txtInvestPass'];
        passwords.map(function(elmID){
            var errMsg = MetaTrader.validatePassword($form.find(elmID).val());
            if(errMsg) {
                showError(elmID, errMsg);
                isValid = false;
            }
        });
        if($form.find('#txtMainPass').val() !== $form.find('#txtMainPass2').val()) {
            showError('#txtMainPass2', Content.localize().textPasswordsNotMatching);
            isValid = false;
        }

        return isValid;
    };

    var showError = function(selector, errMsg) {
        $form.find(selector).parent().append($('<p/>', {class: errorClass, text: errMsg}));
        isValid = false;
    };

    var clearError = function(selector) {
        $(selector ? selector : 'p.' + errorClass).remove();
        $('#errorMsg').html('').addClass(hiddenClass);
        $('#formMessage').html('');
    };

    var showFormMessage = function(msg, isSuccess) {
        var $elmID = $form.find('#formMessage');
        $elmID
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    var showPageError = function(errMsg, hideForm) {
        $('#errorMsg').html(errMsg).removeClass(hiddenClass);
        if(hideForm) {
            $form.addClass(hiddenClass);
        }
    };

    return {
        init: init,
        responseLoginList: responseLoginList,
        responseLoginDetails: responseLoginDetails,
        responseNewAccount: responseNewAccount,
    };
}());
