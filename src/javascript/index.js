const exportAllFunctions = (obj) => {
    Object.keys(obj).forEach((key) => {
        window[key] = obj[key];
    });
};

window.$ = window.jQuery = require('jquery');

require('babel-polyfill');
require('promise-polyfill');

// created for handling global onclick
exportAllFunctions(require('./binary/common_functions/attach_dom/handle_click'));
// used by gtm to update page after a new release
exportAllFunctions(require('./binary/common_functions/check_new_release'));

require('event-source-polyfill');
require('./lib/jquery.sparkline.js');
require('./lib/plugins');
require('jquery.scrollto');

const BinaryLoader = require('./binary/base/binary_loader');

$(window).on('load', BinaryLoader.init);
$(window).on('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.originalEvent.persisted) {
        BinaryLoader.init();
    }
});
