var url_for_static = require('../base/url').url_for_static;
var moment         = require('moment');

var check_new_release = function() { // calling this method is handled by GTM tags
    var last_reload = localStorage.getItem('new_release_reload_time');
    // prevent reload in less than 10 minutes
    if (last_reload && +last_reload + (10 * 60 * 1000) > moment().valueOf()) return;
    var currect_hash = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src').split('?')[1];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (+xhttp.readyState === 4 && +xhttp.status === 200) {
            var latest_hash = xhttp.responseText;
            if (latest_hash && latest_hash !== currect_hash) {
                localStorage.setItem('new_release_reload_time', moment().valueOf());
                window.location.reload(!!true);
            }
        }
    };
    xhttp.open('GET', url_for_static() + 'version?' + Math.random().toString(36).slice(2), true);
    xhttp.send();
};

module.exports = {
    check_new_release: check_new_release,
};
