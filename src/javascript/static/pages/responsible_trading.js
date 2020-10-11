const Client = require('./../../app/base/client');
const getElementById = require('../../../javascript/_common/common_functions').getElementById;
const LocalStore = require('../../_common/storage').LocalStore;

const ResponsibleTrading = (() => {

    const onLoad = () => {
        const mlt_regex = new RegExp('MLT');
        const uk_residence_regex = new RegExp('gb');
        const residence = Client.get('residence');
        const current_loginid = LocalStore.get('active_loginid');

        if (uk_residence_regex.test(residence) && !mlt_regex.test(current_loginid)) {
            const only_uk_with_mlt = getElementById('only-uk-with-mlt');
            only_uk_with_mlt.classList.add('invisible');
        }
    };

    return {
        onLoad,
    };
})();

module.exports = ResponsibleTrading;
