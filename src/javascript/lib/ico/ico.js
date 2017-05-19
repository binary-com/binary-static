// Handle form submission
if (window.location.hash === '#done') {
    document.querySelectorAll('.notice-msg')[0].classList.remove('invisible');
    document.querySelectorAll('.notice-msg')[1].classList.remove('invisible');
    document.getElementsByTagName('form')[0].classList.add('invisible');
    document.getElementsByTagName('form')[1].classList.add('invisible');
    if(window.history.pushState) {
        window.history.pushState('', '/', window.location.pathname)
    } else {
        window.location.hash = '';
    }
}

// Collapse navbar on scroll
function collapseNavbar() {
    const navbarFixedTopEl = document.getElementsByClassName('navbar-fixed-top');
    if (window.scrollY > 50) {
        navbarFixedTopEl[0].classList.add('top-nav-collapse');
    } else {
        navbarFixedTopEl[0].classList.remove('top-nav-collapse');
    }
}

window.onscroll = collapseNavbar;
document.ready = collapseNavbar;

// Toggle mobile menu
const toggleButton = document.getElementById('toggle-menu');
toggleButton.addEventListener('click', function (e) {
    const navbar = document.getElementsByClassName('navbar-fixed-top')[0];
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
        const target = e.target.getAttribute('href').substr(1);
        let offset = 0;
        if (target === 'who-we-are' || target === 'page-top') {
            offset = 80;
        }
        const to = document.getElementById(target).offsetTop - 50 - offset;
        scrollTo(document.body, to, 1500);
        e.preventDefault();
    }
});

// scrollTo function with animation
// - Gist reference: https://gist.github.com/andjosh/6764939
function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
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