var CharityPage = (function() {
    var timeout = 5000;
    var interval = null;
    var gallery;
    var images;
    var onLoad = function() {
        function switchPicture() {
            images = gallery.find('img');
            if (images.length > 1) {
                images.eq(images.length - 1).prependTo(gallery);
            }
        }
        gallery = $('.gallery');
        interval = window.setInterval(switchPicture, timeout);
    };
    var onUnload = function() {
        if (interval) {
            window.clearInterval(interval);
            interval = null;
        }
    };
    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    CharityPage: CharityPage,
};
