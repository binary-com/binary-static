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
        const selector  = e.target.getAttribute('data-parent');
        const el_parent = document.getElementById(selector);
        const elements  = el_parent.getElementsByTagName('li');
        for (let i = 0; i < elements.length - 1; i++) {
            if (/active/.test(elements[i].classList)) {
                elements[i].classList.remove('active');
                document.getElementById(`${elements[i].getAttribute('id')}-content`).classList.add('invisible');
                let el_to_show;
                if (go_left) {
                    el_to_show = elements[i - 1] ? elements[i - 1] : elements[elements.length - 2];
                } else {
                    el_to_show = i + 1 !== elements.length - 1 && elements[i + 1] ? elements[i + 1] : elements[0];
                }
                el_to_show.classList.add('active');

                const current_index = Array.prototype.indexOf.call(el_parent.childNodes, elements[i]);
                const new_index     = Array.prototype.indexOf.call(el_parent.childNodes, el_to_show);
                SlideSelector(e, selector, new_index, current_index > new_index);

                document.getElementById(`${el_to_show.getAttribute('id')}-content`).classList.remove('invisible');
                break;
            }
        }
    };

    const selectTab = (e) => {
        const selector  = e.target.closest('ul').getAttribute('id');
        const new_index = Array.prototype.indexOf.call(e.target.closest('ul').childNodes, e.target.parentNode);

        const el_parent = document.getElementById(selector);
        const elements  = el_parent.getElementsByTagName('li');
        let current_index = 0;
        for (let i = 0; i < elements.length; i++) {
            if (/active/.test(elements[i].classList)) {
                current_index = Array.prototype.indexOf.call(el_parent.childNodes, elements[i]);
            }
        }

        SlideSelector(e, selector, new_index, current_index > new_index);
    };

    const SlideSelector = (e, selector, new_index, go_left) => {
        if (!/img|a/i.test(e.target.nodeName)) {
            return;
        }
        const selected_index = Math.floor(new_index / 2) + 1;
        const percentage     = 100 / (document.getElementById(selector).children.length - 1);
        const right          = { right: `${100 - (selected_index * percentage)}%` };
        const left           = { left: `${(selected_index - 1) * percentage}%` };
        const $selector      = $(`#${selector}_selector`);
        $selector
            .animate(go_left ? left : right, { duration: 300, queue: false })
            .animate(go_left ? right : left, { duration: 500 });
    };

    return {
        onLoad,
    };
})();

module.exports = HomeBeta;
