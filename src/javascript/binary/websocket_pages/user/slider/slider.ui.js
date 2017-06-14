const BinarySocket     = require('../../socket');
const getHighestZIndex = require('../../../base/utility').getHighestZIndex;

const SliderUI = (() => {
    'use strict';

    let $container,
        stream_ids,
        chart_stream_ids,
        getPageTickStream,
        opened,
        movingOut;

    const init = () => {
        $container = null;
        opened = false;
        movingOut = false;
    };

    const container = (refresh) => {
        if (refresh) {
            if ($container) {
                $container.remove();
            }
            $container = null;
        }
        if (!$container) {
            const $con = $('<div class="inpage_slider_container" id="sell_slider_container"><a class="close"></a><div class="inpage_slider_content"></div></div>');
            $con.hide();
            const onClose = () => {
                cleanup();
                $(document).off('keydown');
                $(window).off('popstate', onClose);
            };
            $con.find('a.close').on('click', onClose);
            $(document).on('keydown', (e) => {
                if (e.which === 27) onClose();
            });
            $(window).on('popstate', onClose);
            $container = $con;
        }
        return $container;
    };

    const cleanup = () => {
        forgetStreams();
        forgetChartStreams();
        clearTimer();
        closeContainer();
        if (typeof getPageTickStream === 'function') getPageTickStream();
        $(window).off('resize', () => { repositionConfirmation(); });
    };

    const forgetStreams = () => {
        while (stream_ids && stream_ids.length > 0) {
            const id = stream_ids.pop();
            if (id && id.length > 0) {
                BinarySocket.send({ forget: id });
            }
        }
    };

    const forgetChartStreams = () => {
        while (chart_stream_ids && chart_stream_ids.length > 0) {
            const id = chart_stream_ids.pop();
            if (id && id.length > 0) {
                BinarySocket.send({ forget: id });
            }
        }
    };

    const clearTimer = () => {
        if (window.ViewPopupTimerInterval) {
            clearInterval(window.ViewPopupTimerInterval);
            window.ViewPopupTimerInterval = undefined;
        }
    };

    const closeContainer = () => {
        if ($container) {
            console.log($(window).width() + $container.width());
            if ($(window).width() >= 767) {
                $container.animate({
                    left: ($(window).width() + $container.width()),
                }, 'fast', function() {
                    $container.hide().remove();
                    init();
                });
            } else {
                $container.hide().remove();
                init();
            }
        }
        $('html').removeClass('no-scroll');
        $('.selectedRow').removeClass('selectedRow');
    };

    const disableButton = (button) => {
        $('.open_contract_details[disabled]').each(function() {
            enableButton($(this));
        });
        button.attr('disabled', 'disabled');
        button.fadeTo(0, 0.5);
    };

    const enableButton = (button) => {
        button.removeAttr('disabled');
        button.fadeTo(0, 1);
    };

    const showInpageSlider = (data, containerClass) => {
        const con = container(true);
        if (containerClass) {
            con.addClass(containerClass);
        }
        if (data) {
            $('.inpage_slider_content', con).html(data);
        }
        const body = $(document.body);
        con.css('position', 'fixed').css('z-index', getHighestZIndex() + 100);
        body.append(con);
        con.show();
        $(window).resize(() => { repositionConfirmation(); });
        return con;
    };

    const repositionConfirmation = (x, y) => {
        const con = container();
        const win_ = $(window);
        let x_min = 0,
            y_min = 500;
        if (win_.width() < 767) { // To be responsive, on mobiles and phablets we show popup as full screen.
            x_min = 0;
            y_min = 0;
        }
        if (x === undefined) {
            if (win_.width() < 767) {
                x = x_min;
            } else if (win_.width() >= 767 && !opened && !movingOut) {
                x = win_.width();
            } else if (win_.width() >= 767 && opened) {
                x = win_.width() - con.width();
            }
        }
        if (y === undefined) {
            y = Math.min(Math.floor((win_.height() - con.height()) / 2), y_min) + win_.scrollTop();
            if (y < win_.scrollTop()) { y = win_.scrollTop(); }
        }
        con.offset({ left: x, top: y });
        if (!movingOut && !opened && win_.width() >= 767) {
            opened = true;
            movingOut = true;
            con.animate({
                left: win_.width() - con.width(),
            }, 'fast', function() {
                movingOut = false;
            });
        }
    };

    // ===== Dispatch =====
    const storeSubscriptionID = (id, is_chart) => {
        if (!stream_ids && !is_chart) {
            stream_ids = [];
        }
        if (!chart_stream_ids) {
            chart_stream_ids = [];
        }
        if (id && id.length > 0) {
            if (!is_chart && $.inArray(id, stream_ids) < 0) {
                stream_ids.push(id);
            } else if (is_chart && $.inArray(id, chart_stream_ids) < 0) {
                chart_stream_ids.push(id);
            }
        }
    };

    return {
        cleanup               : cleanup,
        forgetStreams         : forgetStreams,
        disableButton         : disableButton,
        enableButton          : enableButton,
        showInpageSlider      : showInpageSlider,
        repositionConfirmation: repositionConfirmation,
        storeSubscriptionID   : storeSubscriptionID,
        setStreamFunction     : (streamFnc) => { getPageTickStream = streamFnc; },
    };
})();

module.exports = SliderUI;
