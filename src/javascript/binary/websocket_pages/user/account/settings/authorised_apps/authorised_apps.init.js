var Applications = (function() {
    "use strict";

    function responseHandler(msg) {
        var response = JSON.parse(msg.data);
        if (!response || response.msg_type !== 'oauth_apps') {
            return;
        }
        if (response.error && response.error.message) {
            return ApplicationsUI.displayError(response.error.message);
        }
        var apps = response.oauth_apps.map(ApplicationsData.parse);
        ApplicationsUI.update(apps);
    }

    function makeRequest() {
        BinarySocket.send({oauth_apps: 1});
    }

    function revokeApplication(id) {
        if (!id) {
            return;
        }
        BinarySocket.send({oauth_apps: 1, revoke_app: id});
    }

    function init() {
        ApplicationsUI.init();
        BinarySocket.init({
            onmessage: responseHandler
        });
        makeRequest();
    }

    function clean() {
        ApplicationsUI.clean();
    }

    return {
        init: init,
        revokeApplication: revokeApplication,
        clean: clean,
    };
})();
