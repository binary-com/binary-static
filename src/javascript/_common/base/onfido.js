const OnfidoSDK    = require('onfido-sdk-ui');

const Onfido = (() => {
    let onfidoOut, sdk_token;

    const init = async () => {
        sdk_token = await simulateCallForApiKey();
        onfidoOut = OnfidoSDK.init({
            containerId: 'onfido',
            // language   : 'en', // Currently only 'en' and 'es' are available - custom language objects can be passed
            // smsNumberCountryCode: 'GB',
            // steps // https://github.com/onfido/onfido-sdk-ui#welcome
            token      : sdk_token,
            useModal   : false,
            // userDetails: { smsNumber: '+447500123456' }, // Some user details can be predefined for user convenience
            onComplete : handleComplete,
        });
    };

    const handleComplete = data => {
        // eslint-disable-next-line no-console
        console.log('Process complete');
        // eslint-disable-next-line no-console
        console.log(data);
        // TODO remove the console logs above and follow comment instructions below

        // Call backend to create a check (https://github.com/onfido/onfido-sdk-ui#1-creating-a-check).
        // When creating a `facial_similarity` check, you can specify the variant
        // by passing the value within `data.face.variant`

        onfidoOut.tearDown();
    };

    const changeOnfidoOptions = options => { onfidoOut.setOptions(options); };

    const simulateCallForApiKey = () => new Promise(resolve => {
        setTimeout(() => resolve('eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiV1M0dWsvbUwwcU9PZE1mM3EvckdNS0t3QndWZWF1bDFqbU9KbmhYUXB4VlliRGhxWDJqRUVDL1IzaWNJXG4xbGNvWCs2aEs2TWlXajJCQ0VpVHhNcnRqS2J0TTdTZWh2djlGMFlhWDlYSHJqdz1cbiIsInV1aWQiOiJIeHNhMDl1dmtBOCIsImV4cCI6MTU1NzM5Njk1N30.UY1IULB4B5hItGXlqQws_4vF9-G2ixx1hqBxDTOxzws'), Math.random() * 1000);
    });

    return {
        init,
        changeOnfidoOptions,
    };
})();

module.exports = Onfido;
