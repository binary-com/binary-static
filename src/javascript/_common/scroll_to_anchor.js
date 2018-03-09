const isVisible = require('./common_functions').isVisible;
const Url       = require('./url');

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
                $.scrollTo(el, 500);
                Url.updateParamsWithoutReload({
                    anchor: id,
                }, true);
            });
        });
    };

    const scrollToAnchorInQuery = () => {
        const params = Url.paramsHash();
        const id = params.anchor;
        if (!id) return;
        const candidates = document.querySelectorAll(`[data-anchor="${id}"]`);
        const el = Array.from(candidates).find(isVisible);
        if (!el) return;
        window.setTimeout(() => {
            $.scrollTo(el, 500);
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