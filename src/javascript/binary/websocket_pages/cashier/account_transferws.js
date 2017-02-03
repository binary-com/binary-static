const localize = require('../../base/localize').localize;
const Client   = require('../../base/client').Client;

const AccountTransferWS = (function() {
    'use strict';

    const availableCurr = [];
    let $form,
        account_from,
        account_to,
        currType,
        account_bal;

    const init = function() {
        if (Client.redirect_if_is_virtual()) {
            return;
        }

        $form = $('#account_transfer');
        account_bal = 0;

        BinarySocket.send({ transfer_between_accounts: '1', req_id: 4 });

        $form.find('button').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (!validateForm()) {
                return;
            }

            const amt = $form.find('#acc_transfer_amount').val();
            BinarySocket.send({
                transfer_between_accounts: '1',
                account_from             : account_from,
                account_to               : account_to,
                currency                 : currType,
                amount                   : amt,
            });
        });

        $form.find('#transfer_account_transfer').on('change', function() {
            $form.find('#invalid_amount').text('');
            set_account_from_to();

            BinarySocket.send({ payout_currencies: '1' });
        });

        $form.find('#acc_transfer_submit').on('click', function() {
            const amount = $('#acc_transfer_amount').val();
            if (!/^[0-9]+\.?[0-9]{0,2}$/.test(amount) || amount < 0.1) {
                $('#invalid_amount').removeClass('invisible')
                                    .show();
                return false;
            }
            $('#acc_transfer_submit').submit();
            return true;
        });
    };
    const set_account_from_to = function() {
        const accounts = $('#transfer_account_transfer').find('option:selected').text();
        const matches = accounts
                        .split('(')
                        .filter(function(v) {
                            return v.indexOf(')') > -1;
                        })
                        .map(function(value) {
                            return value.split(')')[0];
                        });

        account_from = matches[0];
        account_to = matches[1];

        $.each(availableCurr, function(index, value) {
            if (value.account === account_from) {
                currType = value.currency;
                account_bal = value.balance;
            }
        });

        $form.find('#currencyType').html(currType);
    };
    const validateForm = function() {
        const amt = $form.find('#acc_transfer_amount').val();
        let isValid = true;

        if (amt.length <= 0) {
            $form.find('#invalid_amount').text(localize('Invalid amount. Minimum transfer amount is 0.10, and up to 2 decimal places.'));
            isValid = false;
        }

        return isValid;
    };

    const apiResponse = function(response) {
        const type = response.msg_type;
        if (type === 'authorize') {
            init();
        } else if (type === 'transfer_between_accounts' || (type === 'error' && 'transfer_between_accounts' in response.echo_req)) {
            responseMessage(response);
        } else if (type === 'payout_currencies' || (type === 'error' && 'payout_currencies' in response.echo_req)) {
            responseMessage(response);
        }
    };

    const responseMessage = function(response) {
        if ('error' in response) {
            if ('message' in response.error) {
                if ($('#transfer_account_transfer').find('option').length > 0) {
                    $form.removeClass('invisible');
                    $form.find('#invalid_amount').text(localize(response.error.message));
                } else {
                    $('#client_message').removeClass('invisible')
                                        .find('p').html(localize(response.error.message));
                    $('#success_form').addClass('invisible');
                    $form.addClass('invisible');
                }
                return false;
            }

            return false;
        } else if ('transfer_between_accounts' in response) {
            if (response.req_id === 5) {
                $.each(response.accounts, function(key, value) {
                    $form.addClass('invisible');
                    $('#success_form').removeClass('invisible');
                    $('#client_message').addClass('invisible');

                    if (value.loginid === account_from) {
                        $('#loginid_1').html(value.loginid);
                        $('#balance_1').html(value.balance);
                    } else if (value.loginid === account_to) {
                        $('#loginid_2').html(value.loginid);
                        $('#balance_2').html(value.balance);
                    }
                });
            } else if (response.req_id === 4) {
                $form.removeClass('invisible');
                let secondacct,
                    firstacct,
                    str,
                    optionValue,
                    selectedIndex = -1;

                $.each(response.accounts, function(index, value) {
                    const currObj = {};

                    if ($.isEmptyObject(firstacct)) {
                        firstacct = value.loginid;
                        currObj.account = value.loginid;
                        currObj.currency = value.currency;
                        currObj.balance = value.balance;

                        if (value.balance > 0 && selectedIndex < 0) {
                            selectedIndex = index;
                        }

                        availableCurr.push(currObj);
                    } else {
                        secondacct = value.loginid;
                        str = localize('from account (' + firstacct + ') to account (' + secondacct + ')');
                        optionValue = firstacct + '_to_' + secondacct;
                        $form.find('#transfer_account_transfer')
                             .append($('<option></option>')
                             .attr('value', optionValue)
                             .text(str));
                        str = localize('from account (' + secondacct + ') to account (' + firstacct + ')');
                        optionValue = secondacct + '_to_' + firstacct;
                        $form.find('#transfer_account_transfer')
                             .append($('<option></option>')
                             .attr('value', optionValue)
                             .text(str));

                        currObj.account = value.loginid;
                        currObj.currency = value.currency;
                        currObj.balance = value.balance;

                        availableCurr.push(currObj);

                        firstacct = {};

                        if (selectedIndex < 0 && value.balance) {
                            selectedIndex =  index;
                        }
                    }

                    if (($.isEmptyObject(firstacct) === false) && ($.isEmptyObject(secondacct) === false)) {
                        str = localize('from account (' + secondacct + ') to account (' + firstacct + ')');
                        optionValue = secondacct + '_to_' + firstacct;
                        $form.find('#transfer_account_transfer')
                                 .append($('<option></option>')
                                 .attr('value', optionValue)
                                 .text(str));
                    }
                    secondacct = {};

                    if (value.balance <= 0) {
                        $form.find('#transfer_account_transfer option:last').remove();
                    } else if (selectedIndex < 0) {
                        selectedIndex =  index;
                    }
                });

                for (let i = 0; i < selectedIndex; i++) {
                    $form.find('#transfer_account_transfer option').eq(i).remove();
                }

                if (selectedIndex >= 0) {
                    $form.find('#transfer_account_transfer option').eq(selectedIndex).attr('selected', 'selected');
                }


                set_account_from_to();

                if ((account_bal <= 0) && (response.accounts.length > 1)) {
                    $('#client_message').removeClass('invisible');
                    $('#success_form').addClass('invisible');
                    $form.addClass('invisible');
                    return false;
                } else if (account_to === undefined || account_from === undefined || $.isEmptyObject(account_to)) {
                    $('#client_message').removeClass('invisible')
                                        .find('p').html(localize('The account transfer is unavailable for your account.'));
                    $('#success_form').addClass('invisible');
                    $form.addClass('invisible');
                    return false;
                }

                BinarySocket.send({ payout_currencies: '1' });
            } else {
                BinarySocket.send({
                    transfer_between_accounts: '1',
                    req_id                   : 5,
                });
            }
        }
        return true;
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    AccountTransferWS.apiResponse(response);
                }
            },
        });

        if (Client.get('is_virtual')) {
            AccountTransferWS.init();
        }
    };

    return {
        init       : init,
        apiResponse: apiResponse,
        onLoad     : onLoad,
    };
})();

module.exports = {
    AccountTransferWS: AccountTransferWS,
};
