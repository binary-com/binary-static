const Client = require('../../../base/client');
const BinarySocket = require('../../socket');

const Authenticate = (() => {
    'use strict';

    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').setVisibility(1).text(response.error.message);
            } else {
                const status = response.get_account_status.status;
                const authenticated = /authenticated/.test(status);
                const age_verified = /age_verification/.test(status);
                if (authenticated && age_verified) {
                    $('#fully_authenticated').setVisibility(1);
                } else if (!authenticated) {
                    if (Client.isFinancial()) {
                        $('#not_authenticated_financial').setVisibility(1);
                    } else {
                        $('#not_authenticated').setVisibility(1);
                    }
                } else if (!age_verified) {
                    $('#needs_age_verification').setVisibility(1);
                }
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Authenticate;
