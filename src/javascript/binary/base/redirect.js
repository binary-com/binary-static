const Url = require('./url');

const Redirect = (() => {
    'use strict';

    const onLoad = () => {
        const actions_map = {
            signup                : { path: 'new_account/virtualws' },
            reset_password        : { path: 'user/reset_passwordws' },
            payment_withdraw      : { path: 'cashier/forwardws', hash: '#withdraw' },
            payment_agent_withdraw: { path: 'paymentagent/withdrawws' },
        };

        const params = Url.paramsHash();
        const config = actions_map[params.action];
        // need to redirect not using pjax
        window.location.href = config && params.code ?
            Url.urlFor(config.path, `token=${params.code}${config.hash || ''}`, params.lang || '') :
            Url.defaultRedirectUrl();
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Redirect;
