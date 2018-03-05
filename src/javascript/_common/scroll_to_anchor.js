const ScrollToAnchor = (() => {
    const init = () => {
        const query = getQueryObject(window.location.search);
        // scroll to the element with id === query.anchor
        const id = query.anchor;
        window.scrollIntoView(document.getElementById(id));
    };

    const getQueryObject = (query_string) => query_string
        .slice(1)
        .split('&')
        .map(pair => pair.split('='))
        .reduce((obj, [ key, val ]) => {
            obj[key] = val;
            return obj;
        }, {});

    return {
        init,
        getQueryObject,
    };
})();

module.exports = ScrollToAnchor;