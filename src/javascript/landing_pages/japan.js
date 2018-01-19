/* global setSession:true */
/* global urlForLanguage:true */
/* global getLanguage:true */
/* global jpClient:true */
/* global recordAffiliateExposure:true */
window.onload = function() {
    getClientCountry();
    if (!jpClient()) {
        window.location = urlForLanguage('ja');
    }

    initForm('email_top');
    initForm('email_middle');
    initForm('email_bottom');
    recordAffiliateExposure();
    commonOnload();

    // Store gclid
    const gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
};

function initForm(id) {
    const signup_form = document.getElementById(id);

    if (!signup_form) {
        return;
    }
    let ws = wsConnect();
    let email_sent = false;

    function sendVerifyEmail(val) {
        if (!checkCountry(val)) {
            return;
        }
        const trimmed_email = trimEmail(val);
        wsSend(ws, {
            verify_email: trimmed_email,
            type        : 'account_opening',
        });
    }

    function verifySubmit(msg) {
        const response = JSON.parse(msg.data);
        setValidationStyle(signup_form, el_email, response.error);
        if (!response.error) {
            document.querySelectorAll('.signup-form').forEach((el) => {
                el.querySelector('.signup-form-input').classList.add('invisible');
                el.querySelector('.signup-form-success').classList.remove('invisible');
                email_sent = true;
            });
        }
    }

    function trimEmail(str) {
        return str.replace(/\s/g, '');
    }

    function checkCountry(val) {
        const clients_country = sessionStorage.getItem('clients_country');
        if ((clients_country !== 'my') || /@binary\.com$/.test(val)) {
            return true;
        }
        document.querySelectorAll('.signup-form').forEach((el) => {
            el.querySelector('.signup-form-input').classList.add('invisible');
            el.querySelector('.signup-form-error').classList.remove('invisible');
        });
        return false;
    }

    function connect() {
        if (email_sent) return;
        ws = wsConnect();
        ws.onmessage = verifySubmit;
        ws.onclose = connect;
    }

    let validation_set = false; // To prevent validating before submit

    signup_form.addEventListener('submit', handleSubmit);

    let el_email;
    function handleSubmit(e) {
        e.preventDefault();

        const el_form  = this;
        el_email = el_form.querySelector('input[type="email"]');
        if (!validateEmail(trimEmail(el_email.value))) {
            if (!validation_set) {
                ['input', 'change'].forEach((evt) => {
                    el_email.addEventListener(evt, () => {
                        setValidationStyle(signup_form, el_email, !validateEmail(trimEmail(el_email.value)));
                    });
                });
                setValidationStyle(signup_form, el_email, !validateEmail(trimEmail(el_email.value)));
                validation_set = true;
            }

            const to = this.offsetTop - 100;
            scrollTo(to, 500); // Scroll to nearest form
            return;
        }

        if (ws.readyState === 1) {
            sendVerifyEmail(el_email.value);
        } else {
            ws.onopen = sendVerifyEmail(el_email.value);
        }
    }

    ws.onmessage = verifySubmit;
    ws.onclose = connect;
}

function validateEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

function setValidationStyle(form, element, has_error) {
    const error_class = 'error-field';
    const invisible_class = 'invisible';

    form.querySelectorAll('input[type="email"]').forEach((el) => {
        el.classList[has_error ? 'add' : 'remove'](error_class);
    });

    if (element.value.length < 1) {
        form.querySelectorAll('.error_no_email').forEach((el) => {
            el.classList[has_error ? 'remove' : 'add'](invisible_class);
        });
        form.querySelectorAll('.error_validate_email').forEach((el) => {
            el.classList[has_error ? 'add' : 'remove'](invisible_class);
        });
    }
    else if (element.value.length >= 1) {
        form.querySelectorAll('.error_validate_email').forEach((el) => {
            el.classList[has_error ? 'remove' : 'add'](invisible_class);
        });
        form.querySelectorAll('.error_no_email').forEach((el) => {
            el.classList[has_error ? 'add' : 'remove'](invisible_class);
        });
    }
    if (!has_error) {
        form.querySelectorAll('.error_validate_email').forEach((el) => {
            el.classList.add(invisible_class);
        });
        form.querySelectorAll('.error_no_email').forEach((el) => {
            el.classList.add(invisible_class);
        });
    }
}

function getClientCountry() {
    let clients_country = sessionStorage.getItem('clients_country');

    // Try to get residence from client's info if logged-in
    if (!clients_country) {
        const accounts = JSON.parse(localStorage.getItem('client.accounts') || null);
        if (accounts) {
            Object.keys(accounts).some((loginid) => {
                if (accounts[loginid].residence) {
                    clients_country = accounts[loginid].residence;
                    setSession('clients_country', clients_country);
                    return true;
                }
                return false;
            });
        }
    }

    // Get required info from WebSocket
    const ws = wsConnect();

    function sendRequests() {
        if (!clients_country) wsSend(ws, { website_status: 1 });
        wsSend(ws, { time: 1 });
    }

    if (ws.readyState === 1) {
        sendRequests();
    } else {
        ws.onopen = sendRequests;
    }

    ws.onmessage = function (msg) {
        const response = JSON.parse(msg.data);
        if (response.website_status) {
            clients_country = response.website_status.clients_country;
            setSession('clients_country', clients_country);
        }
    };

    return clients_country;
}