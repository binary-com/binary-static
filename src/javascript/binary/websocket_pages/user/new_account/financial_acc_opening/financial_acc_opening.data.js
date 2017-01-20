const Cookies = require('../../../../../lib/js-cookie');
const Client  = require('../../../../base/client').Client;

const FinancialAccOpeningData = (function() {
    const getRealAcc = function(elementObj) {
        const req = {
            new_account_maltainvest: 1,
            accept_risk            : Client.get('accept_risk'),
            date_of_birth          : elementObj.dobyy.value + '-' + elementObj.dobmm.value + '-' + elementObj.dobdd.value,
        };

        Object.keys(elementObj).forEach((key) => {
            if (!/^secret_(answer|question)$/.test(key) && !/exclude_data/.test(elementObj[key].className)) {
                req[key] = elementObj[key].value;
            }
        });

        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }

        if (elementObj.secret_answer.value !== '') {
            req.secret_question = elementObj.secret_question.value;
            req.secret_answer = elementObj.secret_answer.value;
        }

        BinarySocket.send(req);
    };

    return {
        getRealAcc: getRealAcc,
    };
})();

module.exports = {
    FinancialAccOpeningData: FinancialAccOpeningData,
};
