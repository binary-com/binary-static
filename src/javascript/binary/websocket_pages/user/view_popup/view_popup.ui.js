const BinarySocket     = require('../../socket');
const getHighestZIndex = require('../../../base/utility').getHighestZIndex;

const ViewPopupUI = (() => {
    'use strict';

    let $container,
        stream_ids,
        chart_stream_ids,
        getPageTickStream;

    const init = () => {
        $container = null;
    };

    const container = (refresh) => {
        if (refresh) {
            if ($container) {
                $container.remove();
            }
            $container = null;
        }
        if (!$container) {
            const $con = $('<div class="inpage_popup_container" id="sell_popup_container"><a class="close"></a><div class="inpage_popup_content"></div></div>');
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
        init();
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
            $container.hide().remove();
            $('.popup_page_overlay').hide().remove();
            $container = null;
        }
        $('html').removeClass('no-scroll');
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

    // this code show the popup
    const showInpagePopup = (data, containerClass, dragHandle) => {
        const con = container(true);
        if (containerClass) {
            con.addClass(containerClass);
        }
        if (data) {
            $('.inpage_popup_content', con).html(data);
        }
        const body = $(document.body);
        con.css('position', 'fixed').css('z-index', getHighestZIndex() + 100);
        body.append(con);
        con.show();
        // $('html').addClass('no-scroll');
        $(document.body).append($('<div/>', { class: 'popup_page_overlay' }));
        $('.popup_page_overlay').click(() => { container().find('a.close').click(); });
        con.draggable({
            stop: () => {
                repositionConfirmationOnDrag();
            },
            handle: dragHandle,
            scroll: false,
        });
        $(dragHandle).disableSelection();
        repositionConfirmation();
        $(window).resize(() => { repositionConfirmation(); });
        return con;
    };

    const repositionConfirmationOnDrag = () => {
        const con = container();
        const offset = con.offset();
        const win_ = $(window);
        // top
        if (offset.top < win_.scrollTop()) { con.offset({ top: win_.scrollTop() }); }
        // left
        if (offset.left < 0) { con.offset({ left: 0 }); }
        // right
        if (offset.left > win_.width() - con.width()) { con.offset({ left: win_.width() - con.width() }); }
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
            x = Math
                .max(Math.floor((win_.width() - win_.scrollLeft() - con.width()) / 2), x_min) + win_.scrollLeft();
        }
        if (y === undefined) {
            y = Math.min(Math.floor((win_.height() - con.height()) / 2), y_min) + win_.scrollTop();
            if (y < win_.scrollTop()) { y = win_.scrollTop(); }
        }
        con.offset({ left: x, top: y });
        repositionConfirmationOnDrag();
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
        showInpagePopup       : showInpagePopup,
        repositionConfirmation: repositionConfirmation,
        storeSubscriptionID   : storeSubscriptionID,
        setStreamFunction     : (streamFnc) => { getPageTickStream = streamFnc; },
    };
})();

module.exports = ViewPopupUI;
