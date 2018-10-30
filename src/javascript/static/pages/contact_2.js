const initPhoneNumber = require('./contact').initPhoneNumber;
const Elevio          = require('../../_common/base/elevio');
const BinarySocket    = require('../../_common/base/socket_base');
const BinaryPjax      = require('../../app/base/binary_pjax');

const Contact = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status').then(() => {
            if (Elevio.isAvailable()) {
                initPhoneNumber(true);
                window._elev.on('ready', embedElevioComponents); // eslint-disable-line no-underscore-dangle

                $('#contact_2_loading').remove();
                $('#contact_2').setVisibility(true);
            } else {
                BinaryPjax.load('contact', true);
            }
        });
    };

    const embedElevioComponents = () => {
        const component_types = ['menu', 'search', 'suggestions'];
        component_types.forEach((type) => {
            $(`#elevio_element_${type}`).html(Elevio.createComponent(type));
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Contact;
