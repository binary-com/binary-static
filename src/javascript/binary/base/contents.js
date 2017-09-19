const Client = require('./client');

const Contents = (() => {
    const onLoad = () => {
        Client.activateByClientType('header');
        // This is required for our css to work.
        document.getElementById('content').className = document.getElementById('content_class').textContent;
    };

    return {
        onLoad,
    };
})();

module.exports = Contents;
