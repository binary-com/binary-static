const Client   = require('../../../base/client').Client;
const localize = require('../../../base/localize').localize;
const Content  = require('../../../common_functions/content').Content;

const TopUpVirtual = (() => {
    'use strict';

    let $views;

    const view_ids = {
            error  : '#viewError',
            success: '#viewSuccess',
        },
        hidden_class = 'hidden';

    const onLoad = () => {
        Content.populate();

        $views = $('#topup_virtual .viewItem');
        $views.addClass(hidden_class);

        BinarySocket.send({ topup_virtual: '1' }).then((response) => {
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
            $('.barspinner').addClass(hidden_class);
        });
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

    return {
        onLoad: onLoad,
    };
})();

module.exports = TopUpVirtual;
