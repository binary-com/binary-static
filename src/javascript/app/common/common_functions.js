const State        = require('../../_common/storage').State;
const Client       = require('../../app/base/client');
const BinarySocket = require('../../app/base/socket');
const isEuCountry  = require('../../app/common/country_base').isEuCountry;

const hideEU = () => {
    BinarySocket.wait('website_status', 'authorize').then(() => {
        const residence = Client.get('residence');
        if ((!residence && State.get('is_eu')) || (residence && isEuCountry(residence))) {
            $('.eu-hide').setVisibility(0);
            $('.eu-show').setVisibility(1);
            $('.eu-hide-parent').parent().setVisibility(0);
        }
    });
};

module.exports = {
    hideEU,
};
