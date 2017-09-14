window.onload = function() {
    var frm_select_residence  = document.getElementById('frm_select_residence');
    var frm_accept_disclaimer = document.getElementById('frm_accept_disclaimer');
    var el_residence_list     = document.getElementById('residence_list');

    var ws = new WebSocket('wss://blue.binaryws.com/websockets/v3?app_id=1&l=' + (getParamValue(window.top.location.href, 'lang') || 'en'));

    function sendResidenceList() {
        ws.send(JSON.stringify({
            residence_list: 1
        }));
    }

    function populateResidenceList(residence_list) {
        residence_list.forEach(function(res) {
            var el_option = document.createElement('option');
            el_option.text = res.text;
            el_option.value = res.value;
            el_residence_list.appendChild(el_option);
        });
        document.getElementById('disclaimer_form').classList.remove('invisible');
        document.getElementsByClassName('barspinner')[0].classList.add('invisible');
    }

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

    function showDisclaimer(val) {
        if (isRestrictedCountry(val)) {
            document.getElementById('access_denied_msg').classList.remove('invisible');
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
        var url = 'https://ico_documents.binary.com/draft_im.pdf';
        if (val) {
            history.go(-1);
            window.open(url);
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

    if (ws.readyState === 1) {
        sendResidenceList();
    } else {
        ws.onopen = function() {
            sendResidenceList();
        }
    }

    ws.onmessage = function(response) {
        var data = JSON.parse(response.data);
        populateResidenceList(data.residence_list);
    }
};

function getParamValue(url, key) {
    var regex   = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}