const Client   = require('../../../base/client').Client;
const Content  = require('../../../common_functions/content').Content;
const localize = require('../../../base/localize').localize;

const TopUpVirtual = (() => {
    'use strict';

    let container_id,
        hidden_class,
        view_ids,
        $views;

    const init = () => {
        container_id = '#topup_virtual';
        hidden_class = 'hidden';
        $views       = $(container_id + ' .viewItem');
        view_ids = {
            error  : '#viewError',
            success: '#viewSuccess',
        };

        $views.addClass(hidden_class);

        BinarySocket.send({ topup_virtual: '1' }).then((response) => {
            responseHandler(response);
        });
    };

    const responseHandler = (response) => {
        if (response.error) {
            showMessage(localize(response.error.message), false);
        } else {
            showMessage(
                localize('[_1] [_2] has been credited to your Virtual money account [_3]', [
                    response.topup_virtual.currency,
                    response.topup_virtual.amount,
                    Client.get('loginid'),
                ]),
                true);
        }
    };

    const showMessage = (message, is_success) => {
        const view_id = is_success ? view_ids.success : view_ids.error;
        setActiveView(view_id);
        $(view_id + ' > p').html(message);
    };

    const setActiveView = (view_id) => {
        $views.addClass(hidden_class);
        $(view_id).removeClass(hidden_class);
    };

    const onLoad = () => {
        Content.populate();
        TopUpVirtual.init();
    };

    return {
        init           : init,
        onLoad         : onLoad,
        responseHandler: responseHandler,
    };
})();

module.exports = TopUpVirtual;
