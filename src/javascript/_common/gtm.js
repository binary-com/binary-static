const Cookies       = require('js-cookie');
const createElement = require('./utility').createElement;
const BinarySocket  = require('../app/base/socket');
const isEuCountry   = require('../app/common/country_base').isEuCountry;

const GTM = (() => {

    const loadGTMElements = () => {
        if (document.body) {
            const noscript = createElement('noscript');
            noscript.innerHTML = '<iframe src="//www.googletagmanager.com/ns.html?id=GTM-MZWFF7" height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe>';

            document.body.appendChild(noscript);
            document.body.appendChild(createElement('script', {
                'data-cfasync': 'false',
                html          : '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="//www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-MZWFF7");',
            }));
        }
    };

    /**
     * initialize GTM appending script to body
     */
    const init = () => {
        BinarySocket.wait('website_status', 'landing_company').then(() => {
            if (isEuCountry()) {
                if (Cookies.get('CookieConsent')) {
                    loadGTMElements();
                }
            } else {
                loadGTMElements();
            }
        });
    };
    
    return {
        init,
        loadGTMElements,
    };
})();

module.exports = GTM;
