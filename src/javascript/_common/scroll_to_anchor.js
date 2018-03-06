const isVisible = require('./common_functions').isVisible;
const QueryString = require('./query_string');

const ScrollToAnchor = (() => {
    const init = () => {
        scrollToElement();
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
        });
    };

    const scrollToElement = () => {
        const query = QueryString.queryStringToObject(window.location.search);
        const id = query.anchor;
        if (!id) return;
        const candidates = document.querySelectorAll(`[data-anchor="${id}"]`);
        const el = Array.from(candidates).find(isVisible);
        if (!el) return;
        window.el1 = el; // for testing, remove later
        console.log('scroll to anchor', el.offsetTop, document.readyState);
        $.scrollTo(el, 500);
    };

    return {
        init,
    };
})();

module.exports = ScrollToAnchor;