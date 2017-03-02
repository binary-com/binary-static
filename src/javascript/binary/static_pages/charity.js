const Charity = (function() {
    const timeout = 5000;
    let gallery,
        images,
        interval = null;

    const onLoad = function() {
        const switchPicture = function() {
            images = gallery.find('img');
            if (images.length > 1) {
                images.eq(images.length - 1).prependTo(gallery);
            }
        };
        gallery = $('.gallery');
        interval = window.setInterval(switchPicture, timeout);
    };

    const onUnload = function() {
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

module.exports = Charity;
