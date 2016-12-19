var Cookies = require('../../lib/js-cookie');

var validate_loginid = function() {
    var loginid_list = Cookies.get('loginid_list');
    var loginid      = Cookies.get('loginid');
    if (!loginid || !loginid_list) return;

    var valid_loginids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP)[0-9]+$', 'i');

    if (!valid_loginids.test(loginid)) {
        page.client.send_logout_request();
    }

    var accIds = loginid_list.split('+');
    accIds.forEach(function(acc_id) {
        if (!valid_loginids.test(acc_id.split(':')[0])) {
            page.client.send_logout_request();
        }
    });
};

module.exports = {
    validate_loginid: validate_loginid,
};
