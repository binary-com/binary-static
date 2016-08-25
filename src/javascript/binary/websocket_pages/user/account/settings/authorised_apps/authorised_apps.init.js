var Applications = (function() {
    "use strict";

    function init() {
        ApplicationsUI.init();
        ApplicationsData.list()
            .then(function(response) {
                ApplicationsUI.update(response.oauth_apps);
            })
            .catch(function(error) {
                ApplicationsUI.displayError(error.message);
            });
    }

    function clean() {
        ApplicationsUI.clean();
    }

    return {
        init: init,
        clean: clean,
    };
})();
