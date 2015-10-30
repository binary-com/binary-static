var CommonData = (function(){
    function getCookieItem(sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }
    
    //because getCookieItem('login') is confusing and does not looks like we are getting API token
    function getApiToken(){
        return getCookieItem("login");
    }

    return {
        getCookieItem: getCookieItem,
        getApiToken: getApiToken
    };
}());