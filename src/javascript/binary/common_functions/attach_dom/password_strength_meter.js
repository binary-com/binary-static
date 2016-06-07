var PasswordMeter = (function(){
    'use strict';

    /**
     * attach password meter to DOM
     * @param $container       container for password meter, can be a p or div
     * @param id               optional id for meter element
     */
    function attach($container) {
        if (isIE()) return;
        var $meter = $('<meter></meter>', {id: 'password-meter', min: 0, max: 50, high: 20, low: 10, optimum: 50});
        $container
            .append($meter);
    }

    /**
     * Update password meter
     * @param $container        container for password meter, can be a p or div
     * @param newPW
     */
    function updateMeter($container, newPW) {
        var pwStrength = testPassword(newPW);
        var pwStrengthScore = pwStrength[0];

        $container.children('meter').val(pwStrengthScore);
    }

    return {
        attach: attach,
        updateMeter: updateMeter
    };
}());
