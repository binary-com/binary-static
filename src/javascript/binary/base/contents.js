const Client = require('./client');

const Contents = (() => {
    'use strict';

    const onLoad = () => {
        Client.activateByClientType('#header');
        // This is required for our css to work.
        $('#content').removeClass().addClass($('#content_class').text());
    };

    const onUnload = () => {
        // TODO: remove unbind_later class and off() at needed pages
        $('.unbind_later').off();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = Contents;
