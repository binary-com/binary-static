/* global google */
const scriptjs = require('scriptjs');
const Client   = require('../app/base/client');

const AutocompleteAddress = (() => {

    let autocomplete,
        residence;

    // Address components reference: https://developers.google.com/maps/documentation/geocoding/intro#Types
    const component_form = {
        street_number              : 'short_name',
        route                      : 'long_name',
        locality                   : 'long_name',
        sublocality                : 'long_name',
        ward                       : 'long_name',
        administrative_area_level_1: 'short_name',
        administrative_area_level_2: 'short_name',
        administrative_area_level_3: 'short_name',
        administrative_area_level_4: 'short_name',
        administrative_area_level_5: 'short_name',
        country                    : 'long_name',
        postal_code                : 'short_name',
    };

    const init = () => {
        scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', () => {
            if (!residence) residence = Client.get('residence');

            autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('address_line_1')),
                {
                    types                : ['geocode'],
                    componentRestrictions: {country: residence},
                });
            autocomplete.addListener('place_changed', fillInAddress);
        });
    };

    const fillInAddress = () => {
        const el_address_line_1   = document.getElementById('address_line_1');
        const el_address_line_2   = document.getElementById('address_line_2');
        const el_address_city     = document.getElementById('address_city');
        const el_address_state    = document.getElementById('address_state');
        const el_address_postcode = document.getElementById('address_postcode');

        const place = autocomplete.getPlace(); // Get the place details from the autocomplete object.

        const address_line_1_data = [];
        const address_line_2_data = [];
        let has_city = false;
        // Get each component of the address from the place details and fill the corresponding field on the form.
        for (let i = 0; i < place.address_components.length; i++) {
            const address_type = place.address_components[i].types[0];
            if (component_form[address_type]) {
                const val = place.address_components[i][component_form[address_type]];
                if (/street_number|route|neighborhood/.test(address_type)) {
                    address_line_1_data.push(val);
                }
                if (/(administrative_area_level_3|administrative_area_level_4|administrative_area_level_5)/.test(address_type)) {
                    address_line_2_data.push(val);
                }
                if (/locality|sublocality|ward|administrative_area_level_2/.test(address_type)) {
                    if (!has_city) {
                        el_address_city.value = trimString(val, 'Kota');
                        has_city = true;
                    }
                }
                if (/administrative_area_level_1/.test(address_type)) {
                    if (val.length <= 2) { // search state by dd value attribute
                        el_address_state.value = val;
                    } else {               // search state by dd text value
                        el_address_state.selectedIndex =
                            [...el_address_state.options].findIndex(option => option.text === val);
                    }
                }
                if (/postal_code/.test(address_type)) {
                    el_address_postcode.value = val;
                }
            }
        }
        el_address_line_1.value = address_line_1_data.join(', ');
        el_address_line_2.value = address_line_2_data.join(', ');
    };

    const trimString = (val, wordToTrim) => (val.replace(wordToTrim, '').trim(''));

    return {
        init,
    };
})();

module.exports = AutocompleteAddress;
