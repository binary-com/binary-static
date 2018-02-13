/* global google */
const scriptjs = require('scriptjs');
const Client   = require('../app/base/client');
const localize = require('../_common/localize').localize;

const Geocoder = (() => {
    const validate = (address, residence) => (
        new Promise((resolve) => {
            scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', () => {
                const country  = Client.get('residence') || residence;
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
        const $geocode_error = $('#geocode-error');

        if (/ZERO_RESULTS|INVALID_REQUEST/.test(status)) {
            if ($geocode_error.length) {
                $geocode_error.fadeIn(0);
                return;
            }
            const $last_child= $('#address_form').children(':last');
            $last_child.parent().append($('<p/>', {
                id   : 'geocode-error',
                class: 'notice-msg no-margin',
                text : localize('Your address could not be verified by our automated system. You may proceed but please ensure that your address is complete.'),
            }));
        } else {
            $geocode_error.fadeOut(0);
        }
    };

    return {
        validate,
    };
})();

module.exports = Geocoder;
