window.onload = function () {
    toggleMobileMenu();
    initForm();

    window.onresize = checkWidth;

    // Store gclid
    const gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
};

function initForm() {
    const signup_forms = document.querySelectorAll('.signup-form');
    const ws = wsConnect();

    function sendVerifyEmail(val) {
        wsSend(ws, {
            verify_email: val,
            type        : 'account_opening'
        });
    }

    let validation_set = false; // To prevent validating before submit

    signup_forms.forEach(function(form) {
        form.addEventListener('submit', handleSubmit);
    });

    let el_email;
    function handleSubmit(e) {
        e.preventDefault();

        const el_form  = this;
        el_email = el_form.querySelector('input[type="email"]');
        if (!validateEmail(el_email.value)) {
            if (!validation_set) {
                ['input', 'change'].forEach(function (evt) {
                    el_email.addEventListener(evt, function () {
                        setValidationStyle(!validateEmail(el_email.value));
                    });
                });
                setValidationStyle(!validateEmail(el_email.value));
                validation_set = true;
            }
            return false;
        }

        if (ws.readyState === 1) {
            sendVerifyEmail(el_email.value);
        } else {
            ws.onopen = sendVerifyEmail;
        }
    }

    ws.onmessage = function(msg) {
        const response = JSON.parse(msg.data);
        setValidationStyle(el_email, response.error);
        if (!response.error) {
            signup_forms.forEach(function(el) {
                el.querySelector('.signup-form-input').classList.add('invisible');
                el.querySelector('.signup-form-success').classList.remove('invisible');
            });
        }
    };
}

function validateEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

function setValidationStyle(has_error) {
    document.querySelectorAll('input[type="email"]').forEach(function(el) {
        el.classList[has_error ? 'add' : 'remove']('error-field');
    });
    document.querySelectorAll('.error-msg').forEach(function(el) {
        el.classList[has_error ? 'remove' : 'add']('invisible');
    });
}
