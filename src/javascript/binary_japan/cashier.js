import BinaryPjax from '../binary/base/binary_pjax';
import Client from '../binary/base/client';
import { localize } from '../binary/base/localize';
import { defaultRedirectUrl } from '../binary/base/url';
import { template } from '../binary/base/utility';
import { jpClient, jpResidence } from '../binary/common_functions/country_base';

const CashierJP = (() => {
    'use strict';

    const onLoad = (action) => {
        if (jpClient() && !jpResidence()) BinaryPjax.load(defaultRedirectUrl());
        const $container = $('#japan_cashier_container');
        BinarySocket.wait('get_settings').then(() => {
            $container.removeClass('invisible');
            if (action === 'deposit') {
                $('#name_id').text(`${Client.get('loginid') || 'JP12345'} ${Client.get('first_name') || 'Joe Bloggs'}`);
            } else if (action === 'withdraw') {
                $('#id123-control22598118').val(Client.get('loginid'));
                $('#id123-control22598060').val(Client.get('email'));
            }
        });
    };

    const errorHandler = () => {
        $('.error-msg').remove();
        const $id = $('#id123-control22598145');
        const withdrawal_amount = $id.val();

        const showError = (message) => {
            $id.parent().append($('<p/>', { class: 'error-msg', text: localize(message) }));
        };

        if (!/^([1-9][0-9]{0,5}|1000000)$/.test(withdrawal_amount)) {
            showError(template('Please enter a number between [_1].', ['¥1 - ¥1,000,000']));
            return false;
        } else if (parseInt(Client.get('balance')) < withdrawal_amount) {
            showError('Insufficient balance.');
            return false;
        }
        return true;
    };

    return {
        errorHandler: errorHandler,
        Deposit     : {
            onLoad: () => {
                onLoad('deposit');
            },
        },
        Withdraw: {
            onLoad: () => {
                onLoad('withdraw');
            },
        },
    };
})();

module.exports = CashierJP;
