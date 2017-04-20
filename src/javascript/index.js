import 'babel-polyfill';
import 'promise-polyfill';
import 'event-source-polyfill';
import 'jquery.scrollto';
import './lib/jquery.sparkline';
import './binary/components/trackjs_onerror';
import BinaryLoader from './binary/base/binary_loader';

const exportAllFunctions = (obj) => {
    Object.keys(obj).forEach((key) => {
        window[key] = obj[key];
    });
};

window.$ = window.jQuery = require('jquery');

// TODO: refactor and remove global status of socket
exportAllFunctions(require('./binary/websocket_pages/socket'));

// created for handling global onclick
exportAllFunctions(require('./binary/common_functions/attach_dom/handle_click'));
// used by gtm to update page after a new release
exportAllFunctions(require('./binary/common_functions/check_new_release'));

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
