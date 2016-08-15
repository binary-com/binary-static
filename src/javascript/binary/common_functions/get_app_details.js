var getAppDetails = function(app_id, ref) {
    var tooltip_string;
    if (sessionStorage.getItem('app_id ' + app_id)) {
        if (sessionStorage.getItem('app_id ' + app_id) === 'waiting for response') return tooltip_string;
        tooltip_string = add_app_id_name(app_id, sessionStorage.getItem('app_id ' + app_id), ref);
    } else {
        sessionStorage.setItem('app_id ' + app_id, 'waiting for repsonse');
        BinarySocket.send({'get_app_details': app_id});
    }
    return tooltip_string;
};

var updateAppDetails = function(data) {
    if (data && data.get_app_details && data.get_app_details.app_name) {
        var app_id   = data.echo_req.get_app_details,
            app_name = data.get_app_details.app_name;

        sessionStorage.setItem('app_id ' + app_id, app_name);
        var $selector = $('.' + app_id);
        $selector.replaceWith(add_app_id_name(app_id, app_name, $selector.text()));
    }
    return;
};
