window.onload = function() {
    var el_email   = document.getElementById('email');

    if (window.location.hash === '#done') {
        document.getElementById('success').classList.remove('invisible');
        for (let i = 0; i < 2; i++) {
            document.getElementsByTagName('form')[i].classList.add('invisible');
        }
        if (window.history.pushState) {
            window.history.pushState('', '/', window.location.pathname)
        } else {
            window.location.hash = '';
        }
    }

    var validation_set = false; // To prevent validating before submit

    var form = document.getElementById('frm_pr_signup');
    form.addEventListener('submit', function(evt) {
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
        } else {
            form.submit();
        }
    });
};
