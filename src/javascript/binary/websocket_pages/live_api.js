var LiveAPI = (function() {
    var events = {};
    var initialised = false;
    var sockPromise = null;

    return function() {
        if (initialised) {
            return sockPromise;
        }
        initialised = true;
        var apiUrl = getSocketURL() + '?app_id=' + getAppId() + (page.language() ? '&l=' + page.language() : '');
        var sock = new window['binary-live-api'].LiveApi({
            apiUrl: apiUrl,
        });
        var apiToken = CommonData.getLoginToken();
        if (apiToken && localStorage.getItem('client.tokens')) {
            sockPromise = sock.authorize(apiToken).then(function(response) {
                return sock;
            });
            return sockPromise;
        }
        sockPromise = Promise.resolve(sock);
        return sockPromise;
    };
})();

LiveAPI.send = function(data) {
    return LiveAPI().then(function(s) {
        return s.send(data);
    });
};

LiveAPI().then(function(api) {
    function getTime() {
        var client_time = moment().valueOf();
        api.send({time: 1})
           .then(function(response) {
               window.clock_started = true;
               page.header.time_counter(response, client_time);
           });
    }
    getTime();
    setInterval(getTime, 30 * 1000);
});
