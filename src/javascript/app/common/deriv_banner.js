const DerivBanner = (() => {
    let $deriv_banner_countainer,
        $multiplier_banner_container,
        $deriv_banner_close_buttons;

    const onLoad = () => {
        const is_deriv_banner_dismissed = localStorage.getItem('is_deriv_banner_dismissed');
        $deriv_banner_countainer = document.getElementById('deriv_banner_container');
        $multiplier_banner_container = document.getElementById('multiplier_banner_container');

        if (!is_deriv_banner_dismissed){
            showBanner();
            $deriv_banner_close_buttons = document.querySelectorAll('.deriv_banner_close');
            $deriv_banner_close_buttons.forEach(element => {
                element.addEventListener('click', onClose);
            });
        }
    };

    const onClose = () => {
        hideBanner();
        localStorage.setItem('is_deriv_banner_dismissed', 1);
    };

    const hideBanner = () =>{
        $deriv_banner_countainer.setVisibility(0);
        $multiplier_banner_container.setVisibility(0);
    };

    const showBanner = () =>{
        if (Math.random() < 0.5){
            $deriv_banner_countainer.setVisibility(1);
        } else {
            $multiplier_banner_container.setVisibility(1);
        }
    };

    const onUnload = () => {
        $deriv_banner_close_buttons.forEach(element => {
            element.removeEventListener('click', onClose);
        });
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = DerivBanner;
