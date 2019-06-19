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

    const simulateCallForApiKey = () => new Promise((resolve, reject) => {
        setTimeout(() => resolve('eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiNHZlS0ROeEdQMWoyTUV4QlBQQnVXSklxMDM0akpiWjBNTGdvK3M1YjNRd1NtOXdKODkwb29oVkFBa3B1XG4wM2w1Y1UwNEpETTduaU5hU3BqQitoUUVkalVEYk9abmdLU25yaTNERlZlbFVXcz1cbiIsInV1aWQiOiJIeHNhMDl1dmtBOCIsImV4cCI6MTU2MDkyMjc1OX0.g7fVginRed7rsMHIwc4v5q4UAcxbnAthCYHEraI0M7M'), Math.random() * 1000);
    });

    return {
        init,
        changeOnfidoOptions,
    };
})();

module.exports = Onfido;
