var el_residence_list;
window.onload = function() {
    var frm_select_residence     = document.getElementById('frm_select_residence');
    var frm_accept_disclaimer    = document.getElementById('frm_accept_disclaimer');
    var frm_accept_second_notice = document.getElementById('frm_accept_second_notice');
    el_residence_list            = document.getElementById('residence_list');

    getWebsocketData([
        { msg_type: 'residence_list', req: { residence_list: 1 } },
        { msg_type: 'ico_status', req: { ico_status: 1 } },
    ], function() {
        var residence_list = JSON.parse(sessionStorage.getItem('residence_list') || null);
        populateResidenceList(residence_list);
    });

    function isRestrictedCountry(val) {
        var ico_status = JSON.parse(sessionStorage.getItem('ico_status') || null);
        const restricted_countries = ico_status.ico_countries_config.restricted;

        return restricted_countries.indexOf(val) !== -1;
    }

    var country_names = [
        { code: 'gb', name: 'the United Kingdom' },
        { code: 'eu', name: 'the European Economic Area' },
        { code: 'hk', name: 'Hong Kong' },
        { code: 'jp', name: 'Japan' },
    ]

    function showSecondNotice(val) {
        var country_name;
        country_names.map(function(item, idx) {
            if (item.code === val) {
                country_name = item.name;
            }
        });
        var el_country_name = document.getElementById('country_name');
        if (el_country_name) el_country_name.appendChild(document.createTextNode(country_name));
        var notice_msg = document.getElementById('notice_msg');
        if (notice_msg) notice_msg.classList.remove('invisible');
        var el = document.getElementById(val);
        if (el) el.classList.remove('invisible');
    }

    function showDisclaimer(val) {
        if (isRestrictedCountry(val)) {
            // eu countries code
            if (/^(al|ad|at|by|be|ba|bg|hr|cy|cz|dk|ee|fo|fi|fr|de|gi|gr|hu|is|ie|im|it|ru|lv|li|lt|lu|mk|mt|md|mc|me|nl|no|pl|pt|ro|sm|sk|si|es|se|ch|ua|va)$/.test(val)) {
                val = 'eu';
            }

            if (/^(ca|jp|sg|hk|gb|ch|eu)$/.test(val)) {
                showSecondNotice(val);
            } else {
                var access_denied_msg = document.getElementById('access_denied_msg');
                if (access_denied_msg) access_denied_msg.classList.remove('invisible');
            }
        } else {
            var disclaimer_msg = document.getElementById('disclaimer_msg');
            if (disclaimer_msg) disclaimer_msg.classList.remove('invisible');
        }
    }

    function hideForm() {
        frm_select_residence.parentNode.classList.add('invisible');
    }

    frm_accept_disclaimer.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = (document.getElementById('checkbox') || '').checked; // true or false
        var url = 'https://ico_documents.binary.com/im.pdf';
        if (val) {
            window.location.href = url;
        } else {
            var form = document.getElementById('frm_accept_disclaimer_error');
            if (form) form.classList.remove('invisible');
        }
    });

    var validation_set = false; // To prevent validating before submit

    frm_select_residence.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = (document.getElementById('residence_list') || '').value;
        if (!validateResidence(this)) {
            if (!validation_set) {
                this.addEventListener('change', function (evt) {
                    evt.preventDefault();
                    validateResidence(this);
                    validation_set = true;
                })
            }
            return false;
        }
        hideForm();
        showDisclaimer(val);
    });

    frm_accept_second_notice.addEventListener('submit', function(e) {
        e.preventDefault();
        var val = (document.getElementById('checkbox-2') || '').checked; // true or false
        if (val) {
            var notice_msg = document.getElementById('notice_msg');
            if (notice_msg) notice_msg.classList.add('invisible');
            showDisclaimer(val);
        } else {
            var form = document.getElementById('frm_accept_notice_error');
            if (form) form.classList.remove('invisible');
        }
    });

    commonOnload();
};

function validateResidence(el) {
    var val      = (document.getElementById('residence_list') || '').value;
    var el_error = el.getElementsByClassName('error-msg')[0];
    if (val === '0') {
        el_error.classList.remove('invisible');
        return false;
    }
    el_error.classList.add('invisible');
    return true;
}

function getWebsocketData(requests, done) {
    requests = requests.filter(r => !sessionStorage.getItem(r.msg_type));

    if(!requests.length) {
        setTimeout(done, 0);
        return;
    }

    function sendRequests() {
        requests.forEach(function(r) {
            wsSend(ws, r.req);
        })
    }

    var ws = wsConnect();
    if (ws.readyState === 1) {
        sendRequests();
    } else {
        ws.onopen = sendRequests;
    }

    ws.onmessage = function (msg) {
        var response = JSON.parse(msg.data);

        var msg_type = response.msg_type;
        setSession(msg_type, JSON.stringify(response[msg_type]));
        requests = requests.filter(function(r) { return r.msg_type !== msg_type; });

        if (!requests.length) {
            setTimeout(done, 0);
            ws.close();
            return;
        }
    }
}

function populateResidenceList(residence_list) {
    residence_list.forEach(function(res) {
        var el_option = document.createElement('option');
        el_option.text  = res.text;
        el_option.value = res.value;
        el_residence_list.appendChild(el_option);
    });
    var loading = document.getElementById('loading');
    if (loading) loading.classList.add('invisible');
    var disclaimer_form = document.getElementById('disclaimer_form');
    if (disclaimer_form) disclaimer_form.classList.remove('invisible');
}
