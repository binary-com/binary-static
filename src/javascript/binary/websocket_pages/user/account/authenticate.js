const Client = require('../../../base/client');
const BinarySocket = require('../../socket');

const Authenticate = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_message').setVisibility(1).text(response.error.message);
            } else {
                const get_account_status = response.get_account_status;
                const should_authenticate = +get_account_status.prompt_client_to_authenticate;
                if (should_authenticate) {
                    const status = get_account_status.status;
                    if (!/authenticated/.test(status)) {
                        $(`#not_authenticated${Client.isAccountOfType('financial') ? '_financial' : ''}`).setVisibility(1);
                    } else if (!/age_verification/.test(status)) {
                        $('#needs_age_verification').setVisibility(1);
                    }
                } else {
                    $('#fully_authenticated').setVisibility(1);
                }
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Authenticate;
