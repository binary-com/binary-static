const isVisible = require('./common_functions').isVisible;
const Url = require('./url');

const ScrollToAnchor = (() => {
    const init = () => {
        scrollToAnchorInQuery();
        addAnchorsToElements();
    };

    const makeAnchorLink = (id) => {
        const anchor_link = document.createElement('a');
        const url = new URL(window.location);
        url.search = `anchor=${encodeURI(id)}`;
        anchor_link.href = url.href;
        anchor_link.classList.add('data-anchor-link');
        return anchor_link;
    };

    const addAnchorsToElements = () => {
        const els = document.querySelectorAll('[data-anchor]');
        els.forEach(el => {
            const id = el.dataset.anchor;
            const anchor_link = makeAnchorLink(id);
            el.appendChild(anchor_link);
            anchor_link.addEventListener('click', (e) => {
                e.preventDefault();
                $.scrollTo(el, 500);
                const params = Url.paramsHash();
                params.anchor = window.encodeURI(id);
                Url.setQueryStringWithoutReload(
                    Url.paramsHashToString(params)
                );
            });
        });
    };

    const scrollToAnchorInQuery = () => {
        const params = Url.paramsHash();
        const id = window.decodeURI(params.anchor);
        if (!id) return;
        const candidates = document.querySelectorAll(`[data-anchor="${id}"]`);
        const el = Array.from(candidates).find(isVisible);
        if (!el) return;
        $.scrollTo(el, 500);
    };

    const cleanup = () => {
        const params = Url.paramsHash();
        delete params.anchor;
        const new_query_string = Url.paramsHashToString(params);
        Url.setQueryStringWithoutReload(new_query_string);
    };

    return {
        init,
        cleanup,
    };
})();

module.exports = ScrollToAnchor;