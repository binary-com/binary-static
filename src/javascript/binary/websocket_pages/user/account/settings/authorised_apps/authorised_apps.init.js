var Applications = (function() {
    "use strict";

    function responseHandler(response) {
        if (response.error && response.error.message) {
            return ApplicationsUI.displayError(response.error.message);
        }
        var apps = response.oauth_apps.map(ApplicationsData.parse);
        ApplicationsUI.update(apps);
    }

    function init() {
        ApplicationsUI.init();
        BinarySocket.init({
            onmessage: ApplicationsData.calls(responseHandler)
        });
        ApplicationsData.list();
    }

    function clean() {
        ApplicationsUI.clean();
    }

    return {
        init: init,
        clean: clean,
    };
})();
