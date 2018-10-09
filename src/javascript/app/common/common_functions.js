const BinarySocket = require('../../app/base/socket');
const isEuCountry  = require('../../app/common/country_base').isEuCountry;

const hideEU = () => {
    BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
        if (isEuCountry()) {
            $('.eu-hide').setVisibility(0);
            $('.eu-show').setVisibility(1);
            $('.eu-hide-parent').parent().setVisibility(0);
        }
    });
};

module.exports = {
    hideEU,
};
