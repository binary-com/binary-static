const localize         = require('./localize').localize;
const State            = require('./storage').State;
const Client           = require('../app/base/client');
const BinarySocket     = require('../app/base/socket');
const Dialog           = require('../app/common/attach_dom/dialog');

const ThirdPartyLinks = (() => {
    const init = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('landing_company').then(() => {
                if (State.getResponse('landing_company.financial_company.shortcode') === 'maltainvest') {
                    document.body.addEventListener('click', clickHandler);
                }
            });
        }
    };

    const clickHandler = (e) => {
        if (!e.target) return;
        const link_el = e.target.closest('a');
        if (!link_el) return;
        // check that we are not inside third_party_redirect_dialog
        const dialog = document.querySelector('#third_party_redirect_dialog');
        if (dialog && dialog.contains(link_el)) return;

        if (isThirdPartyLink(link_el)) {
            e.preventDefault();
            Dialog.confirm({
                id: 'third_party_redirect_dialog',
                message: 'You will be redirected to a third-party website which is not owned by Binary.com. Click OK to proceed.',
            }).then((should_proceed) => {
                console.log(should_proceed);
                // manually open the link
            });
        }
    }

    const isThirdPartyLink = (href) => {
        const destination = new URL(href);
        return !!destination.host
            && !/^.*\.binary\.com$/.test(destination.host)
            && window.location.host !== destination.host;
    };

    return {
        init,
    };
})();

module.exports = ThirdPartyLinks;