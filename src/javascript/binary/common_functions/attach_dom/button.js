var Button = (function() {
    'use strict';

    function createBinaryStyledButton() {
        var span = $('<span></span>', { class: 'button' });
        var button = $('<button></button>', { class: 'button' });
        span.append(button);

        return span;
    }

    return {
        createBinaryStyledButton: createBinaryStyledButton,
    };
})();

module.exports = {
    Button: Button,
};
