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

            LiveAPI.send({get_limits: 1})
                .then(LimitsWS.limitsHandler)
                .catch(LimitsWS.limitsError);
        },
        onUnload: function(){
            LimitsWS.clean();
        }
    };
});
