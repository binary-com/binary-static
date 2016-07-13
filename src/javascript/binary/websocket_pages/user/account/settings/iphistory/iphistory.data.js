var IPHistoryQueue = (function() {
    "use strict";

    var callbacks = [];

    function fetchNext(params) {
        var request = {login_history: 1};
        if (params) {
            $.extend(request, params);
        }
        BinarySocket.send(request);
    }

    // to be added to onmessage of BinarySocket.init
    function responseHandler(msg) {
        var response = JSON.parse(msg.data);
        if (response && response.msg_type == 'login_history') {
            callbacks.forEach(function(f) {
                f(response);
            });
        }
    }

    function register(callback) {
        callbacks.push(callback);
    }

    function clear() {
        callbacks = [];
    }

    return {
        responseHandler: responseHandler,
        register: register,
        fetchNext: fetchNext,
        clear: clear,
    };
})();
