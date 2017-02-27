const localize             = require('../binary/base/localize').localize;
const Client               = require('../binary/base/client').Client;
const default_redirect_url = require('../binary/base/url').default_redirect_url;
const Content              = require('../binary/common_functions/content').Content;
const japanese_client      = require('../binary/common_functions/country_base').japanese_client;
const japanese_residence   = require('../binary/common_functions/country_base').japanese_residence;

const CashierJP = (function() {
    'use strict';

    function onLoad(action) {
        Content.populate();
        BinarySocket.wait('authorize').then(() => {
            if (japanese_client() && !japanese_residence()) window.location.href = default_redirect_url();
            const $container = $('#japan_cashier_container');
            if (Client.get('is_virtual')) {
                $container.addClass('center-text notice-msg').removeClass('invisible')
                    .text(Content.localize().featureNotRelevantToVirtual);
                return;
            }
            BinarySocket.wait('get_settings').then(() => {
                $container.removeClass('invisible');
                if (action === 'deposit') {
                    $('#name_id').text((Client.get('loginid') || 'JP12345') + ' ' + (Client.get('first_name') || 'Joe Bloggs'));
                } else if (action === 'withdraw') {
                    $('#id123-control22598118').val(Client.get('loginid'));
                    $('#id123-control22598060').val(Client.get('email'));
                }
            });
        });
    }

    function errorHandler() {
        $('.error-msg').remove();
        const $id = $('#id123-control22598145');
        const withdrawal_amount = $id.val();
        if (!/^([1-9][0-9]{0,5}|1000000)$/.test(withdrawal_amount)) {
            $id.parent().append('<p class="error-msg">' + Content.errorMessage('number_should_between', '¥1 - ¥1,000,000') + '</p>');
            return false;
        } else if (parseInt(Client.get('balance')) < withdrawal_amount) {
            $id.parent().append('<p class="error-msg">' + localize('Insufficient balance.') + '</p>');
            return false;
        }
        return true;
    }

    return {
        onLoad      : onLoad,
        errorHandler: errorHandler,
    };
})();

module.exports = CashierJP;
