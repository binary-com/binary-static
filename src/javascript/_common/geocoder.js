/* global google */
const scriptjs           = require('scriptjs');
const applyToAllElements = require('./utility').applyToAllElements;
const getElementById     = require('./common_functions').getElementById;
const Client             = require('../app/base/client');

const Geocoder = (() => {
    let el_btn_validate,
        el_error,
        el_success,
        loader,
        is_virtual;
    let validated = false;

    const init = (form_id) => {
        is_virtual = Client.get('is_virtual');

        scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', 'gMaps');

        const form = getElementById(form_id.split('#')[1]);
        const addr_1 = '#address_line_1';
        const addr_2 = '#address_line_2';
        const city   = '#address_city';
        const state  = '#address_state';
        const postcode  = '#address_postcode';
        const residence = Client.get('residence').toUpperCase();

        const getAddress = () => `${getValue(addr_1)}, ${getValue(addr_2)}, ${getValue(city)}, ${getValue(postcode)} ${getStateText(state)}, ${residence} `;

        el_btn_validate = form.querySelector('#geocode_validate');
        el_error        = form.querySelector('#geocode_error');
        el_success      = form.querySelector('#geocode_success');
        loader          = form.querySelector('.barspinner');

        applyToAllElements(`${addr_1}, ${addr_2}, ${postcode}, ${city}`, (element) => {
            // List of fields that will trigger onChange event but will allow empty values
            const non_required_fields = ['addr_2', 'postcode'];

            element.addEventListener('keyup', () => {
                const value = element.value;
                // Check if address_line_1 and address_state have values to fulfil condition
                const has_met_conditions = (getValue(city).length > 0) &&
                    (getValue(addr_1).length > 0) && getValue(state);

                if (value.length > 0 && !non_required_fields.includes(element.id) && has_met_conditions) {
                    el_btn_validate.classList.remove('button-disabled');
                } else if (!non_required_fields.includes(element.id) && has_met_conditions) {
                    el_btn_validate.classList.remove('button-disabled');
                } else {
                    el_btn_validate.classList.add('button-disabled');
                }
            });
        }, '', form);

        // using jQuery here because for some reason vanilla javascript eventListener isn't working for select input onChange events
        $(state).on('change', (e) => {
            if (e.target.value && (getValue(city).length > 0) && (getValue(addr_1).length > 0)) {
                el_btn_validate.classList.remove('button-disabled');
            }
        });

        el_btn_validate.addEventListener('click', (e) => {
            e.preventDefault();
            validator(getAddress()).then(() => {
                validated = true;
            });
        });
        el_error.parentNode.appendChild(el_btn_validate);
        if (el_btn_validate) el_btn_validate.setVisibility(1);
        el_error.setVisibility(0);

        if (validated || !getValue(addr_1).length || !getValue(state)) {
            el_btn_validate.classList.add('button-disabled');
        }

        if (is_virtual) {
            loader.setVisibility(0);
        }

        return {
            address: getAddress(),
        };
    };

    const getValue = (id) => getElementById(id.split('#')[1]).value || '';
    const getStateText = (id) => {
        const states_list_el = getElementById(id.split('#')[1]);
        return states_list_el.options[states_list_el.selectedIndex].text;
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
                    // Restrict Geolocation to client's country of residence and state
                    componentRestrictions: {
                        country           : Client.get('residence').toUpperCase(),
                        administrativeArea: getStateText('#address_state'),
                    },
                }, (result, status) => {
                    // Geocoding status reference:
                    // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingStatusCodes
                    const data = { result, status };
                    handleResponse(data);
                    resolve(data);
                });
            });
        })
    );

    const isAddressFound = (user_address, geoloc_address) => {
        let result = false;
        if (geoloc_address.length && getValue('#address_state')) {
            const address_string = geoloc_address[0].formatted_address;
            result = (address_string.indexOf(user_address) !== -1);
        }
        return result;
    };

    const handleResponse = (data) => {
        const is_address_found = isAddressFound(getValue('#address_city'), data.result);
        if (/ZERO_RESULTS|INVALID_REQUEST|UNKNOWN_ERROR/.test(data.status) || !is_address_found) {
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
