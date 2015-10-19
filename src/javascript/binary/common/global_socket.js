/**
 * Created by qingwei on 14/10/2015.
 */

const GlobalSocket = (function () {
    "use strict";

    function attemptAuthorize(apiSocket){
        if (apiSocket.isAuthorized) {
            return;
        }

        function setAuthorized(wsResponse){
            const json = JSON.parse(wsResponse.data);
            if (json.error) {
                apiSocket.isAuthorized = false;
            } else {
                apiSocket.isAuthorized = true;
            }
        }

        const token = CommonData.getApiToken();
        if (token) {
            apiSocket.authorize(token).then(setAuthorized, function(err){
                console.error(err);
            });
        }
    }

    const api = new LiveApi();

    const autoAuthorizedSocket = Object.create(api);
    autoAuthorizedSocket.isAuthorized = false;

    const msgTypeRequiredAuth = ["balance", ""];

    //TODO: change to proper decorator pattern
    api.onOpen = function(){
        api.sendBufferedSends();
        api.executeBufferedExecutes();
        if (autoAuthorizedSocket.isAuthorized === false) {
            attemptAuthorize(autoAuthorizedSocket);
        }
    };

    return autoAuthorizedSocket;

}());