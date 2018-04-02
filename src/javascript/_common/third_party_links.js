const localize = require('./localize').localize;

const ThirdPartyLinks = (() => {
    const init = () => {
        document.body.addEventListener('click', (e) => {
            if (!e.target) return;
            const link_el = e.target.closest('a');
            console.log(isThirdPartyLink(link_el));
            if (link_el && isThirdPartyLink(link_el)) {
                // TODO: replace with custom popup
                const should_proceed = window.confirm(localize('You will be redirected to a third-party website which is not owned by Binary.com. Click OK to proceed.'));
                if (!should_proceed) e.preventDefault();
            }
        });
    };

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