const getPropertyValue = require('./utility').getPropertyValue;
const Client           = require('../app/base/client');
const BinarySocket     = require('../app/base/socket');
const Dialog           = require('../app/common/attach_dom/dialog');

const ThirdPartyLinks = (() => {
    const init = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('landing_company').then((response) => {
                if (getPropertyValue(response, ['landing_company', 'financial_company', 'shortcode'])) {
                    document.body.addEventListener('click', clickHandler);
                }
            });
        }
    };

    const clickHandler = (e) => {
        if (!e.target) return;
        const link_el = e.target.closest('a');
        if (!link_el) return;

        const dialog = document.querySelector('#third_party_redirect_dialog');
        if (dialog && dialog.contains(link_el)) return;

        if (isThirdPartyLink(link_el.href)) {
            e.preventDefault();
            Dialog.confirm({
                id     : 'third_party_redirect_dialog',
                // TODO: pass array of sentences once negar/show_malta_popup_mt card is merged
                message: 'You will be redirected to a third-party website which is not owned by Binary.com. Click OK to proceed.',
            }).then((should_proceed) => {
                if (should_proceed) window.open(link_el.href, '_blank');
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