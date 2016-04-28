pjax_config_page('user/lost_passwordws', function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: LostPassword.lostPasswordWSHandler
            });
            LostPassword.init();
        }
    };
});
