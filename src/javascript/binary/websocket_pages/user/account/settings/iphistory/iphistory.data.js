var IPHistoryQueue = (function() {
    "use strict";

    var buffer = [];
    var callbacks = [];
    var pending = false;

    function fetchNext(params) {
        if (pending) {
            buffer.push(params);
            return;
        }
        var request = {login_history: 1};
        if (params) {
            $.extend(request, params);
        }
        BinarySocket.send(request);
        pending = true;
    }

    // to be added to onmessage of BinarySocket.init
    function responseHandler(msg) {
        var response = JSON.parse(msg.data);
        if (response && response.msg_type == 'login_history') {
            pending = false;
            callbacks.forEach(function(f) {
                f(response);
            });
            if (buffer.length) {
                var first = buffer.shift();
                fetchNext(first);
            }
        }
    }

    function register(callback) {
        callbacks.push(callback);
    }

    function clear() {
        callbacks = [];
        buffer = [];
    }

    return {
        responseHandler: responseHandler,
        fetchNext: fetchNext,
        clear: clear,
    };
})();
