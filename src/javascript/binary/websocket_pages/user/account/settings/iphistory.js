pjax_config_page_require_auth("user/settings/iphistoryws", function(){
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('user/settingsws');
            }
            BinarySocket.init({
                onmessage: IPHistory.responseHandler
            });
            Content.populate();
            IPHistory.init();
        },
        onUnload: function(){
            IPHistory.clean();
        }
    };
});
