const localize     = require('./localize').localize;
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
        document.body.addEventListener('click', checkTelegram);
    };

    const checkTelegram = (e) => {
        if (!e.target) return;
        const el_link = e.target.closest('a');
        if (!el_link) return;

        const dialog = document.querySelector('#telegram');
        if (dialog && dialog.contains(el_link)) return;

        if (isTelegramLink(el_link.href)) {
            e.preventDefault();
            // show a popup to remind clients to have Telegram app installed on their device
            Dialog.confirm({
                id               : 'telegram',
                localized_message: localize(['Please ensure that you have the Telegram app installed on your device.', 'Click OK to proceed.']),
            }).then((should_proceed) => {
                if (should_proceed) {
                    openThirdPartyLink(el_link.href);
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
                id               : 'third_party_redirect_dialog',
                localized_message: localize(['You will be redirected to a third-party website which is not owned by Binary.com.', 'Click OK to proceed.']),
            }).then((should_proceed) => {
                if (should_proceed) {
                    openThirdPartyLink(el_link.href);
                }
            });
        }
    };

    const openThirdPartyLink = (href) => {
        const link = window.open();
        link.opener = null;
        link.location = href;
    };

    const isTelegramLink = (href) => /t\.me/.test(href);

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
