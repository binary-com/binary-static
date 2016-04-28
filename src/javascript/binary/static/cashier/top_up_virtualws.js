var TopUpVirtualWS = (function() {
	"use strict";

    var containerID,
        viewIDs,
        hiddenClass,
        $views;

    var init = function() {
        containerID = '#topup_virtual';
        hiddenClass = 'hidden';
        $views      = $(containerID + ' .viewItem');
        viewIDs = {
            error   : '#viewError',
            success : '#viewSuccess'
        };

        $views.addClass('hidden');

        if(!page.client.is_virtual()) {
            showMessage(text.localize('Sorry, this feature is available to virtual accounts only.'), false);
        }
        else {
            BinarySocket.send({"topup_virtual": "1"});
        }
    };

    var responseHandler = function(response) {
    	var str, amt , currType;
	 	if('error' in response) {
            if('message' in response.error) {
                showMessage(text.localize(response.error.message), false);
            }
        }
        else{
            showMessage(
                text.localize('[_1] [_2] has been credited to your Virtual money account [_3]')
                    .replace('[_1]', response.topup_virtual.currency)
                    .replace('[_2]', response.topup_virtual.amount)
                    .replace('[_3]', page.client.loginid),
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


    return {
    	init: init,
    	responseHandler: responseHandler
    };
}());


pjax_config_page("top_up_virtualws", function() {
    return {
        onLoad: function() {
            if (page.client.redirect_if_logout()) {
                return;
            }

        	BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "authorize") {
                            TopUpVirtualWS.init();
                        }
                        else if (response.msg_type === "topup_virtual") {
                            TopUpVirtualWS.responseHandler(response);
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            if(TUser.get().hasOwnProperty('is_virtual')) {
                TopUpVirtualWS.init();
            }
        }
    };
});
