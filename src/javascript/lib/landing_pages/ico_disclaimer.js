var el_residence_list;
window.onload = function() {
    var frm_select_residence     = document.getElementById('frm_select_residence');
    var frm_accept_disclaimer    = document.getElementById('frm_accept_disclaimer');
    var frm_accept_second_notice = document.getElementById('frm_accept_second_notice');
    el_residence_list            = document.getElementById('residence_list');

    // Get and then Populate residence list
    getResidenceList();

    function isRestrictedCountry(val) {
        // restricted countries code
        var regex = new RegExp(['^(',
            'as|af|at|au|be|bg|ca|ch|cy|cz|de|dk|ee|es|fi|fr|gb|gg|gr|gu|hk|hr|hu|ie|il|im|it|',
            'iq|ir|je|jp|kp|lt|lu|lv|mp|mt|my|nl|nz|pl|pt|pr|ro|se|sg|si|sk|sy|sz|us|vi|vg|vu',
            ')$'].join(''));
        if (regex.test(val)) {
            return true;
        }
        return false;
    }

    var country_names = [
        { code: 'ca', name: 'Canada' },
        { code: 'uk', name: 'the United Kingdom' },
        { code: 'eu', name: 'the European Economic Area' },
        { code: 'hk', name: 'Hong Kong' },
        { code: 'jp', name: 'Japan' },
        { code: 'sg', name: 'Singapore' },
        { code: 'ch', name: 'Switzerland' },
    ]

    function showSecondNotice(val) {
        var country_name;
        country_names.map(function(item, idx) {
            if (item.code === val) {
                country_name = item.name;
            }
        });
        document.getElementById('country_name').appendChild(document.createTextNode(country_name));
        document.getElementById('notice_msg').classList.remove('invisible');
        document.getElementById(val).classList.remove('invisible');
    }

    function showDisclaimer(val) {
        if (isRestrictedCountry(val)) {
            // eu countries code
            if (/^(al|ad|at|by|be|ba|bg|hr|cy|cz|dk|ee|fo|fi|fr|de|gi|gr|hu|is|ie|im|it|ru|lv|li|lt|lu|mk|mt|md|mc|me|nl|no|pl|pt|ro|sm|sk|si|es|se|ch|ua|va)$/.test(val)) {
                val = 'eu';
            }

            if (/^(ca|jp|sg|hk|uk|ch|eu)$/.test(val)) {
                showSecondNotice(val);
            } else {
                document.getElementById('access_denied_msg').classList.remove('invisible');
            }
        } else {
            document.getElementById('disclaimer_msg').classList.remove('invisible');
        }
    }

    function hideForm() {
        frm_select_residence.parentNode.classList.add('invisible');
    }

    frm_accept_disclaimer.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = document.getElementById('checkbox').checked; // true or false
        var url = 'https://ico_documents.binary.com/im.pdf';
        if (val) {
            window.open(url, '_self');
        } else {
            document.getElementById('frm_accept_disclaimer_error').classList.remove('invisible');
        }
    });

    frm_select_residence.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = document.getElementById('residence_list').value;
        hideForm();
        showDisclaimer(val);
    });

    frm_accept_second_notice.addEventListener('submit', function(e) {
        e.preventDefault();
        var val = document.getElementById('checkbox-2').checked; // true or false
        var url = 'https://ico_documents.binary.com/im.pdf';
        if (val) {
            document.getElementById('notice_msg').classList.add('invisible');
            showDisclaimer(val);
        } else {
            document.getElementById('frm_accept_notice_error').classList.remove('invisible');
        }
    })
};

function getResidenceList() {
    var residence_list = JSON.parse(sessionStorage.getItem('residence_list') || null);
    if (residence_list) {
        populateResidenceList(residence_list);
    } else {
        var ws = wsConnect();
        function sendResidenceList() {
            wsSend(ws, { residence_list: 1 });
        }

        if (ws.readyState === 1) {
            sendResidenceList();
        } else {
            ws.onopen = sendResidenceList;
        }

        ws.onmessage = function(msg) {
            var response = JSON.parse(msg.data);
            if (response.residence_list) {
                populateResidenceList(response.residence_list);
                setSession('residence_list', JSON.stringify(response.residence_list));
            }
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
    document.getElementById('loading').classList.add('invisible');
    document.getElementById('disclaimer_form').classList.remove('invisible');
}
