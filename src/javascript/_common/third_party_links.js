const localize         = require('./localize').localize;
const State            = require('./storage').State;
const Client           = require('../app/base/client');
const BinarySocket     = require('../app/base/socket');

const ThirdPartyLinks = (() => {
    const init = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then(() => {
                const landing_company_shortcode = State.getResponse('authorize.landing_company_name');
                if (landing_company_shortcode === 'maltainvest') {
                    document.body.addEventListener('click', clickHandler);
                }
            });
        }
    };

    const clickHandler = (e) => {
        if (!e.target) return;
        const link_el = e.target.closest('a');
        if (link_el && isThirdPartyLink(link_el)) {
            // TODO: replace with custom popup
            const should_proceed = window.confirm(localize('You will be redirected to a third-party website which is not owned by Binary.com. Click OK to proceed.'));
            if (!should_proceed) e.preventDefault();
        }
    }

    const isThirdPartyLink = (href) => {
        const destination = new URL(href);
        return !/^.*\.binary\.com$/.test(destination.host)
            && window.location.host !== destination.host;
    };

    return {
        init,
    };
})();

module.exports = ThirdPartyLinks;