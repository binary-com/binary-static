var error_class = 'error-field';

window.onload = function () {
    dataLayer.push({ event: 'page_load' });

    var el_email   = document.getElementById('email');
    var el_signup  = document.getElementById('signup');
    var el_success = document.getElementById('success');

    var ws = wsConnect();

    function sendVerifyEmail() {
        wsSend(ws, {
            verify_email: el_email.value,
            type        : 'account_opening'
        });
    }

    var validation_set = false; // To prevent validating before submit

    document.getElementById('frm_verify_email').addEventListener('submit', function (evt) {
        evt.preventDefault();

        if (!validateEmail(el_email.value)) {
            if (!validation_set) {
                ['input', 'change'].forEach(function (evt) {
                    el_email.addEventListener(evt, function () {
                        setValidationStyle(el_email, !validateEmail(el_email.value));
                    });
                });
                setValidationStyle(el_email, !validateEmail(el_email.value));
                validation_set = true;
            }
            return false;
        }

        if (ws.readyState === 1) {
            sendVerifyEmail();
        } else {
            ws.onopen = sendVerifyEmail;
        }
    });

    ws.onmessage = function(msg) {
        var response = JSON.parse(msg.data);
        setValidationStyle(el_email, response.error);
        if (!response.error) {
            el_signup.classList.add('invisible');
            el_success.classList.remove('invisible');
        }
    };

    // Store gclid
    var gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
};

function validateEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

function setValidationStyle(element, has_error) {
    element.classList[has_error ? 'add' : 'remove'](error_class);
}
