const ScrollToAnchor = (() => {
    const init = () => {
        scrollToElement();
    };

    const scrollToElement = () => {
        const query = getQueryObject(window.location.search);
        const val = query.anchor;
        const el = document.querySelector(`[data-anchor="${val}"]`);
        console.log('query val ->', val);
        console.log('el ->', el);
        if (el) {
            el.scrollIntoView();
        }
    };

    const getQueryObject = (query_string) => query_string
        .slice(1)
        .split('&')
        .map(pair => pair.split('='))
        .reduce((obj, [ key, val ]) => {
            obj[key] = window.decodeURI(val);
            return obj;
        }, {});

    return {
        init,
        getQueryObject,
    };
})();

module.exports = ScrollToAnchor;