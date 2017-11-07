window.onload = function() {
    const clients_country = getClientCountry();

    toggleMobileMenu();
    hashRouter();
    collapseNavbar();

    dataLayer.push({ language: getLanguage().toUpperCase() });
    dataLayer.push({ event: 'page_load' });

    function switchView(path) {
        document.getElementById('faq').classList[path === 'faq' ? 'remove' : 'add']('invisible');
        document.getElementById('home').classList[path === 'faq' ? 'add' : 'remove']('invisible');
    }

    function hashRouter() {
        const hash = window.location.hash.substr(1);

        if (/done/.test(hash)) {
            dataLayer.push({ bom_country_abbrev: clients_country || '' });
            dataLayer.push({ event: 'ico_success' });
            clearHash();
            for (let i = 0; i < 2; i++) {
                document.querySelectorAll('.notice-msg')[i].classList.remove('invisible');
                document.getElementsByTagName('form')[i].classList.add('invisible');
            }
            let navbarHeight = checkWidth();
            const to = document.getElementById('coming-soon').offsetTop - navbarHeight;
            scrollTo(to);
        }

        if (/faq/.test(hash)) {
            switchView('faq');
            scrollTo(0);
            window.location.hash = '#faq';
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
            const to = document.getElementById(target).offsetTop - navbarHeight - offset;
            scrollTo(to);
        }

        // Show / hide language dropdown
        if (e.target.parentNode.id === 'lang') {
            e.preventDefault();
            e.target.parentNode.parentNode.classList.toggle('show');
        } else if (/show/.test(el_language_dropdown.classList)) {
            el_language_dropdown.classList.remove('show');
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

    setupCrowdin();
};

function clearHash() {
    if (window.history.pushState) {
        window.history.pushState('', '/', window.location.pathname);
    } else {
        window.location.hash = '';
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

        const display_class = 'status-' + (is_before_start ? 'before-start' : is_started ? 'started' : 'ended');
        el_container.querySelectorAll('.status-toggle').forEach(function(el) {
            el.classList[el.classList.contains(display_class) ? 'remove' : 'add'](hidden_class);
        });

        document.getElementById('status_loading').classList.add(hidden_class);
        el_container.classList.remove(hidden_class);

        if (!is_before_start) {
            document.getElementById('ico_subscribe_section').classList.add(hidden_class);
            if (!is_started) { // is_ended
                clearInterval(countdownd_interval);
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
    document.getElementsByClassName(name)[0].classList.add('invisible');

    el_navbar_nav.classList.remove('invisible');
    el.classList.remove('invisible');
}

function setupCrowdin() {
    const all_languages = [
        'ACH', 'EN', 'DE', 'ES',
        'FR', 'ID', 'IT', 'JA',
        'PL', 'PT', 'RU', 'TH',
        'VI', 'ZH_CN', 'ZH_TW',
    ];

    const isInContextEnvironment = () => {
        const lang_regex = new RegExp(`^(${all_languages.join('|')})$`, 'i');
        const url_params = window.location.href.split('/').slice(3);
        const language   = (url_params.find(lang => lang_regex.test(lang)) || '');

        return /^https:\/\/staging\.binary\.com\/translations\//i.test(window.location.href) &&
        /ach/i.test(language)
    };

    if (isInContextEnvironment()) {
        document.getElementById('language').style.display = 'none';
        /* eslint-disable no-underscore-dangle */
        window._jipt = [];
        window._jipt.push(['project', 'binary-static']);
        /* eslint-enable no-underscore-dangle */
        if (document.body) {
            const crowdinScript = document.createElement('script');
            crowdinScript.setAttribute('src', `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`);
            crowdinScript.setAttribute('type', 'text/javascript');
            document.body.appendChild(crowdinScript);
        }
    }
}
