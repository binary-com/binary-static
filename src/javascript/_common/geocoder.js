/* global google */
const scriptjs           = require('scriptjs');
const applyToAllElements = require('./utility').applyToAllElements;
const createElement      = require('./utility').createElement;
const Client             = require('../app/base/client');
const localize           = require('../_common/localize').localize;

const Geocoder = (() => {
    let el_btn_validate,
        el_error;
    let validated = false;

    const init = (form_id) => {
        scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', 'gMaps');

        const form = document.getElementById(form_id.split('#')[1]);
        const addr_1 = '#address_line_1';
        const addr_2 = '#address_line_2';
        const city   = '#address_city';
        const state  = '#address_state';
        const postcode  = '#address_postcode';
        const residence = Client.get('residence');

        const getValue = (id) => document.getElementById(id.split('#')[1]).value || '';
        const getAddress = () => `${getValue(addr_1)} ${getValue(addr_2)}, ${getValue(city)}, ${getValue(state)} ${getValue(postcode)}, ${residence}`;

        form.querySelector(city).addEventListener('change', () => {
            if (getValue(addr_1).length && getValue(city).length && !validated) {
                validator(getAddress()).then(() => {
                    validated = true;
                });
            }
        });

        el_error = form.querySelector('#geocode_error');
        applyToAllElements(`${addr_1}, ${addr_2}, ${city}, ${postcode}`, (element) => {
            element.addEventListener('keyup', () => {
                if (validated && !el_btn_validate) {
                    el_btn_validate = createElement('button', {
                        id   : 'geocode_validate',
                        class: 'button-secondary',
                        text : localize('Validate address'),
                    });
                    el_btn_validate.addEventListener('click', (e) => {
                        e.preventDefault();
                        validator(getAddress()).then(() => {
                            validated = true;
                        });
                    });
                    el_error.parentNode.appendChild(el_btn_validate);
                }
                if (el_btn_validate) el_btn_validate.setVisibility(1);
                el_error.setVisibility(0);
            });
        }, '', form);

        return {
            address: getAddress(),
        };
    };

    const validate = (form_id) => {
        const address = init(form_id).address;
        validator(address).then(() => {
            validated = true;
        });
    };

    const validator = (address) => (
        new Promise((resolve) => {
            scriptjs.ready('gMaps', () => {
                const country  = Client.get('residence');
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    address,
                    componentRestrictions: { country },
                }, (result, status) => {
                    // Geocoding status reference:
                    // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingStatusCodes
                    handleResponse(status);
                    resolve(status);
                });
            });
        })
    );

    const handleResponse = (status) => {
        if (/ZERO_RESULTS|INVALID_REQUEST/.test(status)) {
            el_error.setVisibility(1);
            if (el_btn_validate) el_btn_validate.setVisibility(0);
        } else {
            el_error.setVisibility(0);
            if (el_btn_validate) el_btn_validate.setVisibility(0);
        }
    };

    return {
        init,
        validate,
    };
})();

module.exports = Geocoder;
