(function () {
    'use strict';

    var oldOnError = window.onerror;
    window.jsErrors = [];

    window.onerror = function (errorMessage, url, line) {

        window.jsErrors.push(errorMessage); // todo: refactor to Binary.jsErrors later
        
        if (oldOnError) {
            oldOnError(errorMessage, url, line);
        }
    };
})();
