const BinarySocket = require('../../app/base/socket');
const isEuCountry  = require('../../app/common/country_base').isEuCountry;
const isIndonesia  = require('../../app/common/country_base').isIndonesia;

const hideEU = () => {
    BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
        if (isEuCountry()) {
            $('.eu-hide').setVisibility(0);
            $('.eu-show').setVisibility(1);
            $('.eu-hide-parent').parent().setVisibility(0);
        }
        $('.id-show').setVisibility(isIndonesia());
    });
};

module.exports = {
    hideEU,
};
