const Charity = (() => {
    'use strict';

    let interval = null;

    const onLoad = () => {
        const $gallery = $('.gallery');
        let images;
        const switchPicture = () => {
            images = $gallery.find('img');
            if (images.length > 1) {
                images.eq(images.length - 1).prependTo($gallery);
            }
        };
        interval = window.setInterval(switchPicture, 5000);
    };

    const onUnload = () => {
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
