const isVisible     = require('./common_functions').isVisible;
const Url           = require('./url');
const createElement = require('./utility').createElement;

/*
    adds anchor links to elements with data-anchor attribute
    created anchors work similarly to native anchors,
    but rely on URL params instead

    HOW TO USE:
        <h1 data-anchor='some string'>Some title</h1>   // passed string doesn't have to be unique

        or

        <HeaderSecondary header={it.L('Forex')} has_data_anchor />
*/

const ScrollToAnchor = (() => {
    let id_occurrence_count = {};

    const init = () => {
        addAnchorsToElements();
        scrollToAnchorInQuery();
    };

    const encode = (str) => {
        const encoded = str.toLowerCase().replace(/\s/g, '-');
        let appendix = '';
        if (id_occurrence_count[encoded]) {
            appendix = `-${++id_occurrence_count[encoded]}`;
        } else {
            id_occurrence_count[encoded] = 1;
        }
        return encodeURI(`${encoded}${appendix}`);
    };

    const makeAnchorLink = (id) => {
        const url = new URL(window.location);
        url.search = `anchor=${id}`;

        return createElement('a', {
            class: 'data-anchor-link',
            href : url.href,
        });
    };

    const addAnchorsToElements = () => {
        const els = document.querySelectorAll('[data-anchor]');
        els.forEach(el => {
            const title = el.dataset.anchor;
            const id = encode(title);
            el.dataset.anchor = id;
            const anchor_link = makeAnchorLink(id);
            el.appendChild(anchor_link);
            anchor_link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToEl(el);
                Url.updateParamsWithoutReload({
                    anchor: id,
                }, true);
            });
        });
    };

    const scrollToEl = (el) => {
        $.scrollTo(el, 500, { offset: -10 });
    };

    const getAnchorTargetElement = () => {
        const params = Url.paramsHash();
        const id = params.anchor;
        if (!id) return null;
        const candidates = document.querySelectorAll(`[data-anchor="${id}"]`);
        const el = Array.from(candidates).find(isVisible);
        return el;
    };

    const scrollToAnchorInQuery = () => {
        const el = getAnchorTargetElement();
        if (!el) return;
        window.setTimeout(() => {
            scrollToEl(el);
        }, 100);
    };

    const cleanup = () => {
        id_occurrence_count = {};
        const el = getAnchorTargetElement();
        // remove anchor param, when leaving the page with target element
        if (el) {
            Url.updateParamsWithoutReload({
                anchor: null,
            }, true);
        }
    };

    return {
        init,
        cleanup,
    };
})();

module.exports = ScrollToAnchor;