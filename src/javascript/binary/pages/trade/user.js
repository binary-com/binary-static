var TUser = (function () {
    var data = {};
    return {
        set: function(a){ data = a; },
        get: function(){ return data; }
    };
})();