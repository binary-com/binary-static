const QueryString = (() => {
    // TODO: js doc all methods
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

    const queryObjectToString = (query_object) => {
        const keys = Object.keys(query_object);
        if (keys.length === 0) return '';
        const query_str = keys
            .map(key => `${key}=${query_object[key]}`)
            .join('&');
        return `?${query_str}`;
    };

    const removeParamFromQueryString = (query_string, removal_key) => {
        const query_obj = queryStringToObject(query_string);
        const new_query_str = Object.keys(query_obj)
            .filter(key => key !== removal_key)
            .map(key => `${key}=${query_obj[key]}`)
            .join('&');
        return new_query_str !== '' ? `?${new_query_str}` : '';
    };

    // TODO: add setParamsInQueryString function
    // TODO: add tests for setParamsInQueryString
    // const setParamsInQueryString = (query_string, params_obj) => {
    //     const query_obj = queryStringToObject(query_string);

    // };

    const setQueryStringWithoutReload = (new_query_str) => {
        const { pathname, hash } = window.location;
        window.history.replaceState('', '', `${pathname}${new_query_str}${hash}`);
    };

    return {
        queryStringToObject,
        queryObjectToString,
        removeParamFromQueryString,
        setQueryStringWithoutReload,
    };
})();

module.exports = QueryString;