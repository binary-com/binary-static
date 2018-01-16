/* global toggleMobileMenu:false */
/* global setSession:true */
window.onload = function() {
    initForm();
    getClientCountry();

    window.onresize = checkWidth;

    // Store gclid
    const gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }

    commonOnload();
};

function initForm() {
    const signup_forms = document.querySelectorAll('.signup-form');
    let ws = wsConnect();

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
        setValidationStyle(el_email, response.error);
        if (!response.error) {
            signup_forms.forEach((el) => {
                el.querySelector('.signup-form-input').classList.add('invisible');
                el.querySelector('.signup-form-success').classList.remove('invisible');
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
        signup_forms.forEach((el) => {
            el.querySelector('.signup-form-input').classList.add('invisible');
            el.querySelector('.signup-form-error').classList.remove('invisible');
        });
        return false;
    }

    let validation_set = false; // To prevent validating before submit

    signup_forms.forEach((form) => {
        form.addEventListener('submit', handleSubmit);
    });

    let el_email;
    function handleSubmit(e) {
        e.preventDefault();

        const el_form  = this;
        el_email = el_form.querySelector('input[type="email"]');
        if (!validateEmail(el_email.value)) {
            if (!validation_set) {
                ['input', 'change'].forEach((evt) => {
                    el_email.addEventListener(evt, () => {
                        setValidationStyle(!validateEmail(el_email.value));
                    });
                });
                setValidationStyle(!validateEmail(el_email.value));
                validation_set = true;
            }

            const to = this.offsetTop - 50;
            scrollTo(to, 500); // Scroll to nearest form
            return false;
        }

        if (ws.readyState === 1) {
            sendVerifyEmail(el_email.value);
        } else {
            ws = wsConnect();
            ws.onopen = sendVerifyEmail(el_email.value);
            ws.onmessage = verifySubmit;
        }
        return true;
    }

    ws.onmessage = verifySubmit;
}

function validateEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

function setValidationStyle(has_error) {
    document.querySelectorAll('input[type="email"]').forEach((el) => {
        el.classList[has_error ? 'add' : 'remove']('error-field');
    });
    document.querySelectorAll('.error-msg').forEach((el) => {
        el.classList[has_error ? 'remove' : 'add']('invisible');
    });
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
