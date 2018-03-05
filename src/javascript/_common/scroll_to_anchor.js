const ScrollToAnchor = (() => {
    const init = () => {
        getQueryObject(window.location.search);
    };

    const getQueryObject = (query_string) => {
        return query_string
            .slice(1)
            .split('&')
            .map(pair => pair.split('='))
            .reduce((obj, [ key, val ]) => {
                obj[key] = val;
                return obj;
            }, {})
    };

    return {
        init,
        getQueryObject,
    };
})();

module.exports = ScrollToAnchor;