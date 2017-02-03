const ApplicationsUI   = require('./authorised_apps.ui').ApplicationsUI;
const ApplicationsData = require('./authorised_apps.data').ApplicationsData;

const Applications = (function() {
    'use strict';

    const responseHandler = function(response) {
        if (response.error && response.error.message) {
            return ApplicationsUI.displayError(response.error.message);
        }
        const apps = response.oauth_apps.map(ApplicationsData.parse);
        return ApplicationsUI.update(apps);
    };

    const init = function() {
        ApplicationsUI.init();
        BinarySocket.init({
            onmessage: ApplicationsData.calls(responseHandler),
        });
        ApplicationsData.list();
    };

    const clean = function() {
        ApplicationsUI.clean();
    };

    return {
        init : init,
        clean: clean,
    };
})();

module.exports = {
    Applications: Applications,
};
