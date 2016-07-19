pjax_config_page_require_auth("user/settings/self_exclusionws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "authorize") {
                            SelfExclusionWS.init();
                        }
                        else if (response.msg_type === "get_self_exclusion") {
                            SelfExclusionWS.getResponse(response);
                        }
                        else if (response.msg_type === "set_self_exclusion") {
                            SelfExclusionWS.setResponse(response);
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            if(TUser.get().hasOwnProperty('is_virtual')) {
                SelfExclusionWS.init();
            }
        }
    };
});
