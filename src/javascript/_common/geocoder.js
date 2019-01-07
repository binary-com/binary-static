/* global google */
const scriptjs           = require('scriptjs');
const getElementById     = require('./common_functions').getElementById;
const applyToAllElements = require('./utility').applyToAllElements;
const Client             = require('../app/base/client');

const Geocoder = (() => {
    let el_btn_validate,
        el_geocode_status,
        el_error,
        el_postcode_row,
        el_success,
        loader,
        has_currency,
        is_state_select_el,
        is_virtual;
    let validated = false;

    const init = (form_id) => {
        is_virtual = Client.get('is_virtual');
        has_currency = Client.get('currency');
        // TODO: We should store the Google API key in an unstaged file so it doesn't get committed to the public repository
        scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', 'gMaps');

        const form = getElementById(form_id.split('#')[1]);
        const addr_1 = '#address_line_1';
        const addr_2 = '#address_line_2';
        const city   = '#address_city';
        const state  = '#address_state';
        const postcode  = '#address_postcode';
        const residence = Client.get('residence').toUpperCase();

        is_state_select_el = (form.querySelector(state).tagName === 'SELECT');

        const getAddress = () => `${getValue(addr_1)}, ${getValue(addr_2)}, ${getValue(city)}, ${getValue(postcode)} ${is_state_select_el ? getStateText(state) : getValue(state)}, ${residence} `;

        el_btn_validate   = form.querySelector('#geocode_validate');
        el_geocode_status = form.querySelector('#geocode_status');
        el_error          = form.querySelector('#geocode_error');
        el_postcode_row   = form.querySelector('.postcode-form-row');
        el_success        = form.querySelector('#geocode_success');
        loader            = form.querySelector('.barspinner');

        if (el_btn_validate) {
            applyToAllElements(`${addr_1}, ${addr_2}, ${postcode}, ${!is_state_select_el ? state : undefined} ,${city}`, (element) => {
                // List of fields that will trigger event onChange but will allow empty values as they are non-required fields
                const non_required_fields = ['addr_2', 'postcode'];

                element.addEventListener('keyup', () => {
                    const value = element.value;
                    // Check if address_line_1, address_state and address city have values
                    const has_met_conditions = (getValue(city).length > 0) &&
                        (getValue(addr_1).length > 0) && getValue(state);

                    if (value.length > 0 && !non_required_fields.includes(element.id) && has_met_conditions) {
                        el_btn_validate.classList.remove('geocode-btn-disabled');
                    } else if (!non_required_fields.includes(element.id) && has_met_conditions) {
                        el_btn_validate.classList.remove('geocode-btn-disabled');
                    } else {
                        el_btn_validate.classList.add('geocode-btn-disabled');
                    }
                });
            }, '', form);

            el_btn_validate.addEventListener('click', (e) => {
                e.preventDefault();
                validator(getAddress()).then(() => {
                    validated = true;
                });
            });

            // using jQuery here because for some reason vanilla javascript eventListener isn't working for select input onChange events
            $(state).on('change', (e) => {
                if (e.target.value && (getValue(city).length > 0) && (getValue(addr_1).length > 0)) {
                    el_btn_validate.classList.remove('geocode-btn-disabled');
                }
            });

            el_btn_validate.setVisibility(1);

            if (validated || !getValue(addr_1).length || !getValue(state)) {
                el_btn_validate.classList.add('geocode-btn-disabled');
            }
        }

        el_postcode_row.parentNode.appendChild(el_geocode_status);

        if (el_error) {
            el_error.setVisibility(0);
        }

        if (is_virtual || !has_currency) {
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
                el_btn_validate.classList.add('geocode-btn-disabled');
                el_success.setVisibility(0);
                el_error.setVisibility(0);
                loader.setVisibility(1);
                geocoder.geocode({
                    address,
                    // Restrict Geolocation to client's country of residence and state
                    componentRestrictions: {
                        country           : Client.get('residence').toUpperCase(),
                        administrativeArea: is_state_select_el ? getStateText('#address_state') : getValue('#address_state'),
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

    const isAddressFound = (user_address, user_city, geoloc_address) => {
        let result;
        if (geoloc_address.length && getValue('#address_state')) {
            const item_idx = geoloc_address.length - 1;

            const country_longname = getElementById('country').innerHTML;
            const input_city = user_city.toLowerCase();
            const arr_input_address = user_address.toLowerCase().split(', ');

            const arr_address_components = geoloc_address[item_idx].address_components;
            const arr_address_list = [];

            // Create address dictionary string based on returned long and short named address components by Geolocation API
            arr_address_components.filter(address => {
                arr_address_list.push(address.long_name.split(' - ').join(' '));
                arr_address_list.push(address.short_name.split(' - ').join(' '));
            });

            // Filter out duplicates in address components
            const address_list_dictionary = arr_address_list.filter((elem, pos, arr) => arr.indexOf(elem) === pos).join(' ').toLowerCase();

            // Check if city exists, if true, check if first line of address exists
            if ((address_list_dictionary.indexOf(input_city) !== -1)
                && (user_address.toLowerCase() !== country_longname.toLowerCase())) {
                result = arr_input_address.some(address => address_list_dictionary.includes(address));
            }

        }
        return result;
    };

    const handleResponse = (data) => {
        const is_address_found = isAddressFound(getValue('#address_line_1'), getValue('#address_city'), data.result);
        if (/ZERO_RESULTS|INVALID_REQUEST|UNKNOWN_ERROR/.test(data.status) || !is_address_found) {
            el_error.setVisibility(1);
            el_success.setVisibility(0);
        } else {
            el_error.setVisibility(0);
            el_success.setVisibility(1);
        }
        loader.setVisibility(0);
    };

    return {
        init,
        validate,
    };
})();

module.exports = Geocoder;
