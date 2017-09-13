window.onload = function () {
    var el_email   = document.getElementById('email');
    var el_signup  = document.getElementById('signup');
    var el_success = document.getElementById('success');

    var ws = new WebSocket('wss://blue.binaryws.com/websockets/v3?app_id=1&l=' + (getParamValue(window.top.location.href, 'lang') || 'en'));

    function sendVerifyEmail() {
        ws.send(JSON.stringify({
            verify_email: el_email.value,
            type        : 'account_opening'
        }));
    }

    document.getElementById('frm_verify_email').addEventListener('submit', function (evt) {
        evt.preventDefault();

        if (ws.readyState === 1) {
            sendVerifyEmail();
        } else {
            ws.onopen = function() {
                sendVerifyEmail()
            };
        }
    });

    ws.onmessage = function(msg) {
        var data = JSON.parse(msg.data);
        if (data.error) {
            el_email.classList.add('error-field');
        } else {
            el_email.classList.remove('error-field');
            el_signup.classList.add('invisible');
            el_success.classList.remove('invisible');
        }
    };

    // Store gclid
    var gclid = getParamValue(window.top.location.href, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
};

function getParamValue(url, key) {
    var regex   = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
