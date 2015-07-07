if (window.applicationCache) {
        window.applicationCache.addEventListener('updateready', function(){
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                try {
                    window.applicationCache.swapCache();
                    var appcache_reload_message = $('#appcache-reload-message');
                    appcache_reload_message.css('display', 'block');
                } catch (err) {}
            }
        }, false);

        setInterval(function () {
                try {
                    window.applicationCache.update();
                } catch (err) {}
        }, 5*60*1000);
}
