var config = require('./config');
var pjax = require('./binary/base/pjax');

require('./binary/static_pages/endpoint');

// TODO: to be remove after webpack finalized
var exportAllFunctions = function exportAllFunctions(obj) {
    for ( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            window[key] = obj[key];
        }
    }
};

exportAllFunctions(config);
exportAllFunctions(pjax);
