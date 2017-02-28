const japanese_client = require('../../../common_functions/country_base').japanese_client;
const Client          = require('../../../base/client').Client;

const SettingsWS = (function() {
    'use strict';

    const onLoad = function() {
        const classHidden = 'invisible',
            classReal   = '.real';

        if (!Client.get('is_virtual')) {
            // control-class is a fake class, only used to counteract ja-hide class
            $(classReal).not((japanese_client() ? '.ja-hide' : '.control-class')).removeClass(classHidden);
        } else {
            $(classReal).addClass(classHidden);
        }

        if (Client.get('has_password')) {
            $('#change_password').removeClass(classHidden);
        }

        $('#settingsContainer').removeClass(classHidden);
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SettingsWS;
