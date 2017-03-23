const localize = require('../base/localize').localize;

const Content = (() => {
    'use strict';

    const errorMessage = (messageType, param) => {
        let msg = '';
        switch (messageType) {
            case 'req':
                msg = localize('This field is required.');
                break;
            case 'reg':
                if (param) msg = localize('Only [_1] are allowed.', [param.join(', ')]);
                break;
            case 'range':
                if (param) msg = localize('You should enter between [_1] characters.', [param]);
                break;
            case 'valid':
                if (param) msg = localize('Please submit a valid [_1].', [param]);
                break;
            case 'min':
                if (param) msg = localize('Minimum of [_1] characters required.', [param]);
                break;
            case 'number_should_between':
                if (param) msg = localize('Please enter a number between [_1].', [param]);
                break;
            default:
                break;
        }
        return msg;
    };

    return {
        errorMessage: errorMessage,
    };
})();

module.exports = Content;
