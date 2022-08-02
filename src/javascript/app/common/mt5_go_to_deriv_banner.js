const getElementById = require('../../_common/common_functions').getElementById;
const getLanguage    = require('../../_common/language').get;

const Mt5GoToDerivBanner = (() => {
    const classname = 'mt5_go_to_deriv_banner';

    const onLoad = () => {
        getElementById(`${classname}-link`).href = `https://app.deriv.com/mt5?lang=${getLanguage()}`;
        getElementById(`${classname}_container`).setVisibility(1);
    };

    return { onLoad };
})();

module.exports = Mt5GoToDerivBanner;
