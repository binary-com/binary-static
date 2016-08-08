var MetaTraderUI = (function() {
    "use strict";

    var hiddenClass,
        errorClass,
        $form,
        isValid,
        isAuthenticated,
        currency,
        highlightBalance,
        mt5Logins,
        mt5Accounts;

    var init = function() {
        MetaTraderData.initSocket();
        if(!TUser.get().hasOwnProperty('is_virtual')) {
            return; // authorize response is not received yet
        }

        hiddenClass = 'invisible';
        errorClass  = 'errorfield';
        currency    = 'USD';
        mt5Logins   = [];
        mt5Accounts = {};
        highlightBalance = false;

        Content.populate();

        MetaTraderData.requestLandingCompany();
    };

    var initOk = function() {
        MetaTraderData.requestLoginList();

        // Tab
        $('.sidebar-nav li a').click(function(e) {
            e.preventDefault();
            displayTab($(this).attr('href').substring(1));
        });

        $('#mt-container').removeClass(hiddenClass);
    };

    var notEligible = function() {
        showPageError(Content.localize().textFeatureUnavailable);
        $('mt-container').addClass(hiddenClass);
    };

    var displayAccount = function(accType) {
        $('#form-new-' + accType).addClass(hiddenClass);
        var $details = $('<div/>').append($(
            makeTextRow('Login', mt5Accounts[accType].login) +
            makeTextRow('Balance', currency + ' ' + mt5Accounts[accType].balance, 'balance-' + accType) +
            makeTextRow('Name', mt5Accounts[accType].name) +
            // makeTextRow('Leverage', mt5Accounts[accType].leverage)
            makeTextRow('', text.localize('Start trading with your ' + (accType === 'demo' ? 'Demo' : 'Real') + ' Account') +
                ' <a class="button" href="' + page.url.url_for('metatrader/download') + '" style="margin:0 20px;">' +
                    '<span>' + text.localize('Download MetaTrader') + '</span></a>')
        ));
        $('#details-' + accType).html($details.html());

        // display deposit form
        if(accType === 'real') {
            $('#msg-cannot-create-real, #authenticate').addClass(hiddenClass);
            if(page.client.is_virtual()) {
                $('#accordion').addClass(hiddenClass);
                $('#msg-switch-to-deposit').removeClass(hiddenClass);
            } else {
                $('#msg-switch-to-deposit').addClass(hiddenClass);
                ['#form-deposit-real', '#form-withdrawal-real'].map(function(formID){
                    $form = $(formID);
                    $form.find('.binary-login').text(page.client.loginid);
                    $form.find('.mt-login').text(mt5Accounts[accType].login);
                    $form.find('#txtAmount').unbind('keypress').keypress(onlyNumericOnKeypress);
                    $form.find('button').unbind('click').click(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if(/deposit/.test(formID)) {
                            depositToMTAccount();
                        } else {
                            withdrawFromMTAccount();
                        }
                    });
                });

                if(highlightBalance) {
                    $('#balance-real').addClass('notice-msg').delay(5000).queue(function(){$(this).removeClass('notice-msg');});
                    highlightBalance = false;
                }

                if($('#accordion').hasClass(hiddenClass)) {
                    $('#accordion').removeClass(hiddenClass).accordion({
                        heightStyle : 'content',
                        collapsible : true,
                        active      : false
                    });
                }
            }
        }
    };

    var makeTextRow = function(label, value, id) {
        return '<div' + (id ? ' id="' + id + '"' : '') + ' class="gr-row gr-padding-10">' +
            (label ? '<div class="gr-4">' + text.localize(label) + '</div>' : '') +
            '<div class="gr-' + (label ? '8' : '12') + '">' + value + '</div></div>';
    };

    var createNewAccount = function() {
        if(formValidate()) {
            var isDemo = /demo/.test($form.attr('id'));
            MetaTraderData.requestSend({
                'mt5_new_account' : 1,
                'account_type'    : isDemo ? 'demo' : 'vanuatu',
                'email'           : TUser.get().email,
                'name'            : isDemo ? $form.find('#txtName').val() : TUser.get().fullname,
                'mainPassword'    : $form.find('#txtMainPass').val(),
                'investPassword'  : $form.find('#txtInvestPass').val(),
                'leverage'        : '100' // $form.find('#ddlLeverage').val()
            });
        }
    };

    var depositToMTAccount = function() {
        $form = $('#form-deposit-real');
        if(formValidate('deposit')) {
            MetaTraderData.requestSend({
                'mt5_deposit' : 1,
                'from_binary' : page.client.loginid,
                'to_mt5'      : mt5Accounts.real.login,
                'amount'      : $form.find('#txtAmount').val()
            });
        }
    };

    var withdrawFromMTAccount = function(isPasswordChecked) {
        $form = $('#form-withdrawal-real');
        if(formValidate('withdrawal')) {
            if(!isPasswordChecked) {
                MetaTraderData.requestPasswordCheck(mt5Accounts.real.login, $form.find('#txtMainPass').val());
            } else {
                MetaTraderData.requestSend({
                    'mt5_withdrawal' : 1,
                    'from_mt5'       : mt5Accounts.real.login,
                    'to_binary'      : page.client.loginid,
                    'amount'         : $form.find('#txtAmount').val()
                });
            }
        }
    };

    // --------------------------
    // ----- Tab Management -----
    // --------------------------
    var displayTab = function(tab) {
        if(!tab) {
            tab = page.url.location.hash.substring(1);
            if(!tab || !/demo|real|howto/.test(tab)) {
                tab = 'demo';
            }
        }

        // url
        window.location.hash = '#' + tab;

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
                $form.find('#name-row').removeClass(hiddenClass);
                passwordMeter();
            }
        } else if(/real/.test(accType)) {
            if(!hasMTReal) {
                if(page.client.is_virtual()) {
                    // check if this client has real binary account
                    var hasRealBinaryAccount = false;
                    page.user.loginid_array.map(function(loginInfo) {
                        if(loginInfo.real) hasRealBinaryAccount = true;
                    });

                    $('#msg-cannot-create-real').html(hasRealBinaryAccount ?
                        text.localize('To create a real account for MetaTrader, switch to your [_1] real money account.', ['Binary.com']) :
                        text.localize('To create a real account for MetaTrader, <a href="[_1]">upgrade to [_2] real money account</a>.', [page.url.url_for('new_account/realws'), 'Binary.com'])
                    ).removeClass(hiddenClass);
                } else {
                    if(!isAuthenticated && !page.client.is_virtual()) {
                        MetaTraderData.requestAccountStatus();
                    } else {
                        $form = $('#form-new-real');
                        if($form.contents().length === 0) {
                            $('#form-new-demo').contents().clone().appendTo('#form-new-real');
                            $form.find('.account-type').text(text.localize('Real'));
                            $form.find('#name-row').addClass(hiddenClass);
                            passwordMeter();
                        }
                        $form.removeClass(hiddenClass);
                    }   
                }
            }
        }

        if($form && /new/.test($form.attr('id'))) {
            $form.find('button').unbind('click').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                createNewAccount();
            });
        }
    };

    // -----------------------------
    // ----- Response Handlers -----
    // -----------------------------
    var responseLandingCompany = function(response) {
        if(response.hasOwnProperty('error')) {
            return showPageError(response.error.message, true);
        }

        var lc = response.landing_company;
        if (lc.hasOwnProperty('financial_company') && lc.financial_company.shortcode === 'costarica') {
            initOk();
        } else {
            notEligible();
        }
    };

    var responseAccountStatus = function(response) {
        if(response.hasOwnProperty('error')) {
            return showPageError(response.error.message, false);
        }

        if($.inArray('authenticated', response.get_account_status.status) > -1) {
            isAuthenticated = true;
            manageTabContents();
        } else if(!page.client.is_virtual()) {
            $('#authenticate').removeClass(hiddenClass);
        }
    };

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
            displayTab();
        }
    };

    var responseLoginDetails = function(response) {
        if(response.hasOwnProperty('error')) {
            return showPageError(response.error.message, false);
        }

        var accType = /^demo/.test(response.mt5_get_settings.group) ? 'demo' : 'real';
        mt5Accounts[accType] = response.mt5_get_settings;
        displayTab();
        displayAccount(accType);
    };

    var responseNewAccount = function(response) {
        if(response.hasOwnProperty('error')) {
            return showFormMessage(response.error.message, false);
        }

        MetaTraderData.requestLoginDetails(response.mt5_new_account.login);
        $('#msg-new-account-' + (/demo/.test(response.mt5_new_account.account_type) ? 'demo' : 'real'))
            .html(text.localize('Congratulations! Your account has been created.')).removeClass(hiddenClass);
    };

    var responseDeposit = function(response) {
        $form = $('#form-deposit-real');
        if(response.hasOwnProperty('error')) {
            return showFormMessage(response.error.message, false);
        }

        if(+response.mt5_deposit === 1) {
            $form.find('#txtAmount').val('');
            showFormMessage(text.localize('Deposit is done. Transaction ID:') + ' ' + response.binary_transaction_id, true);
            highlightBalance = true;
            MetaTraderData.requestLoginDetails(response.echo_req.to_mt5);
        } else {
            showFormMessage('Sorry, an error occurred while processing your request.', false);
        }
    };

    var responseWithdrawal = function(response) {
        $form = $('#form-withdrawal-real');
        if(response.hasOwnProperty('error')) {
            return showFormMessage(response.error.message, false);
        }

        if(+response.mt5_withdrawal === 1) {
            $form.find('#txtAmount').val('');
            showFormMessage(text.localize('Withdrawal is done. Transaction ID:') + ' ' + response.binary_transaction_id, true);
            highlightBalance = true;
            MetaTraderData.requestLoginDetails(response.echo_req.from_mt5);
        } else {
            showFormMessage('Sorry, an error occurred while processing your request.', false);
        }
    };

    var responsePasswordCheck = function(response) {
        $form = $('#form-withdrawal-real');
        if(response.hasOwnProperty('error')) {
            return showError('#txtMainPass', response.error.message);
        }

        if(+response.mt5_password_check === 1) {
            withdrawFromMTAccount(true);
        }
    };

    // --------------------------
    // ----- Form Functions -----
    // --------------------------
    var passwordMeter = function() {
        if (isIE()) {
            $form.find('.password-meter').remove();
            return;
        }

        if($form.find('meter').length !== 0) {
            $form.find('.password').on('input', function() {
                $form.find('.password-meter').attr('value', testPassword($form.find('.password').val())[0]);
            });
        }
    };

    var formValidate = function(formName) {
        clearError();
        isValid = true;

        if(formName === 'deposit') { // deposit form
            var errMsgDeposit = MetaTrader.validateAmount($form.find('#txtAmount').val());
            if(errMsgDeposit) {
                showError('#txtAmount', errMsgDeposit);
                isValid = false;
            }
        } else if(formName === 'withdrawal') { // withdrawal form
            var errMsgPass = MetaTrader.validateRequired($form.find('#txtMainPass').val());
            if(errMsgPass) {
                showError('#txtMainPass', errMsgPass);
                isValid = false;
            }
            var errMsgWithdrawal = MetaTrader.validateAmount($form.find('#txtAmount').val());
            if(errMsgWithdrawal) {
                showError('#txtAmount', errMsgWithdrawal);
                isValid = false;
            }
        } else { // create new account form
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
            // name
            if(/demo/.test($form.attr('id'))) {
                var errMsgName = MetaTrader.validateName($form.find('#txtName').val());
                if(errMsgName) {
                    showError('#txtName', errMsgName);
                    isValid = false;
                }
            }
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
        $form.find('#formMessage').html('');
        $('#msg-new-account-demo, #msg-new-account-real').addClass(hiddenClass);
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
        responseLoginList      : responseLoginList,
        responseLoginDetails   : responseLoginDetails,
        responseNewAccount     : responseNewAccount,
        responseDeposit        : responseDeposit,
        responseWithdrawal     : responseWithdrawal,
        responsePasswordCheck  : responsePasswordCheck,
        responseAccountStatus  : responseAccountStatus,
        responseLandingCompany : responseLandingCompany,
    };
}());
