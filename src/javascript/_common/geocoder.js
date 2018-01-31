/* global google */
const scriptjs = require('scriptjs');
const Client   = require('../app/base/client');

const Geocoder = (() => {

    let residence,
        geocoder;

    const validate = (address) => (
        new Promise((resolve) => {
            scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyAEha6-HeZuI95L9JWmX3m6o-AxQr_oFqU&libraries=places', () => {
                if (!residence) residence = Client.get('residence');
                if (!geocoder) geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    address,
                    componentRestrictions: { country: residence },
                }, (result, status) => {
                    // Geocoding status reference:
                    // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingStatusCodes
                    resolve(status);
                });
            });
        })
    );

    return {
        validate,
    };
})();

module.exports = Geocoder;
