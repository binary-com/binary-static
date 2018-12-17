/* global google */
const scriptjs           = require('scriptjs');
const applyToAllElements = require('./utility').applyToAllElements;
const getElementById     = require('./common_functions').getElementById;
const Client             = require('../app/base/client');

const Geocoder = (() => {
    let el_btn_validate,
        el_error,
        el_success,
        loader;
    let validated = false;

    const init = (form_id) => {
        scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', 'gMaps');

        const form = getElementById(form_id.split('#')[1]);
        const addr_1 = '#address_line_1';
        const addr_2 = '#address_line_2';
        const city   = '#address_city';
        const state  = '#address_state';
        const postcode  = '#address_postcode';
        const residence = Client.get('residence');

        const getValue = (id) => getElementById(id.split('#')[1]).value || '';
        const getAddress = () => `${getValue(addr_1)} ${getValue(addr_2)}, ${getValue(city)}, ${getValue(state)} ${getValue(postcode)}, ${residence}`;

        el_btn_validate = form.querySelector('#geocode_validate');
        el_error        = form.querySelector('#geocode_error');
        el_success      = form.querySelector('#geocode_success');
        loader          = form.querySelector('.barspinner');

        applyToAllElements(`${addr_1}, ${city}`, (element) => {
            element.addEventListener('keyup', () => {
                const value = element.value;
                if (value.length < 1) {
                    el_btn_validate.classList.add('button-disabled');
                } else {
                    el_btn_validate.classList.remove('button-disabled');
                }
            });
        }, '', form);
        el_btn_validate.addEventListener('click', (e) => {
            e.preventDefault();
            validator(getAddress()).then(() => {
                validated = true;
            });
        });
        el_error.parentNode.appendChild(el_btn_validate);
        if (el_btn_validate) el_btn_validate.setVisibility(1);
        el_error.setVisibility(0);

        if (validated) {
            el_btn_validate.classList.add('button-disabled');
        }

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
                const geocoder = new google.maps.Geocoder();
                el_success.setVisibility(0);
                el_error.setVisibility(0);
                loader.setVisibility(1);
                geocoder.geocode({
                    address,
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
            el_success.setVisibility(0);
        } else {
            el_error.setVisibility(0);
            el_success.setVisibility(1);
        }
        loader.setVisibility(0);
        el_btn_validate.classList.add('button-disabled');
    };

    return {
        init,
        validate,
    };
})();

module.exports = Geocoder;
