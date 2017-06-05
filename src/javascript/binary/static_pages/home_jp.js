const Home = require('./home');

const HomeJP = (() => {
    'use strict';

    const visible_product = 'product_visible';
    const product_prefix = 'product_';

    let margin,
        $go_right,
        $go_left,
        number_of_products,
        $first_product,
        slide_timeout;

    const onLoad = () => {
        Home.onLoad();

        $('#start_now').click(() => {
            $.scrollTo($('#frm_verify_email'), 500, { offset: -10 });
        });

        margin = 0;
        $go_right = $('.go-right');
        $go_left = $('.go-left');
        number_of_products = $('.product').length;
        $first_product = $('.product:eq(0)');

        $go_right.on('click', function() {
            slide(this, 'right');
        });
        $go_left.on('click', function() {
            slide(this, 'left');
        });

        $('#product_wrapper')
            .on('mouseenter', () => {
                clearTimeout(slide_timeout);
            })
            .on('mouseleave', () => {
                setTimeoutOnSlide();
            });

        setTimeoutOnSlide();
    };

    const setTimeoutOnSlide = () => {
        clearTimeout(slide_timeout);
        slide_timeout = setTimeout(() => {
            slide(this, 'right');
            setTimeoutOnSlide();
        }, 10000);
    };

    const slide = (element, direction) => {
        if ($(element).hasClass('disabled')) {
            return;
        }
        const window_width = $(window).width();
        const width = window_width <= 959 ? (window_width <= 480 ? 203 : 603) : 800;

        // get current visible element
        const id_no_current = Number($('.product_visible').attr('id').split(product_prefix)[1]);
        let id_no_to_show = direction === 'right' ? id_no_current + 1 : id_no_current - 1;

        if (id_no_to_show > number_of_products) {
            id_no_to_show = 1;
            margin = 0;
        } else {
            margin += (width * (direction === 'right' ? -1 : 1));
        }

        changeProductVisibility(id_no_current, id_no_to_show);
        hideShowIcons(id_no_to_show);
        $first_product.animate({ 'margin-left': `${margin}px` }, 500);
    };

    const changeProductVisibility = (element, element_to_show) => {
        $(`#${product_prefix}${element}`).removeClass(visible_product);
        $(`#${product_prefix}${element_to_show}`).addClass(visible_product);
    };

    const hideShowIcons = (id_no_to_show) => {
        changeIconVisibility($go_left, id_no_to_show === 1);
        changeIconVisibility($go_right, id_no_to_show === number_of_products);
    };

    const changeIconVisibility = ($element, should_disable) => {
        const src = $element.attr('src');
        const replacement = ['enabled', 'disabled'];
        $element[`${should_disable ? 'add' : 'remove'}Class`]('disabled').attr('src',  src.replace(replacement[+!should_disable], replacement[+should_disable]));
    };

    const onUnload = () => {
        clearTimeout(slide_timeout);
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = HomeJP;
