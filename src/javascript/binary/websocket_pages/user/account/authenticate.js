const BinaryPjax      = require('../../../base/binary_pjax');
const Client          = require('../../../base/client').Client;
const Content         = require('../../../common_functions/content').Content;
const japanese_client = require('../../../common_functions/country_base').japanese_client;

const AuthenticateWS = (function() {
    const onLoad = function() {
        if (japanese_client()) {
            BinaryPjax.load('trading');
        }
        Content.populate();

        const show_error = function(error) {
            $('#error_message').removeClass('invisible').text(error);
            return true;
        };

        const check_virtual = function() {
            return Client.get('is_virtual') && show_error(Content.localize().featureNotRelevantToVirtual);
        };
        if (!check_virtual()) {
            BinarySocket.init({
                onmessage: function(msg) {
                    const response = JSON.parse(msg.data);
                    if (response) {
                        const error = response.error;
                        if (response.msg_type === 'get_account_status' && !check_virtual() && !error) {
                            if ($.inArray('authenticated', response.get_account_status.status) > -1) {
                                $('#fully-authenticated').removeClass('invisible');
                            } else {
                                $('#not-authenticated').removeClass('invisible');
                            }
                        } else if (error) {
                            show_error(error.message);
                        }
                    }
                },
            });
            BinarySocket.send({ get_account_status: 1 });
        }
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = AuthenticateWS;
