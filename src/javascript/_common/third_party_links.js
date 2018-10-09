const BinarySocket = require('../app/base/socket');
const Dialog       = require('../app/common/attach_dom/dialog');
const isEuCountry  = require('../app/common/country_base').isEuCountry;

const ThirdPartyLinks = (() => {
    const init = () => {
        // show third-party website redirect notification for logged in and logged out EU clients
        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            if (isEuCountry()) {
                document.body.addEventListener('click', clickHandler);
            }
        });
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
        let destination;
        try {
            destination = new URL(href);
        } catch (e) {
            return false;
        }
        return !!destination.host
            && !/^.*\.binary\.com$/.test(destination.host) // destination host is not binary subdomain
            && !/www.(betonmarkets|xodds).com/.test(destination.host) // destination host is not binary old domain
            && window.location.host !== destination.host;
    };

    return {
        init,
        isThirdPartyLink,
    };
})();

module.exports = ThirdPartyLinks;
