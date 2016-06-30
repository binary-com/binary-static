/* jshint ignore:start */
if (typeof window === 'undefined') {
    Element = function() {};
}

var Compatibility = (function() {
    function requireIfNotExist(var_name, path, optional_function_name) {
        return (typeof window !== 'undefined' ? window[var_name] :
                optional_function_name        ? require(path)[optional_function_name] :
                                                require(path));
    }

    var external = {
        requireIfNotExist: requireIfNotExist
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }
    return external;
}());
/* jshint ignore:end */
