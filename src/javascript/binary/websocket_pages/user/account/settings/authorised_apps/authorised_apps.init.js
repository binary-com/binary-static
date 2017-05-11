const ApplicationsData = require('./authorised_apps.data');
const ApplicationsUI   = require('./authorised_apps.ui');
const BinarySocket     = require('../../../../socket');

const ApplicationsInit = (() => {
    'use strict';

    const init = () => {
        ApplicationsUI.init();
        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            if (response.error) {
                ApplicationsUI.displayError(response.error.message);
            } else {
                ApplicationsUI.update(response.oauth_apps.map(ApplicationsData.parse));
            }
        });
    };

    const clean = () => {
        ApplicationsUI.clean();
    };

    return {
        init : init,
        clean: clean,
    };
})();

module.exports = ApplicationsInit;
