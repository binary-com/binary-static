const BinaryPjax   = require('../base/binary_pjax');
const Client       = require('../base/client');
const BinarySocket = require('../base/socket');
const localize     = require('../../_common/localize').localize;
const State        = require('../../_common/storage').State;

const CashierJP = (() => {
    let $amount,
        $loginid,
        $email;

    const onLoad = (action) => {
        if (Client.isJPClient() && Client.get('residence') !== 'jp') BinaryPjax.loadPreviousUrl();
        if (action === 'deposit') {
            return;
        }
        const $container = $('#japan_cashier_container');
        BinarySocket.send({ cashier_password: 1 }).then((response) => {
            if (response.error) {
                $('#cashier_error_message').text(response.error.code === 'RateLimit' ? localize('You have reached the rate limit of requests per second. Please try later.') : response.error.message).setVisibility(1);
            } else if (response.cashier_password === 1) {
                $container.find('#cashier_locked_message').setVisibility(1);
            } else {
                BinarySocket.send({ get_account_status: 1 }).then((response_status) => {
                    if (!response_status.error && /cashier_locked/.test(response_status.get_account_status.status)) {
                        $container.find('#cashier_locked_message').text(localize('Your cashier is locked.')).setVisibility(1); // Locked from BO
                    } else {
                        const limit = State.getResponse('get_limits.remainder');
                        if (typeof limit !== 'undefined' && limit < 1) {
                            $container.find('#cashier_locked_message').text(localize('You have reached the withdrawal limit.')).setVisibility(1);
                        } else {
                            $amount  = $('#id123-control22598145');
                            $loginid = $('#id123-control22598118');
                            $email   = $('#id123-control22598060');

                            const response_authorize = State.getResponse('authorize');
                            if (response_authorize.loginid) {
                                $loginid.val(response_authorize.loginid).attr('readonly', 'true');
                            }
                            if (response_authorize.email) {
                                $email.val(response_authorize.email).attr('readonly', 'true');
                            }
                            $('#japan_cashier_container button').on('click', (e) => {
                                const result = errorHandler();
                                if (!result) e.preventDefault();
                            });
                            $container.find('#cashier_unlocked_message').setVisibility(1);
                        }
                    }
                });
            }
        });
    };

    const errorHandler = () => {
        $amount.siblings('.error-msg').setVisibility(0);
        $loginid.siblings('.error-msg').setVisibility(0);
        $email.siblings('.error-msg').setVisibility(0);

        let is_ok = true;

        if (isNaN($amount.val()) || +$amount.val() < 1) {
            $amount.siblings('.error-msg').text(localize('Should be more than [_1]', ['¥1'])).setVisibility(1);
            is_ok = false;
        } else if (parseInt(Client.get('balance')) < +$amount.val()) {
            $amount.siblings('.error-msg').text(localize('Insufficient balance.')).setVisibility(1);
            is_ok = false;
        }
        if (!$loginid.val()) {
            $loginid.removeAttr('readonly').siblings('.error-msg').setVisibility(1);
            is_ok = false;
        }
        if (!$email.val()) {
            $email.removeAttr('readonly').siblings('.error-msg').setVisibility(1);
            is_ok = false;
        }

        return is_ok;
    };

    return {
        errorHandler,

        Deposit : { onLoad: () => { onLoad('deposit'); } },
        Withdraw: { onLoad: () => { onLoad('withdraw'); } },
    };
})();

module.exports = CashierJP;
