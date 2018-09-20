const getElementById = require('../../_common/common_functions').getElementById;
const State          = require('../../_common/storage').State;
const Client         = require('../../app/base/client');
const BinarySocket   = require('../../app/base/socket');
const isEuCountry    = require('../../app/common/country_base').isEuCountry;

const hideEU = (id_to_show) => {
    BinarySocket.wait('website_status', 'authorize').then(() => {
        const residence = Client.get('residence');
        if ((!residence && State.get('is_eu')) || (residence && isEuCountry(residence))) {
            $('.eu-hide').setVisibility(0);
            $('.eu-hide-parent').parent().setVisibility(0);
        }
        if (id_to_show) {
            getElementById('loading').setVisibility(0);
            getElementById(id_to_show).setVisibility(1);
        }
    });
};

module.exports = {
    hideEU,
};
