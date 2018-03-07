const isVisible = require('./common_functions').isVisible;
const Url = require('./url');

const ScrollToAnchor = (() => {
    const init = () => {
        scrollToAnchorInQuery();
        addAnchorsToElements();
    };

    const makeAnchorLink = (id) => {
        const anchor_link = document.createElement('a');
        const { origin, pathname, hash } = window.location;
        anchor_link.href = `${origin}${pathname}?anchor=${encodeURI(id)}${hash}`;
        anchor_link.innerText = '#';
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
                console.log(id);
                $.scrollTo(el, 500);
                Url.setQueryStringWithoutReload(
                    // TODO: modify current q.s.
                    `?anchor=${encodeURI(id)}`
                );
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
        $.scrollTo(el, 500);
    };

    return {
        init,
    };
})();

module.exports = ScrollToAnchor;