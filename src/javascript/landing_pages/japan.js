/* global toggleMobileMenu:false */
window.onload = function() {
    initForm();

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
