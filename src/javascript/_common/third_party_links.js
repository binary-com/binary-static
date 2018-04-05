const getPropertyValue = require('./utility').getPropertyValue;
const Client           = require('../app/base/client');
const BinarySocket     = require('../app/base/socket');
const Dialog           = require('../app/common/attach_dom/dialog');

const ThirdPartyLinks = (() => {
    const init = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then((response) => {
                const landing_company_shortcode = getPropertyValue(response, ['authorize', 'landing_company_name']);
                if (landing_company_shortcode === 'maltainvest') {
                    document.body.addEventListener('click', clickHandler);
                }
            });
        }
    };

    const clickHandler = (e) => {
        if (!e.target) return;
        const el_link = e.target.closest('a');
        if (!el_link) return;

        const dialog = document.querySelector('#third_party_redirect_dialog');
        if (dialog && dialog.contains(el_link)) return;

        if (isThirdPartyLink(el_link.href)) {
            e.preventDefault();
            Dialog.confirm({
                id     : 'third_party_redirect_dialog',
                message: ['You will be redirected to a third-party website which is not owned by Binary.com.', 'Click OK to proceed.'],
            }).then((should_proceed) => {
                if (should_proceed) {
                    const link = window.open();
                    link.opener = null;
                    link.location = el_link.href;
                }
            });
        }
    };

    const isThirdPartyLink = (href) => {
        const destination = new URL(href);
        return !!destination.host
            && !/^.*\.binary\.com$/.test(destination.host) // destination host is not binary subdomain
            && window.location.host !== destination.host;
    };

    return {
        init,
        isThirdPartyLink,
    };
})();

module.exports = ThirdPartyLinks;