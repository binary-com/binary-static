pjax_config_page_require_auth("limitsws", function(){
    return {
        onLoad: function() {
            Content.populate();
            var titleElement = document.getElementById("limits-ws-container").firstElementChild;
            titleElement.textContent = text.localize('Trading and Withdrawal Limits');
            if (TUser.get().is_virtual) {
                LimitsWS.limitsError();
                return;
            }

            LiveAPI()
                .then(function(s) { return s.send({get_limits: 1}); })
                .then(function(response) {
                    console.log(response);
                    LimitsWS.limitsHandler(response);
                })
                .catch(function(error) {
                    console.log(error);
                    LimitsWS.limitsError(error);
                });
        },
        onUnload: function(){
            LimitsWS.clean();
        }
    };
});
