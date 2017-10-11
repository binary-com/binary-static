const Home               = require('./home');
const applyToAllElements = require('../base/utility').applyToAllElements;

const HomeBeta = (() => {
    const onLoad = () => {
        Home.onLoad();

        applyToAllElements('.go-left', (element) => {
            element.removeEventListener('click', (e) => { changeTab(e, true); });
            element.addEventListener('click', (e) => { changeTab(e, true); });
        });
        applyToAllElements('.go-right', (element) => {
            element.removeEventListener('click', (e) => { changeTab(e, false); });
            element.addEventListener('click', (e) => { changeTab(e, false); });
        });
        applyToAllElements('.tm-li', (element) => {
            element.removeEventListener('click', selectTab);
            element.addEventListener('click', selectTab);
        });
    };

    const changeTab = (e, go_left) => {
        const selector = e.target.getAttribute('data-parent');
        const el_parent = document.getElementById(selector);
        const elements = el_parent.getElementsByTagName('li');
        for (let i = 0; i < elements.length; i++) {
            if (/active/.test(elements[i].classList)) {
                elements[i].classList.remove('active');
                document.getElementById(`${elements[i].getAttribute('id')}-content`).classList.add('invisible');
                let el_to_show;
                if (go_left) {
                    el_to_show = elements[i - 1] ? elements[i - 1] : elements[elements.length - 1];
                } else {
                    el_to_show = elements[i + 1] ? elements[i + 1] : elements[0];
                }
                el_to_show.classList.add('active');

                const new_index = Array.prototype.indexOf.call(el_parent.childNodes, el_to_show);
                SlideSelector(e, selector, new_index);

                document.getElementById(`${el_to_show.getAttribute('id')}-content`).classList.remove('invisible');
                break;
            }
        }
    };

    const selectTab = (e) => {
        const selector  = e.target.closest('ul').getAttribute('id');
        const new_index = Array.prototype.indexOf.call(e.target.closest('ul').childNodes, e.target.parentNode);
        SlideSelector(e, selector, new_index);
    };

    const SlideSelector = (e, selector, new_index) => {
        if (!/img|a/i.test(e.target.nodeName)) {
            return;
        }
        const selected_index = Math.floor(new_index / 2) + 1;
        const margin_left    = (selected_index - 1) * (100 / document.getElementById(selector).children.length);
        $(`#${selector}_selector`).animate({ 'margin-left': `${margin_left}%` }, 300);
    };

    return {
        onLoad,
    };
})();

module.exports = HomeBeta;
