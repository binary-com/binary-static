const Client = require('./client');

const Contents = (() => {
    'use strict';

    const onLoad = () => {
        Client.activateByClientType('#header');
        // This is required for our css to work.
        $('#content').removeClass().addClass($('#content_class').text());
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Contents;
