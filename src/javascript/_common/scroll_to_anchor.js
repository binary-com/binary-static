const isVisible = require('./common_functions').isVisible;
const Url       = require('./url');

/*
    adds anchor links to elements with data-anchor attribute
    created anchors work similarly to native anchors, but rely on URL params instead

    HOW TO USE:
        <h1 data-anchor='some string'>Some title</h1>

        --> an anchor link is inserted into the element
        string passed to data-anchor doesn't have to be unique

    IMPLEMENTATION:
        string passed to data-anchor is converted into UNIQUE ID,
        attr value is replaced with this ID
        URL param value is this ID
        e.g.

        <h1 data-anchor='Hello world'>Hello</h1>
        <h1 data-anchor='Hello world'>Hello</h1>

        will become

        <h1 data-anchor='hello-world'>Hello</h1>    // ?anchor=hello-world
        <h1 data-anchor='hello-world-2'>Hello</h1>  // ?anchor=hello-world-2
*/

const ScrollToAnchor = (() => {
    let id_duplicate_count = {};

    const init = () => {
        addAnchorsToElements();
        scrollToAnchorInQuery();
    };

    const encode = (str) => {
        const prep = str.toLowerCase().replace(/\s/g, '-');
        let appendix = '';
        if (typeof id_duplicate_count[prep] === 'number') {
            id_duplicate_count[prep]++;
            appendix = `-${id_duplicate_count[prep] + 1}`;
        } else {
            id_duplicate_count[prep] = 0;
        }
        return encodeURI(`${prep}${appendix}`);
    };

    const makeAnchorLink = (id) => {
        const anchor_link = document.createElement('a');
        const url = new URL(window.location);
        url.search = `anchor=${id}`;
        anchor_link.href = url.href;
        anchor_link.classList.add('data-anchor-link');
        return anchor_link;
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
    }

    const scrollToAnchorInQuery = () => {
        const params = Url.paramsHash();
        const id = params.anchor;
        if (!id) return;
        const candidates = document.querySelectorAll(`[data-anchor="${id}"]`);
        const el = Array.from(candidates).find(isVisible);
        if (!el) return;
        window.setTimeout(() => {
            scrollToEl(el);
        }, 200);
    };

    const cleanup = () => {
        id_duplicate_count = {};
        Url.updateParamsWithoutReload({
            anchor: null,
        }, true);
    };

    return {
        init,
        cleanup,
    };
})();

module.exports = ScrollToAnchor;