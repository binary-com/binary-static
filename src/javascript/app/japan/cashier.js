const BinaryPjax   = require('../base/binary_pjax');
const Client       = require('../base/client');
const BinarySocket = require('../base/socket');
const localize     = require('../../_common/localize').localize;
const State        = require('../../_common/storage').State;

const CashierJP = (() => {
    const onLoad = (action) => {
        if (Client.isJPClient() && Client.get('residence') !== 'jp') BinaryPjax.loadPreviousUrl();
        if (action === 'deposit') {
            return;
        }
        const $container = $('#japan_cashier_container');
        BinarySocket.send({ cashier_password: 1 }).then((response) => {
            if (!response.error && response.cashier_password === 1) {
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
                            $container.find('#cashier_unlocked_message').setVisibility(1);
                            BinarySocket.wait('get_settings').then(() => {
                                $('#id123-control22598118').val(Client.get('loginid'));
                                $('#id123-control22598060').val(Client.get('email'));
                                $('#japan_cashier_container button').on('click', (e) => {
                                    const result = errorHandler();
                                    if (!result) e.preventDefault();
                                });
                            });
                        }
                    }
                });
            }
        });
    };

    const errorHandler = () => {
        $('.error-msg').remove();
        const $id               = $('#id123-control22598145');
        const withdrawal_amount = $id.val();

        const showError = (message) => {
            $id.parent().append($('<p/>', { class: 'error-msg', text: localize(message) }));
        };

        if (isNaN(withdrawal_amount) || +withdrawal_amount < 1) {
            showError(localize('Should be more than [_1]', ['¥1']));
            return false;
        } else if (parseInt(Client.get('balance')) < withdrawal_amount) {
            showError('Insufficient balance.');
            return false;
        }
        return true;
    };

    return {
        errorHandler,

        Deposit : { onLoad: () => { onLoad('deposit'); } },
        Withdraw: { onLoad: () => { onLoad('withdraw'); } },
    };
})();

module.exports = CashierJP;
