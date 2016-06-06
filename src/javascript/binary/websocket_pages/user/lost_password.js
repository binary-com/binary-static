pjax_config_page('user/lost_passwordws', function() {
    return {
        onLoad: function() {
            if(page.client.redirect_if_login()) {
                return;
            }
            BinarySocket.init({
                onmessage: LostPassword.lostPasswordWSHandler
            });
            LostPassword.init();
        }
    };
});
