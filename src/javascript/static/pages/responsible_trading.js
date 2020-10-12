const Client = require('./../../app/base/client');
const getElementById = require('../../../javascript/_common/common_functions').getElementById;
const LocalStore = require('../../_common/storage').LocalStore;

const ResponsibleTrading = (() => {

    const onLoad = () => {
        const residence = Client.get('residence');
        const current_loginid = LocalStore.get('active_loginid');
        
        if (residence === 'gb' && !current_loginid.startsWith('MLT')) {
            getElementById('only-uk-with-mlt').classList.add('invisible');
        }
    };

    return {
        onLoad,
    };
})();

module.exports = ResponsibleTrading;
