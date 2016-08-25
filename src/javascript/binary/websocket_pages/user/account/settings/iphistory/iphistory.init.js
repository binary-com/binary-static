var IPHistory = (function() {
    'use strict';

    function init() {
        IPHistoryUI.init();
        IPHistoryData.get(50).then(function(response) {
            var parsed = response.login_history.map(IPHistoryData.parse);
            IPHistoryUI.update(parsed);
        }).catch(function(error) {
            return IPHistoryUI.displayError(error.message);
        });
    }

    function clean() {
        IPHistoryUI.clean();
    }

    return {
        init: init,
        clean: clean,
    };
})();
