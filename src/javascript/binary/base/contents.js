const Client = require('./client');

const Contents = (() => {
    const onLoad = () => {
        Client.activateByClientType('header');
        const content = document.getElementById('content');
        if (!content) {
            return;
        }
        let new_class = '';
        const content_class = document.getElementById('content_class');
        if (content_class) {
            new_class = content_class.textContent;
        }
        // This is required for our css to work.
        content.className = new_class;
    };

    return {
        onLoad,
    };
})();

module.exports = Contents;
