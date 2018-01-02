const exportAllFunctions = (obj) => {
    Object.keys(obj).forEach((key) => {
        window[key] = obj[key];
    });
};

window.$ = window.jQuery = require('jquery');

require('babel-polyfill');
require('promise-polyfill');
require('./_common/lib/polyfills/nodelist.foreach');

require('binary-style');
require('binary-style/binary.more');

// used by gtm to update page after a new release
exportAllFunctions(require('./_common/check_new_release'));

require('event-source-polyfill');
require('./_common/lib/jquery.sparkline.js');
require('./_common/lib/plugins');
require('jquery.scrollto');

const BinaryLoader = require('./app/base/binary_loader');

$(window).on('load', BinaryLoader.init);
$(window).on('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.originalEvent.persisted) {
        BinaryLoader.init();
    }
});
