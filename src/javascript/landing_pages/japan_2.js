window.onload = function () {
    toggleMobileMenu();
    initForm();
    tabWithButtons();

    window.onresize = checkWidth;

    document.querySelectorAll('.page-scroll').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(this);
        });
    });

    // Store gclid
    const gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
};

function scrollToSection(target_el) {
    const target_href = target_el.getAttribute('href').substr(1);
    const to = document.getElementById(target_href).offsetTop - 50;
    scrollTo(to, 500);
    collapseMenu();
}

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

            const to = this.offsetTop - 50;
            scrollTo(to, 500); // Scroll to nearest form
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

function tabWithButtons(id) {
    const el_tab_container     = document.getElementById(id) ? document.getElementById(id) : document.body;
    const el_content_container = el_tab_container.getElementsByClassName('twb-content-container')[0];
    const el_contents          = el_tab_container.querySelectorAll('div.twb-content');
    const num_of_items = el_contents.length;
    let current_index  = 0;
    let navs;

    (function init() {
        const parent = el_tab_container.querySelector('.twb-buttons');

        const ul = document.createElement('ul');
        for (let idx = 0; idx < num_of_items; idx++) {
            const li = document.createElement('li');
            li.classList[idx ? 'remove' : 'add']('active');
            li.addEventListener('click', function(e) {
                e.preventDefault();
                updateTabContent(idx, false);
                current_index = idx;
            });
            ul.appendChild(li);
        }

        const btn_prev = document.createElement('a');
        btn_prev.classList.add('twb-button', 'twb-button-prev');
        btn_prev.setAttribute('href', 'javascript:;');
        btn_prev.addEventListener('click', function(e) {
            e.preventDefault();
            updateTabContent(--current_index);
        });

        const btn_next = document.createElement('a');
        btn_next.classList.add('twb-button', 'twb-button-next');
        btn_next.setAttribute('href', 'javascript:;');
        btn_next.addEventListener('click', function(e) {
            e.preventDefault();
            updateTabContent(++current_index);
        });

        parent.appendChild(btn_prev);
        parent.appendChild(ul);
        parent.appendChild(btn_next);

        navs = ul.querySelectorAll('li');

        window.onresize = function() {
            updateTabContent(current_index);
        }
    })();

    function updateTabContent(target_index, direction = true) {
        const width = el_content_container.getBoundingClientRect().width;
        const mod   = target_index % num_of_items;
        const active_index = direction ? (mod < 0 ? (mod + num_of_items) : mod) : target_index;

        updateActiveContent(active_index);
        updateActiveNav(active_index);

        function updateActiveContent(idx) {
            const offset = idx * width;
            el_content_container.style.left = `${((offset > 0 ? -offset : offset) % (num_of_items * width))}px`;
        }
        function updateActiveNav(idx) {
            navs.forEach(function(el, i) {
                el.classList[idx === i ? 'add' : 'remove']('active');
            });
        }
    }
}