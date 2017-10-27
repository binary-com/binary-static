window.onload = function() {
    toggleMobileMenu();
    hashRouter();
    collapseNavbar();

    dataLayer.push({ language: getLanguage().toUpperCase() });
    dataLayer.push({ event: 'page_load' });

    const clients_country = getClientCountry();

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

    // Scroll to section
    document.addEventListener('click', function(e) {
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
            initCountdown(response.time, '2017-11-15');
        }
    }

    return clients_country;
}

// Collapse navbar on scroll
function collapseNavbar() {
    const navbarFixedTopEl = document.getElementsByClassName('navbar-fixed-top');
    navbarFixedTopEl[0].classList[window.scrollY < 50 ? 'add' : 'remove']('top-nav-collapse');
}

function initCountdown(start_epoch, end_date) {
    const el_container = document.getElementById('countdown_container');
    const date_diff    = Date.parse(new Date()) - start_epoch * 1000;
    const elements     = {};
    let countdownd_interval;

    // Get all elements only once
    function getElements(id) {
        const item = el_container.querySelector('#cd_' + id);
        elements[id] = {
            value    : item.querySelector('.cd-value'),
            arcs     : item.querySelectorAll('.arc_q'),
            arc_cover: item.querySelector('.arc_cover'),
        };
    }
    ['days', 'hours', 'minutes', 'seconds'].forEach(function(id) { getElements(id); });


    function updateCountdown() {
        const remaining = calcRemainingTime(end_date, date_diff);

        arc(elements.days,    remaining.days,    20);
        arc(elements.hours,   remaining.hours,   24);
        arc(elements.minutes, remaining.minutes, 60);
        arc(elements.seconds, remaining.seconds, 60);

        if (remaining.total <= 0) {
            clearInterval(countdownd_interval);
            el_container.classList.add('invisible');
        }
    }

    updateCountdown();
    countdownd_interval = setInterval(updateCountdown, 1000);

    el_container.classList.remove('invisible'); // make visible when everything set
}

function calcRemainingTime(end_date, date_diff) {
    const total   = Math.floor(Date.parse(new Date(end_date)) - Date.parse(new Date()) + date_diff) / 1000;
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
        arc.style = 'transform: rotate(' + (Math.min((idx + 1) * 90, angle) - 135) + 'deg)';
    });
    el.arc_cover.classList[angle > 90 ? 'add' : 'remove']('invisible');
}
