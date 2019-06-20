const Onfido       = require('onfido-sdk-ui');
const Cookies      = require('js-cookie');
const BinarySocket = require('../../../base/socket');
const getLanguage  = require('../../../../_common/language').get;
const localize     = require('../../../../_common/localize').localize;

const Authenticate = (() => {
    let onfido;

    const simulateCallForApiKey = () => new Promise((resolve, reject) => {
        if (Cookies.get('onfido_token')) {
            resolve(Cookies.get('onfido_token'));
        } else {
            BinarySocket.send({
                service_token: 1,
                service      : 'onfido',
                referrer     : 'https://www.binary.com/',
            }).then((response) => {
                if (response.error) reject(Error(response.error.message));
                resolve(response.service_token.token);
                const in_90_minutes = 1 / 16;
                Cookies.set('onfido_token', response.service_token.token, {
                    expires: in_90_minutes,
                    secure : true,
                });
            });
        }
    });

    const onfidoInit = async () => {
        try {
            const sdk_token = await simulateCallForApiKey();
            onfido = Onfido.init({
                containerId: 'onfido',
                language   : getLanguage().toLowerCase() || 'en',
                token      : sdk_token,
                useModal   : false,
                onComplete : handleComplete,
                steps      : [
                    {
                        type   : 'welcome',
                        options: {
                            title       : localize('Onfido Authentication'),
                            descriptions: [
                                localize('Authenticate your account by verifying your identity and address.'),
                                localize('It will only take a couple of minutes.'),
                            ],
                        },
                    },
                    'document',
                    'face',
                ],
            });
            $('#onfido_loading').setVisibility(0);
        } catch (err) {
            $('#error_occured').setVisibility(1);
            $('#onfido_loading').setVisibility(0);
        }
    };

    const handleComplete = () => {
        onfido.tearDown();
        $('#upload_complete').setVisibility(1);
    };

    const onLoad = () => {
        BinarySocket.send({ get_account_status: 1 }).then((response) => {
            if (response.error) {
                $('#error_occured').setVisibility(1);
                return;
            }
            const should_authenticate = +response.get_account_status.prompt_client_to_authenticate;
            if (should_authenticate) {
                $('#unverified').setVisibility(1);
            }

        });
        onfidoInit();
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
