// Handler when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(){
    dataLayer.push({ event: 'page_load' });

    var clients_country = sessionStorage.getItem('clients_country');
    if (!clients_country) {
        var accounts = JSON.parse(localStorage.getItem('client.accounts') || null);
        if (accounts) {
            Object.keys(accounts).some(function (l) {
                if (accounts[l].residence) {
                    clients_country = accounts[l].residence;
                    sessionStorage.setItem('clients_country', clients_country);
                    return true;
                }
            });
        }
        if (!clients_country) {
            var ws = wsConnect();

            function sendWebsiteStatus() {
                ws.send(JSON.stringify({ website_status: 1 }));
            }

            if (ws.readyState === 1) {
                sendWebsiteStatus();
            } else {
                ws.onopen = sendWebsiteStatus;
            }
            ws.onmessage = function (msg) {
                var response = JSON.parse(msg.data);
                if (response.website_status) {
                    clients_country = response.website_status.clients_country;
                    sessionStorage.setItem('clients_country', clients_country);
                }
            }
        }
    }

    // Handle form submission
    if (window.location.hash === '#done') {
        dataLayer.push({ bom_country: clients_country || '' });
        dataLayer.push({ event: 'ico_success' });
        for (let i = 0; i < 2; i++) {
            document.querySelectorAll('.notice-msg')[i].classList.remove('invisible');
            document.getElementsByTagName('form')[i].classList.add('invisible');
        }
        if (window.history.pushState) {
            window.history.pushState('', '/', window.location.pathname)
        } else {
            window.location.hash = '';
        }
        let navbarHeight = checkWidth();
        const to = document.getElementById('coming-soon').offsetTop - navbarHeight;
        scrollTo(to);
    }

    // Set language fields
    const language = getLanguage();
    const el_langs = document.getElementsByClassName('frm-language');
    for (let i = 0; i < el_langs.length; i++) {
        el_langs[i].value = language;
    }

    toggleMobileMenu();

    // Scroll to section
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-scroll')) {
            document.getElementById('home').classList.remove('invisible');
            document.getElementById('faq').classList.add('invisible');
            const target = e.target.getAttribute('href').substr(1);
            const offset = /who-we-are|page-top/.test(target) ? 55 : 0;
            const navbarHeight = checkWidth();
            const to = document.getElementById(target).offsetTop - navbarHeight - offset;
            scrollTo(to);
            e.preventDefault();
        }
    });

    const faqButton = document.getElementById('faq-btn');
    faqButton.addEventListener('click', function(e) {
        document.getElementById('faq').classList.remove('invisible');
        scrollTo(0);
        e.stopPropagation();
        document.getElementById('home').classList.add('invisible');
    });

    window.onresize = checkWidth;
    window.onscroll = collapseNavbar;
    document.ready = collapseNavbar;
});

// Collapse navbar on scroll
function collapseNavbar() {
    const navbarFixedTopEl = document.getElementsByClassName('navbar-fixed-top');
    navbarFixedTopEl[0].classList[window.scrollY > 50 ? 'add' : 'remove']('top-nav-collapse');
}
