/* eslint-disable no-console */
const OnfidoSDK    = require('onfido-sdk-ui');
const websiteUrl   = require('../url').websiteUrl;

const Onfido = (() => {
    let api_key, applicant_id, sdk_token, onfidoOut;
    const api_base_url = 'https://api.onfido.com/v2';

    const getApiUrlFor = api_path => {
        if (api_path[0] === '/') {
            return api_base_url + api_path;
        }

        return `${api_base_url}/${api_path}`;
    };

    const init = async (applicant) => {
        api_key = await simulateCallForApiKey();
        console.log(api_key);
        createApplicant(applicant);
    };

    const sendRequest = (method, url, params = null) => (
        new Promise((resolve, reject) => {
            const xhttp           = new XMLHttpRequest();

            xhttp.overrideMimeType('application/json');
            xhttp.open(method, url, true);
            xhttp.setRequestHeader('Authorization', `Token token=${api_key}`);

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4) {
                    if (xhttp.status >= 200 && xhttp.status < 400) {
                        resolve(JSON.parse(xhttp.responseText));
                    } else {
                        reject(new Error({
                            statusText: xhttp.statusText,
                            response  : JSON.parse(xhttp.responseText || null),
                        }));
                    }
                }
            };

            xhttp.send(method === 'POST' ? params : null);
        })
    );

    const createApplicant = ({ first, last }) => {
        const params = `first_name=${first}&last_name=${last}`;

        sendRequest('POST', getApiUrlFor('/applicants'), params)
            .then(res => {
                console.log(res);
                applicant_id = res.id;
                generateSdkToken();
            });
    };

    const generateSdkToken = () => {
        const params = `applicant_id=${applicant_id}&referrer=${websiteUrl()}/*`;

        sendRequest('POST', getApiUrlFor('/sdk_token'), params)
            .then(res => {
                console.log(res);
                sdk_token = res.token;
                runOnfido();
            });
    };

    const runOnfido = () => {
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
        console.log('Process complete');
        console.log(data);

        // Call backend to create a check (https://github.com/onfido/onfido-sdk-ui#1-creating-a-check).
        // When creating a `facial_similarity` check, you can specify the variant
        // by passing the value within `data.face.variant`

        onfidoOut.tearDown();
    };

    const changeOnfidoOptions = options => { onfidoOut.setOptions(options); };

    const simulateCallForApiKey = () => new Promise(resolve => {
        setTimeout(() => resolve('test_SZLtr4bamjGfSjtnOJEGbyZCGoMIEj26'), Math.random() * 1000);
    });

    return {
        init,
        changeOnfidoOptions,
    };
})();

module.exports = Onfido;
