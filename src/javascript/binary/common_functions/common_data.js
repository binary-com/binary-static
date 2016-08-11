var CommonData = (function(){
    //because getCookieItem('login') is confusing and does not looks like we are getting API token
    function getApiToken() {
        return Cookies.get('login');
    }

    return {
        getApiToken: getApiToken
    };
}());
