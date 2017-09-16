// Handler when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(){
    dataLayer.push({ event: 'page_load' });

    // Handle form submission
    if (window.location.hash === '#done') {
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

    // Toggle mobile menu
    const toggleButton = document.getElementById('toggle-menu');
    const navbar = document.getElementsByClassName('navbar-fixed-top')[0];
    toggleButton.addEventListener('click', function (e) {
        if (navbar.classList.contains('expand')) {
            navbar.classList.remove('expand');
        } else {
            navbar.classList.add('expand');
        }
        e.stopPropagation();
    });

    // Scroll to section
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-scroll')) {
            document.getElementById('home').classList.remove('invisible');
            document.getElementById('faq').classList.add('invisible');
            const target = e.target.getAttribute('href').substr(1);
            const offset = /who-we-are|page-top/.test(target) ? 55 : 0;
            let navbarHeight = checkWidth();
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

// Check view width, add navbar height as offset if on desktop
function checkWidth() {
    let mq = window.matchMedia("(max-width: 1199px)");
    if (mq.matches) {
        return 0;
    } else {
        return document.getElementsByClassName('navbar-fixed-top')[0].scrollHeight;
    }
}

function checkBrowser() {
    const isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    const isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
    return (isFirefox || isIE);
}

// scrollTo function with animation
// - Gist reference: https://gist.github.com/andjosh/6764939
function scrollTo(to, duration) {
    if (!duration) duration = 1000;
    let start = window.pageYOffset,
        change = to - start,
        currentTime = 0,
        increment = 20;

    const animateScroll = function(){
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
        document.body.scrollTop = val;
        document.documentElement.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
