// Handler when the DOM is fully loaded
document.addEventListener('DOMContentLoaded',function(){toggleMobileMenu();var navbar=document.getElementsByClassName('navbar')[0];// Scroll to section
document.addEventListener('click',function(e){if(e.target.classList.contains('page-scroll')){var target=e.target.getAttribute('href').substr(1);var offset=target==='page-top'?55:0;var navbarHeight=checkWidth();var el_target=document.getElementById(target);var to=el_target?el_target.offsetTop-navbarHeight-offset:'';scrollTo(to,500);if(navbar.classList.contains('expand')){navbar.classList.remove('expand')}e.preventDefault()}});window.onresize=checkWidth;commonOnload()});
//# sourceMappingURL=hackathon.js.map
