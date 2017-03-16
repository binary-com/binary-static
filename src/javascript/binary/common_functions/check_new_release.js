const urlForStatic   = require('../base/url').urlForStatic;
const moment         = require('moment');

const check_new_release = function() { // calling this method is handled by GTM tags
    const last_reload = localStorage.getItem('new_release_reload_time');
    // prevent reload in less than 10 minutes
    if (last_reload && +last_reload + (10 * 60 * 1000) > moment().valueOf()) return;
    localStorage.setItem('new_release_reload_time', moment().valueOf());
    const currect_hash = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src').split('?')[1];
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (+xhttp.readyState === 4 && +xhttp.status === 200) {
            const latest_hash = xhttp.responseText;
            if (latest_hash && latest_hash !== currect_hash) {
                window.location.reload(true);
            }
        }
    };
    xhttp.open('GET', urlForStatic() + 'version?' + Math.random().toString(36).slice(2), true);
    xhttp.send();
};

module.exports = {
    check_new_release: check_new_release,
};
