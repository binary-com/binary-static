const tabListener        = require('binary-style').tabListener;
const Url                = require('./url');
const applyToAllElements = require('./utility').applyToAllElements;

const TabSelector = (() => {
    const obj_tabs = {};

    /**
     * @param {String|Array} tab_ids can be the ID of single set of tabs or an array of all elements
     */
    const init = (tab_ids) => {
        tabListener();
        const array_tabs = Array.isArray(tab_ids) ? tab_ids : [tab_ids];
        array_tabs.forEach((tab_id) => {
            obj_tabs[tab_id] = { selected_tab: '', subtabs: [] };
            const tab = document.getElementById(tab_id);
            if (tab) {
                applyToAllElements('li', (subtab) => {
                    if (!obj_tabs[tab_id].selected_tab) {
                        // take the first subtab as the selected tab
                        obj_tabs[tab_id].selected_tab = subtab;
                    }
                    obj_tabs[tab_id].subtabs.push(subtab.getAttribute('id'));
                }, '', tab);
            }
        });
        // set initial width and margin-left of tab selector
        repositionSelector();
        window.addEventListener('resize', repositionSelector);

        applyToAllElements('.tm-li', (element) => {
            element.addEventListener('click', slideSelectorOnMenuClick);
        });

        applyToAllElements('.go-left', (element) => {
            element.addEventListener('click', goLeft);
        });
        applyToAllElements('.go-right', (element) => {
            element.addEventListener('click', goRight);
        });
    };

    const repositionSelector = () => {
        Object.keys(obj_tabs).forEach((tab_id) => {
            changeTab(undefined, undefined, tab_id);
        });
    };

    const slideSelectorOnMenuClick = (e) => {
        if (e.target.nodeName !== 'A' || /a-active/.test(e.target.classList)) {
            return;
        }
        const selector = e.target.closest('ul').getAttribute('id');
        slideSelector(selector, e.target);
        updateURL(selector, e.target.getAttribute('href').slice(1));
    };

    const updateURL = (selector, tab_id) => {
        if (obj_tabs[selector].subtabs.length) {
            const params_hash = Url.paramsHash();
            params_hash[selector] = tab_id;
            const updated_url = `${window.location.origin}${window.location.pathname}?${Url.paramsHashToString(params_hash)}`;
            window.history.replaceState({ url: updated_url }, null, updated_url);
        }
    };

    const goLeft = (e) => {
        changeTab(e, true, undefined);
    };

    const goRight = (e) => {
        changeTab(e, false, undefined);
    };

    const changeTab = (e, go_left, selector_id) => {
        let selector = selector_id || e.target.getAttribute('data-parent');
        let el_parent,
            el_to_show_from_hash;
        const params_hash = Url.paramsHash();
        if (params_hash[selector] && obj_tabs[selector].subtabs.indexOf(params_hash[selector]) > -1) {
            el_to_show_from_hash = document.getElementById(params_hash[selector]);
            if (el_to_show_from_hash) {
                el_parent = el_to_show_from_hash.parentNode;
                selector  = el_parent.getAttribute('id');
            }
        } else {
            el_parent = document.getElementById(selector);
        }
        if (!el_parent) {
            return;
        }
        if (typeof go_left === 'undefined' && !el_to_show_from_hash) {
            slideSelector(selector, obj_tabs[selector].selected_tab);
            return;
        }
        const elements = el_parent.getElementsByTagName('li');
        for (let i = 0; i < elements.length - 1; i++) {
            if (/active/.test(elements[i].classList)) {
                let index_to_show = 0;
                let el_to_show;
                if (params_hash[selector] && selector_id) {
                    el_to_show = el_to_show_from_hash;
                } else {
                    if (go_left) {
                        index_to_show = elements[i - 1] ? i - 1 : elements.length - 2;
                    } else {
                        index_to_show = i + 1 !== elements.length - 1 && elements[i + 1] ? i + 1 : 0;
                    }
                    el_to_show = elements[index_to_show];
                }
                obj_tabs[selector].selected_tab = el_to_show;
                if (!selector_id) {
                    updateURL(selector, el_to_show.getAttribute('id'));
                }

                selectCircle(selector, i, index_to_show);
                slideSelector(selector, el_to_show);
                elements[i].classList.remove('active');
                document.getElementById(`${elements[i].getAttribute('id')}-content`).classList.add('invisible');
                el_to_show.classList.add('active');
                document.getElementById(`${el_to_show.getAttribute('id')}-content`).classList.remove('invisible');

                if (params_hash.section) {
                    setTimeout(() => { $.scrollTo($(`#${params_hash.section}`), 500, { offset: -10 }); }, 500);
                }

                break;
            }
        }
    };

    const slideSelector = (selector, el_to_show) => {
        document.getElementById(`${selector}_selector`).setAttribute('style', `width: ${el_to_show.offsetWidth}px; margin-left: ${el_to_show.offsetLeft}px;`);
    };

    const selectCircle = (selector, old_index, index_to_show) => {
        const el_circle = document.getElementById(`${selector}_circles`);
        if (el_circle) {
            const all_circles = el_circle.children;
            all_circles[old_index].classList.remove('selected');
            all_circles[index_to_show].classList.add('selected');
        }
    };

    const clean = () => {
        window.removeEventListener('resize', repositionSelector);

        applyToAllElements('.tm-li', (element) => {
            element.removeEventListener('click', slideSelectorOnMenuClick);
        });

        applyToAllElements('.go-left', (element) => {
            element.removeEventListener('click', goLeft);
        });
        applyToAllElements('.go-right', (element) => {
            element.removeEventListener('click', goRight);
        });
    };

    return {
        init,
        clean,
    };
})();

module.exports = TabSelector;
