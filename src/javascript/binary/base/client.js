var Client = function() {
    this.loginid =  $.cookie('loginid');
    this.is_logged_in = false;
    this.is_real = false;
    if(this.loginid === null || typeof this.loginid === "undefined") {
        this.type = 'logged_out';
    } else if(/VRT/.test(this.loginid)) {
        this.type = 'virtual';
        this.is_logged_in = true;
    } else {
        this.type = 'real';
        this.is_logged_in = true;
        this.is_real = true;
    }

    var dl_info = gtm_data_layer_info();
    if(dl_info.length > 0) {
        for (var i=0;i<dl_info.length;i++) {
            if(dl_info[i].event == 'log_in') {
                SessionStore.set('client_info', this.loginid + ':' + dl_info[i].params.bom_firstname + ':'  + dl_info[i].params.bom_lastname + ':' + dl_info[i].params.bom_email + ':' + dl_info[i].params.bom_phone);
            }
        }
    }

    var client_info = SessionStore.get('client_info');
    if(client_info) {
        var parsed = client_info.split(':');
        if(this.is_logged_in && parsed[0] == this.loginid) {
            this.first_name = parsed[1];
            this.last_name = parsed[2];
            this.name = this.first_name +  ' ' + this.last_name;
            this.email = parsed[3];
            this.phone = parsed[4];
        } else {
            SessionStore.remove('client_info');
        }
    }
};
