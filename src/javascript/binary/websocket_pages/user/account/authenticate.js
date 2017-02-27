const Content         = require('../../../common_functions/content').Content;
const japanese_client = require('../../../common_functions/country_base').japanese_client;
const Client          = require('../../../base/client').Client;
const url_for         = require('../../../base/url').url_for;

const Authenticate = (() => {
    const init = () => {
        if (japanese_client()) {
            window.location.href = url_for('trading');
        }
        Content.populate();

        const showError = (error) => {
            $('#error_message').removeClass('invisible').text(error);
            return true;
        };

        const checkVirtual = () => Client.get('is_virtual') && showError(Content.localize().featureNotRelevantToVirtual);

        if (!checkVirtual()) {
            BinarySocket.send({ get_account_status: 1 }).then((response) => {
                if (response.error) {
                    showError(response.error.message);
                } else if ($.inArray('authenticated', response.get_account_status.status) > -1) {
                    $('#fully-authenticated').removeClass('invisible');
                } else {
                    $('#not-authenticated').removeClass('invisible');
                }
            });
        }
    };
    return {
        init: init,
    };
})();

module.exports = Authenticate;
