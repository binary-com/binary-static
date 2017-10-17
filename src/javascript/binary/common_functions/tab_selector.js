const applyToAllElements = require('../base/utility').applyToAllElements;

const TabSelector = (() => {
    let current_tab_id = '';
    let has_arrows     = false;
    let array_tab      = [];

    /**
     * @param {String|Array} tab_ids can be the ID of single set of tabs or an array of all elements
     * @param {Boolean} has_left_right_arrows send true if .go-left and .go-right arrows need to work with tabs
     */
    const init = (tab_ids, has_left_right_arrows = false) => {
        array_tab = Array.isArray(tab_ids) ? tab_ids : [tab_ids];
        // set initial width and margin-left of tab selector
        array_tab.forEach((tab_id) => {
            current_tab_id = tab_id;
            repositionSelector();
            window.addEventListener('resize', repositionSelector);
        });

        applyToAllElements('.tm-li', (element) => {
            element.addEventListener('click', slideSelectorOnMenuClick);
        });

        has_arrows = has_left_right_arrows;
        if (has_arrows) {
            applyToAllElements('.go-left', (element) => {
                element.addEventListener('click', goLeft);
            });
            applyToAllElements('.go-right', (element) => {
                element.addEventListener('click', goRight);
            });
        }
    };

    const repositionSelector = () => {
        changeTab(undefined, undefined, current_tab_id);
    };

    const slideSelectorOnMenuClick = (e) => {
        slideSelector(e.target.closest('ul').getAttribute('id'), e.target);
    };

    const goLeft = (e) => {
        changeTab(e, true);
    };

    const goRight = (e) => {
        changeTab(e, false);
    };

    const changeTab = (e, go_left, selector_id) => {
        const selector  = selector_id || e.target.getAttribute('data-parent');
        const el_parent = document.getElementById(selector);
        const elements  = el_parent.getElementsByTagName('li');
        for (let i = 0; i < elements.length - 1; i++) {
            if (/active/.test(elements[i].classList)) {
                if (typeof go_left === 'undefined') {
                    slideSelector(selector, elements[i]);
                    break;
                }
                let index_to_show;
                if (go_left) {
                    index_to_show = elements[i - 1] ? i - 1 : elements.length - 2;
                } else {
                    index_to_show = i + 1 !== elements.length - 1 && elements[i + 1] ? i + 1 : 0;
                }
                const el_to_show = elements[index_to_show];
                selectCircle(selector, i, index_to_show);
                slideSelector(selector, el_to_show);
                elements[i].classList.remove('active');
                document.getElementById(`${elements[i].getAttribute('id')}-content`).classList.add('invisible');
                el_to_show.classList.add('active');
                document.getElementById(`${el_to_show.getAttribute('id')}-content`).classList.remove('invisible');
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
        array_tab.forEach((tab_id) => {
            current_tab_id = tab_id;
            window.removeEventListener('resize', repositionSelector);
        });

        applyToAllElements('.tm-li', (element) => {
            element.removeEventListener('click', slideSelectorOnMenuClick);
        });

        if (has_arrows) {
            applyToAllElements('.go-left', (element) => {
                element.removeEventListener('click', goLeft);
            });
            applyToAllElements('.go-right', (element) => {
                element.removeEventListener('click', goRight);
            });
        }
    };

    return {
        init,
        clean,
    };
})();

module.exports = TabSelector;
