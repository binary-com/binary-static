const Onfido       = require('onfido-sdk-ui');
const BinarySocket = require('../../../base/socket');
const getLanguage  = require('../../../../_common/language').get;

const Authenticate = (() => {
    let onfido;

    const simulateCallForApiKey = () => new Promise((resolve, reject) => {
        BinarySocket.send({
            service_token: 1,
            service      : 'onfido',
            referrer     : 'https://www.binary.com/',
        }).then((response) => {
            if (response.error) reject(Error(response.error.message));
            resolve(response.service_token.token);
        });
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
            });
        } catch (err) {
            $('#error_occured').setVisibility(1);
        }
    };

    const handleComplete = () => {
        onfido.tearDown();
        $('#upload_complete').setVisibility(1);
    };

    const onLoad = () => {
        onfidoInit();
    };

    return {
        onLoad,
    };
})();

module.exports = Authenticate;
