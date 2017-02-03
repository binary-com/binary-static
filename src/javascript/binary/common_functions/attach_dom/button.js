const Button = (function() {
    'use strict';

    const createBinaryStyledButton = function() {
        const span = $('<span></span>', { class: 'button' });
        const button = $('<button></button>', { class: 'button' });
        span.append(button);

        return span;
    };

    return {
        createBinaryStyledButton: createBinaryStyledButton,
    };
})();

module.exports = {
    Button: Button,
};
