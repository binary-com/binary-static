const Content  = require('../../../common_functions/content').Content;
const localize = require('../../../base/localize').localize;
const Client   = require('../../../base/client').Client;

const TopUpVirtualWS = (function() {
    'use strict';

    let containerID,
        viewIDs,
        hiddenClass,
        $views;

    const init = function() {
        containerID = '#topup_virtual';
        hiddenClass = 'hidden';
        $views      = $(containerID + ' .viewItem');
        viewIDs = {
            error  : '#viewError',
            success: '#viewSuccess',
        };

        $views.addClass('hidden');

        if (!Client.get('is_virtual')) {
            showMessage(localize('Sorry, this feature is available to virtual accounts only.'), false);
        } else {
            BinarySocket.send({ topup_virtual: '1' });
        }
    };

    const responseHandler = function(response) {
        if ('error' in response) {
            if ('message' in response.error) {
                showMessage(localize(response.error.message), false);
            }
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

    const showMessage = function(message, isSuccess) {
        const viewID = isSuccess ? viewIDs.success : viewIDs.error;
        setActiveView(viewID);
        $(viewID + ' > p').html(message);
    };

    const setActiveView = function(viewID) {
        $views.addClass(hiddenClass);
        $(viewID).removeClass(hiddenClass);
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    if (response.msg_type === 'authorize') {
                        TopUpVirtualWS.init();
                    } else if (response.msg_type === 'topup_virtual') {
                        TopUpVirtualWS.responseHandler(response);
                    }
                }
            },
        });
        Content.populate();
        if (Client.get('is_virtual')) {
            TopUpVirtualWS.init();
        }
    };

    return {
        init           : init,
        responseHandler: responseHandler,
        onLoad         : onLoad,
    };
})();

module.exports = {
    TopUpVirtualWS: TopUpVirtualWS,
};
