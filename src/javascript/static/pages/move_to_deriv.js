const getCurrentBinaryDomain = require('../../config').getCurrentBinaryDomain;

const MoveToDeriv = (() => {
    let $iframe,$loading;
    const container = '#move_to_deriv_container';
    const default_iframe_height = 700;

    const onLoad = () => {
        /* eslint-disable */
        console.log('its working')
        handleCashierResponse()
        /* eslint-enable */
    };

    const handleCashierResponse = () => {
        $iframe = $(container).find('#move_to_deriv_iframe');
        window.addEventListener('message', setFrameHeight, false);
        $iframe.attr('src', 'https://deriv-com-git-fork-njazuli-deriv-binary-to-deriv-landing-page.binary.sx/move-to-deriv/').parent().setVisibility(1);

        setTimeout(() => { // wait for iframe contents to load before removing loading bar
            $loading.remove();
        }, 1000);
    };

    const setFrameHeight = (e) => {
        if (!new RegExp(`www\\.${getCurrentBinaryDomain()}`, 'i').test(e.origin)) {
            $iframe.height(+e.data || default_iframe_height);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = MoveToDeriv;
