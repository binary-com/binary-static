var Content  = require('../../../common_functions/content').Content;
var localize = require('../../../base/localize').localize;
var Client   = require('../../../base/client').Client;

var TopUpVirtualWS = (function() {
    'use strict';

    var containerID,
        viewIDs,
        hiddenClass,
        $views;

    var init = function() {
        containerID = '#topup_virtual';
        hiddenClass = 'hidden';
        $views      = $(containerID + ' .viewItem');
        viewIDs = {
            error  : '#viewError',
            success: '#viewSuccess',
        };

        $views.addClass('hidden');

        if (!Client.get_boolean('is_virtual')) {
            showMessage(localize('Sorry, this feature is available to virtual accounts only.'), false);
        } else {
            BinarySocket.send({ topup_virtual: '1' });
        }
    };

    var responseHandler = function(response) {
        if ('error' in response) {
            if ('message' in response.error) {
                showMessage(localize(response.error.message), false);
            }
        } else {
            showMessage(
                localize('[_1] [_2] has been credited to your Virtual money account [_3]', [
                    response.topup_virtual.currency,
                    response.topup_virtual.amount,
                    Client.get_value('loginid'),
                ]),
                true);
        }
    };

    var showMessage = function(message, isSuccess) {
        var viewID = isSuccess ? viewIDs.success : viewIDs.error;
        setActiveView(viewID);
        $(viewID + ' > p').html(message);
    };

    var setActiveView = function(viewID) {
        $views.addClass(hiddenClass);
        $(viewID).removeClass(hiddenClass);
    };

    var onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
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
        if (Client.get_boolean('is_virtual')) {
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
