// Handler when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(){

    // Toggle mobile menu
    const toggleButton = document.getElementById('toggle-menu');
    const navbar = document.getElementsByClassName('navbar')[0];
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
            const target = e.target.getAttribute('href').substr(1);
            let offset = 0;
            if (target === 'page-top') {
                offset = 55;
            }
            let navbarHeight = checkWidth();
            const to = document.getElementById(target).offsetTop - navbarHeight - offset;
            scrollTo(document.body, to, 500);
            if (navbar.classList.contains('expand')) {
                navbar.classList.remove('expand');
            }
            e.preventDefault();
        }
    });

    window.onresize = checkWidth;
});


// Check view width, add navbar height as offset if on desktop
function checkWidth() {
    let mq = window.matchMedia("(max-width: 1199px)");
    if (mq.matches) {
        return 50;
    } else {
        return document.getElementsByClassName('navbar')[0].scrollHeight;
    }
}

function checkBrowser() {
    const isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    const isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11

    if (isFirefox || isIE) {
        return true;
    } else {
        return false;
    }
}

// scrollTo function with animation
// - Gist reference: https://gist.github.com/andjosh/6764939
function scrollTo(element, to, duration) {
    if (checkBrowser()) {
        element = document.documentElement;
    }
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    const animateScroll = function(){
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
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