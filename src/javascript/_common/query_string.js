const QueryString = (() => {
    const queryStringToObject = (query_string) => {
        if (query_string === '') return {};
        return query_string
            .slice(1)
            .split('&')
            .map(pair => pair.split('='))
            .reduce((obj, [ key, val ]) => {
                obj[key] = window.decodeURI(val);
                return obj;
            }, {});
    };

    const removeParamFromQueryString = (query_string, removal_key) => {
        const query_obj = queryStringToObject(query_string);
        const new_query_str = Object.keys(query_obj)
            .filter(key => key !== removal_key)
            .map(key => `${key}=${query_obj[key]}`)
            .join('&');
        return new_query_str !== '' ? `?${new_query_str}` : '';
    };

    const setQueryStringWithoutReload = (new_query_str) => {
        const { pathname, hash } = window.location;
        window.history.replaceState('', '', `${pathname}${new_query_str}${hash}`);
    };

    return {
        queryStringToObject,
        removeParamFromQueryString,
        setQueryStringWithoutReload,
    };
})();

module.exports = QueryString;