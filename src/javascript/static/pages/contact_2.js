const initPhoneNumber = require('./contact').initPhoneNumber;
const Elevio          = require('../../_common/base/elevio');

const Contact = (() => {
    const onLoad = () => {
        initPhoneNumber(true);
        window._elev.on('ready', embedElevioComponents); // eslint-disable-line no-underscore-dangle

        $('#contact_2_loading').remove();
        $('#contact_2').setVisibility(1);
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
