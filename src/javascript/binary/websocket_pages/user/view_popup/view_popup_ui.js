const getHighestZIndex = require('../../../base/utility').getHighestZIndex;

const ViewPopupUI = (function() {
    return {
        _init: function() {
            this._container = null;
        },
        container: function(refresh) {
            if (refresh) {
                if (this._container) {
                    this._container.remove();
                }
                this._container = null;
            }
            if (!this._container) {
                const that = this;
                const con = $('<div class="inpage_popup_container inpage_popup_container_ws" id="sell_popup_container"><a class="close"></a><div class="inpage_popup_content"></div></div>');
                con.hide();
                const _on_close = function() {
                    that.cleanup(true);
                    if (/trading/.test(window.location.pathname)) {
                        // Re-subscribe the trading page's tick stream which was unsubscribed by popup's chart
                        BinarySocket.send({ ticks_history: $('#underlying').val(), style: 'ticks', end: 'latest', count: 20, subscribe: 1 });
                    }
                };
                con.find('a.close').on('click', function() { _on_close(); });
                $(document).on('keydown', function(e) {
                    if (e.which === 27) _on_close();
                });
                this._container = con;
            }
            return this._container;
        },
        cleanup: function() {
            this.forget_streams();
            this.forget_chart_streams();
            this.clear_timer();
            this.close_container();
            this._init();
            $(window).off('resize', function() { ViewPopupUI.reposition_confirmation(); });
        },
        forget_streams: function() {
            while (window.stream_ids && window.stream_ids.length > 0) {
                const id = window.stream_ids.pop();
                if (id && id.length > 0) {
                    BinarySocket.send({ forget: id });
                }
            }
        },
        forget_chart_streams: function() {
            while (window.chart_stream_ids && window.chart_stream_ids.length > 0) {
                const id = window.chart_stream_ids.pop();
                if (id && id.length > 0) {
                    BinarySocket.send({ forget: id });
                }
            }
        },
        clear_timer: function() {
            if (window.ViewPopupTimerInterval) {
                clearInterval(window.ViewPopupTimerInterval);
                window.ViewPopupTimerInterval = undefined;
            }
        },
        close_container: function() {
            if (this._container) {
                this._container.hide().remove();
                $('.popup_page_overlay').hide().remove();
                this._container = null;
            }
            $('html').removeClass('no-scroll');
        },
        disable_button: function(button) {
            $('.open_contract_detailsws[disabled]').each(function() {
                ViewPopupUI.enable_button($(this));
            });
            button.attr('disabled', 'disabled');
            button.fadeTo(0, 0.5);
        },
        enable_button: function(button) {
            button.removeAttr('disabled');
            button.fadeTo(0, 1);
        },
        show_inpage_popup: function(data, containerClass, dragHandle) {
            const that = this;
            const con = this.container(true);
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
            $('.popup_page_overlay').click(function() { ViewPopupUI.container().find('a.close').click(); });
            con.draggable({
                stop: function() {
                    that.reposition_confirmation_ondrag();
                },
                handle: dragHandle,
                scroll: false,
            });
            $(dragHandle).disableSelection();
            this.reposition_confirmation();
            $(window).resize(function() { ViewPopupUI.reposition_confirmation(); });
            return con;
        },
        reposition_confirmation_ondrag: function() {
            const con = this.container();
            const offset = con.offset();
            const win_ = $(window);
            // top
            if (offset.top < win_.scrollTop()) { con.offset({ top: win_.scrollTop() }); }
            // left
            if (offset.left < 0) { con.offset({ left: 0 }); }
            // right
            if (offset.left > win_.width() - con.width()) { con.offset({ left: win_.width() - con.width() }); }
        },
        reposition_confirmation: function(x, y) {
            const con = this.container(),
                win_ = $(window);
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
            ViewPopupUI.reposition_confirmation_ondrag();
        },
        // ===== Dispatch =====
        storeSubscriptionID: function(id, option) {
            if (!window.stream_ids && !option) {
                window.stream_ids = [];
            }
            if (!window.chart_stream_ids && option) {
                window.chart_stream_ids = [];
            }
            if (!option && id && id.length > 0 && $.inArray(id, window.stream_ids) < 0) {
                window.stream_ids.push(id);
            } else if (option && id && id.length > 0 && $.inArray(id, window.chart_stream_ids) < 0) {
                window.chart_stream_ids.push(id);
            }
        },
    };
})();

module.exports = {
    ViewPopupUI: ViewPopupUI,
};
