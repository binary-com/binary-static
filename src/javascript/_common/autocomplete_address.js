/* global google */
const scriptjs = require('scriptjs');
const Client   = require('../app/base/client');

const AutocompleteAddress = (() => {

    let autocomplete,
        residence,
        geocoder,
        map,
        marker,
        infowindow,
        infowindowContent;

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

            const el_address_line_1 = document.getElementById('address_line_1');

            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ componentRestrictions: { country: residence }}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: results[0].geometry.location,
                        zoom  : 4,
                    });

                    infowindow = new google.maps.InfoWindow();
                    infowindowContent = document.getElementById('infowindow-content');
                    infowindow.setContent(infowindowContent);

                    marker = new google.maps.Marker({
                        map,
                        anchorPoint: new google.maps.Point(0, -29),
                    });
                    marker.setPosition(results[0].geometry.location);

                    autocomplete = new google.maps.places.Autocomplete(
                        /** @type {!HTMLInputElement} */(el_address_line_1),
                        {
                            types                : ['geocode'],
                            componentRestrictions: {country: residence},
                        });

                    // Bind the map's bounds (viewport) property to the autocomplete object,
                    // so that the autocomplete requests use the current map bounds for the
                    // bounds option in the request.
                    autocomplete.bindTo('bounds', map);

                    autocomplete.addListener('place_changed', fillInAddress);

                    if (el_address_line_1.value) {
                        geocoder.geocode({ address: el_address_line_1.value}, (res, stat) => {
                            if (stat === google.maps.GeocoderStatus.OK) {
                                updateMap(res[0]);
                            }
                        });
                    }
                }
            });
        });
    };

    /*
     * Fill in address form
     */
    const fillInAddress = () => {
        const place = autocomplete.getPlace(); // Get the place details from the autocomplete object.

        const el_address_line_1   = document.getElementById('address_line_1');
        const el_address_line_2   = document.getElementById('address_line_2');
        const el_address_city     = document.getElementById('address_city');
        const el_address_state    = document.getElementById('address_state');
        const el_address_postcode = document.getElementById('address_postcode');

        const address_line_1_data = [];
        const address_line_2_data = [];
        let has_city = false;

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
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

        updateMap(place);
    };

    /*
     * Update google map, marker and infowindow
     *
     * @param {Object} place - google autocomplete object
     */
    const updateMap = (place) => {
        if (place.geometry.viewport) { // If the place has a geometry, then present it on a map.
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || ''),
            ].join(' ');
        }

        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);
    };

    const trimString = (val, wordToTrim) => (val.replace(wordToTrim, '').trim(''));

    return {
        init,
    };
})();

module.exports = AutocompleteAddress;
