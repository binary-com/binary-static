pjax_config_page_require_auth("user/authenticatews", function(){
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('trading');
            }
            Content.populate();
            function show_error(error) {
                $('#error_message').removeClass('invisible').text(error);
            }
            function check_virtual() {
                if (page.client.is_virtual()) {
                    show_error(text.localize('This feature is not relevant to virtual-money accounts.'));
                }
                return page.client.is_virtual();
            }
            var message = document.getElementById('authentication-message');
            if (!check_virtual()) {
                BinarySocket.init({
                    onmessage: function(msg){
                        var response = JSON.parse(msg.data);
                        if (response) {
                            var error = response.error;
                            if (response.msg_type === 'get_account_status' && !check_virtual() && !error){
                                if ($.inArray('authenticated', response.get_account_status.status) > -1) {
                                    $('#fully-authenticated').removeClass('invisible');
                                } else {
                                    $('#not-authenticated').removeClass('invisible');
                                }
                            } else if (error) {
                                show_error(error.message);
                            }
                        }
                    }
                });
                BinarySocket.send({'get_account_status': 1});
            }
        }
    };
});
