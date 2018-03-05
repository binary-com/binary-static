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

const ScrollToAnchor = () => {
    getQueryObject(window.location.search);
};

module.exports = ScrollToAnchor;