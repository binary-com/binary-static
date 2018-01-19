window.onload = function() {
    const clients_country = getClientCountry();

    toggleMobileMenu();
    hashRouter();
    collapseNavbar();
    signUpInit();
    checkUserSession();
    handleViewMemorandum();
    handleEmailBlurFocus();

    gtmPushDataLayer({ language: getLanguage().toUpperCase() });
    gtmPushDataLayer({ event: 'page_load' });

    function switchView(path) {
        var faq = document.getElementById('faq');
        if (faq) faq.classList[path === 'faq' ? 'remove' : 'add']('invisible');
        var home = document.getElementById('home');
        if (home) home.classList[path === 'faq' ? 'add' : 'remove']('invisible');
    }

    function hashRouter() {
        const hash = window.location.hash.substr(1);

        if (/done/.test(hash)) {
            gtmPushDataLayer({ bom_country_abbrev: clients_country || '' });
            gtmPushDataLayer({ event: 'ico_success' });
            clearHash();
            var subscribe_success = document.getElementById('subscribe_success');
            if (subscribe_success) subscribe_success.classList.remove('invisible');
            var binary_ico_subscribe = document.getElementById('binary_ico_subscribe');
            if (binary_ico_subscribe) binary_ico_subscribe.classList.add('invisible');
            // wait countdown is finished loading before scroll to section
            var checkIfFinished = setInterval(function(){
                var status_loading = document.getElementById('status_loading');
                var finished_loading = status_loading ? status_loading.classList.contains('invisible') : true;
                if (finished_loading === true) {
                    let navbarHeight = checkWidth();
                    var ico_subscribe_section = document.getElementById('ico_subscribe_section');
                    if (ico_subscribe_section) {
                        const to = ico_subscribe_section.offsetTop - navbarHeight;
                        scrollTo(to);
                    }
                    clearInterval(checkIfFinished);
                }
            }, 500);
        }

        if (/faq/.test(hash)) {
            switchView('faq');
            scrollTo(0);
            window.location.hash = '#faq';
            collapseMenu();
        }

        if (!hash) {
            switchView('home');
            scrollTo(0);
            clearHash();
        }
    }

    // Set language fields
    const language = getLanguage();
    const el_langs = document.getElementsByClassName('frm-language');
    for (let i = 0; i < el_langs.length; i++) {
        el_langs[i].value = language;
    }

    const el_language_dropdown = document.getElementsByClassName('language-dropdown')[0];
    setLanguage(el_language_dropdown, getLanguage());
    document.addEventListener('click', function(e) {
        // Scroll to section
        if (e.target.classList.contains('page-scroll')) {
            e.preventDefault();
            switchView('home');
            clearHash();
            const target = e.target.getAttribute('href').substr(1);
            const offset = /who-we-are|page-top/.test(target) ? 55 : 0;
            const navbarHeight = checkWidth();
            const el_target = document.getElementById(target);
            const to = el_target ? el_target.offsetTop - navbarHeight - offset : '';
            scrollTo(to);
            collapseMenu();
        }

        // Show / hide language dropdown
        if (e.target.parentNode.id === 'lang') {
            e.preventDefault();
            const parent    = el_language_dropdown.parentNode;
            const is_mobile = window.matchMedia("(max-width: 1199px)").matches;
            if (is_mobile) {
                toggleAllSiblings(parent, filterById, 'invisible');
            }
            el_language_dropdown.classList.toggle('show');
        }
    });

    el_language_dropdown.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.nodeName !== 'LI') return;
        const lang = e.target.getAttribute('class');
        if (lang === getLanguage()) return;
        el_language_dropdown.classList.add('invisible'); // hide on change
        document.location = urlForLanguage(lang);
    });

    document.getElementsByClassName('howto-btn')[0].addEventListener('click', function(e) {
        e.preventDefault();
        openLink(getHowToIcoDocumentUrl(language.toLowerCase()));
    });

    document.getElementById('token-btn').addEventListener('click', function(e) {
        e.preventDefault();
        openLink(getTokenRatingReportUrl(language.toLowerCase()));
    });

    document.getElementById('lykke-btn').addEventListener('click', function(e) {
        e.preventDefault();
        openLink(getLykkeReport(language.toLowerCase()));
    });

    document.getElementById('nishant-btn').addEventListener('click', function(e) {
        e.preventDefault();
        openLink(getNishantReport(language.toLowerCase()));
    });

    window.onresize = checkWidth;
    window.onscroll = collapseNavbar;
    window.addEventListener('hashchange', hashRouter);

    // News slider configuration
    const slider = tns({
        container: '.my-slider',
        slideBy: 'page',
        rewind: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        speed: 600,
        items: 2,   // start with mobile config
        gutter: 5,
        responsive: {
            900: {  // desktop config
                items: 4,
                gutter: 20,
            },
            640: {  // tablet config
                items: 3,
                gutter: 15,
            },
        },
        onInit: function() {
            window.dispatchEvent(new Event('resize')); // trigger resize event
            document.getElementsByClassName('slider-container')[0].classList.remove('invisible');
        }
    });

    commonOnload();
};

function clearHash() {
    if (window.history.pushState) {
        window.history.pushState('', '/', window.location.pathname);
    } else {
        window.location.hash = '';
    }
}

function signUpInit() {
    var el_email   = document.getElementById('email');
    var el_signup  = document.getElementById('signup');
    var el_success = document.getElementById('success');

    var ws = wsConnect();

    function sendVerifyEmail() {
        var trimmed_email = trimEmail(el_email.value);
        wsSend(ws, {
            verify_email: trimmed_email,
            type        : 'account_opening'
        });
    }

    function verifySubmit(msg) {
        var response = JSON.parse(msg.data);
        setValidationStyle(el_email, response.error);
        if (!response.error) {
            el_signup.classList.add('invisible');
            el_success.classList.remove('invisible');
        }
    }

    function trimEmail(str) {
        return str.replace(/\s/g, "");
    }

    var validation_set = false; // To prevent validating before submit

    var frm_verify_email = document.getElementById('frm_verify_email');
    if (frm_verify_email) {
        frm_verify_email.addEventListener('submit', function (evt) {
            evt.preventDefault();

            if (!validateEmail(trimEmail(el_email.value))) {
                if (!validation_set) {
                    ['input', 'change'].forEach(function (evt) {
                        el_email.addEventListener(evt, function () {
                            setValidationStyle(el_email, !validateEmail(trimEmail(el_email.value)));
                        });
                    });
                    setValidationStyle(el_email, !validateEmail(trimEmail(el_email.value)));
                    validation_set = true;
                }
                return false;
            }

            if (ws.readyState === 1) {
                sendVerifyEmail();
            } else {
                ws = wsConnect();
                ws.onopen = sendVerifyEmail;
                ws.onmessage = verifySubmit;
            }
        });
    }

    ws.onmessage = verifySubmit;

    // Store gclid
    var gclid = getParamValue(document.referrer, 'gclid');
    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
}

function validateEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(email);
}

function setValidationStyle(element, has_error) {
    var error_class = 'error-field';
    var invisible_class = 'invisible';
    element.classList[has_error ? 'add' : 'remove'](error_class);
    if (element.value.length < 1) {
        var error_no_email = document.getElementById('error_no_email');
        if (error_no_email) error_no_email.classList[has_error ? 'remove' : 'add'](invisible_class);
        var error_validate_email = document.getElementById('error_validate_email');
        if (error_validate_email) error_validate_email.classList[has_error ? 'add' : 'remove'](invisible_class);
    }
    else if (element.value.length >= 1) {
        var error_validate_email = document.getElementById('error_validate_email');
        if (error_validate_email) error_validate_email.classList[has_error ? 'remove' : 'add'](invisible_class);
        var error_no_email = document.getElementById('error_no_email');
        if (error_no_email) error_no_email.classList[has_error ? 'add' : 'remove'](invisible_class);
    }
    if (!has_error) {
        var error_validate_email = document.getElementById('error_validate_email');
        if (error_validate_email) error_validate_email.classList.add(invisible_class);
        var error_no_email = document.getElementById('error_no_email');
        if (error_no_email) error_no_email.classList.add(invisible_class);
    }
}

function getClientCountry() {
    let clients_country = sessionStorage.getItem('clients_country');
    let residence_list  = sessionStorage.getItem('residence_list');

    // Try to get residence from client's info if logged-in
    if (!clients_country) {
        const accounts = JSON.parse(localStorage.getItem('client.accounts') || null);
        if (accounts) {
            Object.keys(accounts).some(function (loginid) {
                if (accounts[loginid].residence) {
                    clients_country = accounts[loginid].residence;
                    setSession('clients_country', clients_country);
                    return true;
                }
            });
        }
    }

    // Get required info from WebSocket
    const ws = wsConnect();

    function sendRequests() {
        if (!clients_country) wsSend(ws, { website_status: 1 });
        if (!residence_list)  wsSend(ws, { residence_list: 1 });
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
        } else if (response.residence_list) {
            setSession('residence_list', JSON.stringify(response.residence_list));
        } else if (response.time) {
            initCountdown(response.time);
        }
    };

    return clients_country;
}

// Collapse navbar on scroll
function collapseNavbar() {
    const navbarFixedTopEl = document.getElementsByClassName('navbar-fixed-top');
    navbarFixedTopEl[0].classList[window.scrollY < 50 ? 'add' : 'remove']('top-nav-collapse');
}

function initCountdown(start_epoch) {
    const ico_start    = Date.parse(new Date('2017-11-15T00:00:00Z'));
    const ico_end      = Date.parse(new Date('2017-12-25T00:00:00Z'));
    const date_diff    = Date.parse(new Date()) - start_epoch * 1000;

    const el_container = document.getElementById('status_container');
    const hidden_class = 'invisible';
    const elements     = {};
    let remaining      = 0;
    let countdownd_interval,
        is_before_start,
        is_started,
        end_date;

    function updateStatus() {
        is_before_start = calcRemainingTime(ico_start, date_diff).total > 0;
        is_started      = calcRemainingTime(ico_end,   date_diff).total > 0 && !is_before_start;
        end_date        = is_before_start ? ico_start : ico_end;

        const display_class = 'status-' + (is_started ? 'started' : 'ended');
        el_container.querySelectorAll('.status-toggle').forEach(function(el) {
            el.classList[el.classList.contains(display_class) ? 'remove' : 'add'](hidden_class);
        });

        var loading = document.getElementById('status_loading');
        if (loading) loading.classList.add(hidden_class);
        el_container.classList.remove(hidden_class);

        if (!is_before_start) {
            if (!is_started) { // is_ended
                clearInterval(countdownd_interval);
            }
        }

        if (is_started) {
            const ico_bottom_banner = document.getElementById('ico-bottom-banner');
            if(ico_bottom_banner){
                handleICOClose(ico_bottom_banner);
                ico_bottom_banner.classList.remove(hidden_class);
            }
        }
    }

    updateStatus();

    if (!is_before_start && !is_started) return; // no countdown when already ended

    // Get all elements only once
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (id) {
        const item = el_container.querySelector('#cd_' + id);
        elements[id] = {
            value    : item.querySelector('.cd-value'),
            arcs     : item.querySelectorAll('.arc_q'),
            arc_cover: item.querySelector('.arc_cover'),
        };
    });

    function updateCountdown() {
        remaining = calcRemainingTime(end_date, date_diff);

        arc(elements.days,    remaining.days,    is_before_start ? 20 : 40);
        arc(elements.hours,   remaining.hours,   24);
        arc(elements.minutes, remaining.minutes, 60);
        arc(elements.seconds, remaining.seconds, 60);

        if (remaining.total <= 0) {
            updateStatus();
        }
    }

    updateCountdown();

    if (remaining.total > 0) {
        countdownd_interval = setInterval(updateCountdown, 1000);
    }
}

function calcRemainingTime(end_date, date_diff) {
    const total   = Math.floor(end_date - Date.parse(new Date()) + date_diff) / 1000;
    const seconds = Math.floor(total % 60);
    const minutes = Math.floor((total / 60) % 60);
    const hours   = Math.floor((total / (60 * 60)) % 24);
    const days    = Math.floor(total / (60 * 60 * 24));

    return {
        total  : total,
        days   : days,
        hours  : hours,
        minutes: minutes,
        seconds: seconds,
    };
}

function arc(el, value, scale) {
    el.value.innerHTML = ('0' + value).slice(-2);

    const angle = value * 360 / scale;
    el.arcs.forEach(function(arc, idx) {
        const arc_angle = Math.min((idx + 1) * 90, angle) - 135;
        arc.setAttribute('style', ['-webkit-', '-moz-', '-o-', '-ms-', '', ''].join('transform: rotate(' + arc_angle + 'deg); '));
    });
    el.arc_cover.classList[angle > 90 ? 'add' : 'remove']('invisible');
}

function urlForLanguage(lang, url) {
    if (url === undefined) {
        url = window.location.href;
    }
    let curr_lang = getLanguage();
    return url.replace(new RegExp('/' + curr_lang + '/', 'i'), '/' + lang.trim().toLowerCase() + '/');
}

function setLanguage(el, name) {
    const all_languages = {
        ach  : 'Translations',
        en   : 'English',
        de   : 'Deutsch',
        es   : 'Español',
        fr   : 'Français',
        id   : 'Indonesia',
        it   : 'Italiano',
        ja   : '日本語',
        pl   : 'Polish',
        pt   : 'Português',
        ru   : 'Русский',
        th   : 'Thai',
        vi   : 'Tiếng Việt',
        zh_cn: '简体中文',
        zh_tw: '繁體中文',
    };
    const el_navbar_nav = document.getElementsByClassName('navbar-nav')[0];

    if (/pt|vi|id/.test(name)) {
        el_navbar_nav.classList.add('word-wrap'); // wrap long words
    }

    document.getElementById('selected-lang').textContent = all_languages[name];
    const el_name = document.getElementsByClassName(name)[0];
    if (el_name) {
        el_name.classList.add('invisible');
    }

    el_navbar_nav.classList.remove('invisible');
    el.classList.remove('invisible');
}

function checkUserSession() {

    const getAllAccountsObject = () => JSON.parse(localStorage.getItem('client.accounts'));
    const client_object        = getAllAccountsObject();
    const current_loginid      = localStorage.getItem('active_loginid');

    const isEmptyObject = (obj) => {
        let is_empty = true;
        if (obj && obj instanceof Object) {
            Object.keys(obj).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
            });
        }
        return is_empty;
    };

    const get = (key, loginid = current_loginid) => {
        let value;
        if (key === 'loginid') {
            value = loginid || localStorage.getItem('active_loginid');
        } else {
            const current_client = client_object[loginid] || getAllAccountsObject()[loginid] || {};

            value = key ? current_client[key] : current_client;
        }
        if (!Array.isArray(value) && (+value === 1 || +value === 0 || value === 'true' || value === 'false')) {
            value = JSON.parse(value || false);
        }
        return value;
    };

    const isLoggedIn = () => (
        !isEmptyObject(getAllAccountsObject()) &&
        get('loginid') &&
        get('token')
    );

    const signup_form        = document.getElementById('sign-up-section');
    const account_exists_msg = document.getElementById('account_exists_message');

    if (!isLoggedIn()) {
        if (signup_form) {
            signup_form.classList.remove('invisible');
        }
        if (account_exists_msg) {
            account_exists_msg.classList.remove('invisible');
        }
    }
}

function openLink(link) {
    var open_link = window.open();
    open_link.opener = null;
    open_link.location = link;
}

function getHowToIcoDocumentUrl(lang = 'en') {
    return `https://ico_documents.binary.com/howto_ico${/^(ru|id|pt|vi)$/i.test(lang) ? `_${lang}` : ''}.pdf`
}

function getTokenRatingReportUrl(lang = 'en') {
    return `https://ico_documents.binary.com/research/tokenrating/tokenrating_research_report${/^(id|de)$/i.test(lang) ? `_${lang}` : ''}.pdf`
}

function getLykkeReport(lang = 'en') {
    return `https://ico_documents.binary.com/research/lykke/lykke_research_report${/^(id)$/i.test(lang) ? `_${lang}` : ''}.pdf`
}

function getNishantReport(lang = 'en') {
    return `https://ico_documents.binary.com/research/nishantsah/report${/^(id|zh_cn|zh_tw|ru|th)$/i.test(lang) ? `_${lang}` : ''}.pdf`
}

function gtmPushDataLayer(obj) {
    if (obj && /^(1|1098)$/.test(getAppId())) {
        dataLayer.push(obj);
    }
}

function handleICOClose(el_banner) {
    el_banner.addEventListener('click', function() {
        openLink(this.getAttribute('data-url'));
    });
}

function handleViewMemorandum() {
    const el_view_memorandum = document.getElementById('view_memorandum');
    if (el_view_memorandum) {
        el_view_memorandum.addEventListener('click', function () {
            window.location.href = this.getAttribute('data-url');
        });
    }
}

function handleEmailBlurFocus() {
    const el_email = document.getElementById('awf_field-90867273');
    if (el_email) {
        el_email.addEventListener('focus', function () {
            if (this.value === '') {
                this.value = '';
            }
        });
        el_email.addEventListener('blur', function () {
            if (this.value === '') {
                this.value = '';
            }
        });
    }
}
