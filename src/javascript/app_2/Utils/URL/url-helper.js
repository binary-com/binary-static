import { isEmptyObject } from '_common/utility';

export default class URLHelper {
    /**
     * Get query string of the url
     *
     * @param {String|null} url
     *
     * @return {Object} returns a key-value object that contains all query string of the url.
     */
    static getQueryParams(url) {
        const query_string =  url ? new URL(url).search : window.location.search;
        const query_encoded = encodeURIComponent(query_string);
        const query_params = new URLSearchParams(query_encoded);

        return query_params;
    }

    /**
     * append params to url query string
     *
     * @param {Object} params - a key value object that contains all query strings should be added to the url
     * @param {String} url - the url that should query strings add to
     *
     * @return {Object} returns modified url object.
     */
    static setQueryParam(params, url = null) {
        const url_object = url ? new URL(url) : window.location;
        const param_object = new URLSearchParams(url_object.search.slice(1));
        Object.keys(params).forEach((name) => {
            param_object.delete(name);

            const value = params[name];

            if (value && typeof value !== 'object' && value !== '') {
                param_object.append(name, params[name]);
            }
        });

        if (param_object.length) {
            param_object.sort();
        }

        if (!url) {
            window.history.replaceState(null, null, `?${decodeURIComponent(param_object.toString())}`);
        } else {
            url_object.search = param_object.toString();
        }

        return url_object;
    }

    /**
     * Update query string by values of passing object
     *
     * @param {Object} store - an object that contains values which should be added to the query string
     * @param {string[]} allowed_query_string_variables - a list of variables those are allowed to add to query string.
     *
     * @return {Object} returns an iterator object of updated query string
     */
    static updateQueryString(store, allowed_query_string_variables, set_query_string = false) {
        const query_params = URLHelper.getQueryParams();

        if (!isEmptyObject(store)) {

            // create query string by default values in trade_store if the param doesn't exist in query string.
            allowed_query_string_variables
                .filter(p => !query_params.get(p)).forEach(key => {
                    if (store[key]) {
                        if (set_query_string) {
                            URLHelper.setQueryParam({ [key]: store[key] });
                        }

                        query_params.set(key, store[key]);
                    }
                });
        }
        return query_params;
    }

    /**
     * Prunes the query string values
     *
     * @param {string[]} keys - A list of variable's name which should be in url's query string.
     */
    static pruneQueryString(keys = []) {
        const query_params = URLHelper.getQueryParams();

        [...query_params].forEach(value => keys.indexOf(value[0]) <= -1 && query_params.delete(value[0]));

        const query_string = [...query_params].length ? `?${query_params.toString()}` : '';

        window.history.replaceState(null, null, decodeURIComponent(query_string));
    }
}
