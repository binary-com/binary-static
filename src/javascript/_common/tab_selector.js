const tabListener        = require('binary-style').tabListener;
const Url                = require('./url');
const applyToAllElements = require('./utility').applyToAllElements;

const TabSelector = (() => {
    // obj_tabs will be built in the following format:
    // obj_tabs = { first_tab_group_selector_id: { id_tabs: [ id_of_tab_one, id_of_tab_two ] }
    // we will use id_tabs to handle which tab to show when going to the left or right tab
    const obj_tabs = {};

    const onLoad = () => {
        tabListener();
        applyToAllElements('.tab-selector-wrapper .tm-ul', (tab_selector) => {
            const tab_selector_id = tab_selector.getAttribute('id');
            applyToAllElements('.tm-li', (tab) => {
                if (!/tab-selector/.test(tab.className)) {
                    const tab_id = tab.getAttribute('id');
                    if (!obj_tabs[tab_selector_id]) {
                        obj_tabs[tab_selector_id] = { id_tabs: [] };
                    }
                    obj_tabs[tab_selector_id].id_tabs.push(tab_id);
                }
            }, '', tab_selector);
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
        const params_hash = Url.paramsHash();
        Object.keys(obj_tabs).forEach((tab_id) => {
            const id_to_show = params_hash[tab_id] || obj_tabs[tab_id].id_tabs[0];
            const el_to_show = document.getElementById(id_to_show);
            const selector   = el_to_show.parentNode.getAttribute('id');
            changeTab({ selector, el_to_show });
        });
    };

    const slideSelectorOnMenuClick = (e) => {
        if (e.target.nodeName !== 'A' || /a-active/.test(e.target.classList)) {
            return;
        }
        const selector = e.target.closest('ul').getAttribute('id');
        slideSelector(selector, e.target);
        updateURL(selector, e.target.parentNode.getAttribute('id'));
    };

    const updateURL = (selector, tab_id) => {
        const params_hash = Url.paramsHash();
        params_hash[selector] = tab_id;
        const updated_url = `${window.location.origin}${window.location.pathname}?${Url.paramsHashToString(params_hash)}`;
        window.history.replaceState({ url: updated_url }, null, updated_url);
    };

    const goLeft = (e) => {
        changeTab({ selector: e.target.getAttribute('data-parent'), direction: 'left' });
    };

    const goRight = (e) => {
        changeTab({ selector: e.target.getAttribute('data-parent'), direction: 'right' });
    };

    const changeTab = (options) => {
        const params_hash     = Url.paramsHash();
        const arr_id_tabs     = obj_tabs[options.selector].id_tabs;
        const id_selected_tab = params_hash[options.selector] || obj_tabs[options.selector].id_tabs[0];
        const current_index   = arr_id_tabs.indexOf(id_selected_tab);
        let index_to_show = current_index;
        if (options.direction) {
            if (options.direction === 'left') {
                index_to_show = current_index > 0 ? current_index - 1 : arr_id_tabs.length - 1;
            } else {
                index_to_show = current_index === arr_id_tabs.length - 1 ? 0 : current_index + 1;
            }
            options.el_to_show = document.getElementById(arr_id_tabs[index_to_show]);
            updateURL(options.selector, options.el_to_show.getAttribute('id'));
        }

        if (!options.el_to_show || !options.selector) {
            return;
        }

        selectCircle(options.selector, current_index, index_to_show);
        slideSelector(options.selector, options.el_to_show);
        showContent(options.selector, document.getElementById(id_selected_tab), options.el_to_show);

        if (params_hash.section) {
            setTimeout(() => { $.scrollTo($(`#${params_hash.section}`), 500, { offset: -10 }); }, 500);
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

    const showContent = (selector, old_content, new_content) => {
        old_content.classList.remove('active');
        document.getElementById(`${old_content.getAttribute('id')}-content`).classList.add('invisible');
        new_content.classList.add('active');
        document.getElementById(`${new_content.getAttribute('id')}-content`).classList.remove('invisible');
    };

    const onUnload = () => {
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
        onLoad,
        onUnload,
    };
})();

module.exports = TabSelector;
