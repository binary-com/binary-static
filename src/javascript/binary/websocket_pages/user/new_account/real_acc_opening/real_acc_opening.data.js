const Cookies = require('../../../../../lib/js-cookie');

const RealAccOpeningData = (function() {
    const getRealAcc = function(elementObj) {
        const req = {
            new_account_real: 1,
            date_of_birth   : elementObj.dobyy.value + '-' + elementObj.dobmm.value + '-' + elementObj.dobdd.value,
        };

        Object.keys(elementObj).forEach((key) => {
            if (!/exclude_data/.test(elementObj[key].className)) {
                req[key] = elementObj[key].value;
            }
        });

        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }

        BinarySocket.send(req);
    };

    return {
        getRealAcc: getRealAcc,
    };
})();

module.exports = {
    RealAccOpeningData: RealAccOpeningData,
};
