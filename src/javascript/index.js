const exportAllFunctions = (obj) => {
    Object.keys(obj).forEach((key) => {
        window[key] = obj[key];
    });
};

window.$ = window.jQuery = require('jquery');

require('babel-polyfill');
require('promise-polyfill');

// TODO: refactor and remove global status of socket
exportAllFunctions(require('./binary/websocket_pages/socket'));

// created for handling global onclick
exportAllFunctions(require('./binary/common_functions/attach_dom/handle_click'));
// used by gtm to update page after a new release
exportAllFunctions(require('./binary/common_functions/check_new_release'));

require('event-source-polyfill');
require('./lib/jquery.sparkline.js');
require('jquery.scrollto');

require('./binary/components/trackjs_onerror');

const BinaryLoader = require('./binary/base/binary_loader');

$(window).on('load', BinaryLoader.init);

Element.prototype.hide = function() {
    this.style.display = 'none';
};

Element.prototype.show = function() {
    this.style.display = '';
};

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

(function ($) {
    $.fn.setVisibility = function(make_visible) {
        if (make_visible) {
            this.removeClass('invisible');
        } else {
            this.addClass('invisible');
        }
    };
})(jQuery);
