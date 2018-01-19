/* global setSession:true */
/* global urlForLanguage:true */
/* global getLanguage:true */
/* global jpClient:true */
/* global recordAffiliateExposure:true */
/* global Hammer */

window.onload = function () {
    if (!jpClient()) {
        window.location = urlForLanguage('ja');
    }

    toggleMobileMenu();
    initForm('email_top');
    initForm('email_bottom');
    recordAffiliateExposure();
    collapseNavbar();
    tabWithButtons();
    getClientCountry();

    window.onresize = checkWidth;

    document.querySelectorAll('.page-scroll').forEach((el) => {
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

    commonOnload();

    // Collapse navbar on scroll
    function collapseNavbar() {
        const navbarFixedTopEl = document.getElementsByClassName('navbar-fixed-top');
        navbarFixedTopEl[0].classList[window.scrollY < 50 ? 'add' : 'remove']('top-nav-collapse');
    }

    window.onscroll = collapseNavbar;
};

function scrollToSection(target_el) {
    const width = window.innerWidth
                  || document.documentElement.clientWidth
                  || document.body.clientWidth;
    const target_href = target_el.getAttribute('href').substr(1);
    const offset_top = document.getElementById(target_href).offsetTop;

    let to = offset_top - 50;

    if (/^key-plus|^academy/i.test(target_href)) {
        to = offset_top - 110;
    }

    if (width > 1199) { // for slanted pseudo element padding
        to = offset_top - 100;
        if (/^key-plus|^academy/i.test(target_href)) {
            to = offset_top - 100;
        }
    }

    scrollTo(to, 500);
    collapseMenu();
}

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

function tabWithButtons(id) {
    const el_tab_container     = document.getElementById(id) ? document.getElementById(id) : document.body;
    const el_content_container = el_tab_container.getElementsByClassName('twb-content-container')[0];
    const el_content_wrapper   = el_tab_container.getElementsByClassName('twb-content-wrapper')[0];
    const el_contents          = el_tab_container.querySelectorAll('div.twb-content');
    const num_of_items = el_contents.length;
    let current_index  = 0;
    let navs;

    (() => {
        const parent = el_tab_container.querySelector('.twb-buttons');
        const ul = document.createElement('ul');
        for (let idx = 0; idx < num_of_items; idx++) {
            const li = createLIElement(idx);
            ul.appendChild(li);
        }

        const btn_prev = document.createElement('a');
        btn_prev.classList.add('twb-button', 'twb-button-prev');
        btn_prev.setAttribute('href', 'javascript:;');
        btn_prev.addEventListener('click', (e) => {
            e.preventDefault();
            updateTabContent(--current_index);
        });

        const btn_next = document.createElement('a');
        btn_next.classList.add('twb-button', 'twb-button-next');
        btn_next.setAttribute('href', 'javascript:;');
        btn_next.addEventListener('click', (e) => {
            e.preventDefault();
            updateTabContent(++current_index);
        });

        parent.appendChild(btn_prev);
        parent.appendChild(ul);
        parent.appendChild(btn_next);

        navs = ul.querySelectorAll('li');

        window.addEventListener('resize', () => {
            updateTabContent(current_index);
        });

        const touch_swipe = new Hammer(el_content_wrapper);

        touch_swipe.on('swipeleft swiperight tap press', (ev) => {
            if (ev.type === 'swipeleft') {
                updateTabContent(++current_index);
            }
            if (ev.type === 'swiperight') {
                updateTabContent(--current_index);
            }
        });

        function createLIElement(index) {
            const li = document.createElement('li');
            li.classList[index ? 'remove' : 'add']('active');
            li.addEventListener('click', (e) => {
                e.preventDefault();
                updateTabContent(index, false);
                current_index = index;
            });
            return li;
        }
    })();

    function updateTabContent(target_index, direction = true) {
        const width = el_content_container.getBoundingClientRect().width;
        const mod   = target_index % num_of_items;
        let active_index;

        if (direction) {
            active_index = mod;
            if (mod < 0) {
                active_index = mod + num_of_items;
            }
        } else {
            active_index = target_index;
        }

        updateActiveContent(active_index);
        updateActiveNav(active_index);

        function updateActiveContent(idx) {
            const offset = idx * width;
            el_content_container.style.left = `${((offset > 0 ? -offset : offset) % (num_of_items * width))}px`;
        }
        function updateActiveNav(idx) {
            navs.forEach((el, i) => {
                el.classList[idx === i ? 'add' : 'remove']('active');
            });
        }
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
