const Client = require('../../../../base/client').Client;

const JapanAccOpeningData = (function() {
    const getJapanAcc = function(elementObj) {
        const req = {
            new_account_japan: 1,
            residence        : Client.get('residence'),
            date_of_birth    : elementObj.dobyy.value + '-' + elementObj.dobmm.value + '-' + elementObj.dobdd.value,
        };

        Object.keys(elementObj).forEach((key) => {
            if (!/exclude_data/.test(elementObj[key].className)) {
                if (elementObj[key].type === 'checkbox') {
                    if (elementObj[key].checked) {
                        req[key] = 1;
                    } else {
                        req[key] = 0;
                    }
                } else {
                    req[key] = elementObj[key].value;
                }
            }
        });

        if (elementObj.trading_purpose.value === 'Hedging') {
            req.hedge_asset = elementObj.hedge_asset.value;
            req.hedge_asset_amount = elementObj.hedge_asset_amount.value;
        }

        BinarySocket.send(req);
    };

    return {
        getJapanAcc: getJapanAcc,
    };
})();

module.exports = {
    JapanAccOpeningData: JapanAccOpeningData,
};
