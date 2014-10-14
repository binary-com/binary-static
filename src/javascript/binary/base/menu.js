var Menu = function(url) {
    this.page_url = url;
    var that = this;
    $(this.page_url).on('change', function() { that.activate(); });
};

Menu.prototype = {
    on_unload: function() {
        this.reset();
    },
    activate: function() {
        $('#menu-top li').removeClass('active');
        this.hide_main_menu();

        var active = this.active_menu_top();
        var trading = $('#menu-top li:eq(3)');
        if(active) {
            active.addClass('active');
            if(trading.is(active)) {
                this.show_main_menu();
            }
        } else {
            var is_mojo_page = /\/$|\/login|\/home|\/smart-indices|\/open-source-projects|\/white-labels|\/partnerapi$/.test(window.location.pathname);
            if(!is_mojo_page) {
                trading.addClass('active');
                this.show_main_menu();
            }
        }
    },
    show_main_menu: function() {
        $("#main-menu").removeClass('hidden');
        this.activate_main_menu();
    },
    hide_main_menu: function() {
        $("#main-menu").addClass('hidden');
    },
    activate_main_menu: function() {
        //First unset everything.
        $("#main-menu li.item").removeClass('active');
        $("#main-menu li.item").removeClass('hover');
        $("#main-menu li.sub_item a").removeClass('a-active');

        var active = this.active_main_menu();
        if(active.subitem) {
            active.subitem.addClass('a-active');
        }

        if(active.item) {
            active.item.addClass('active');
            active.item.addClass('hover');
        }

        this.on_mouse_hover(active.item);
    },
    reset: function() {
        $("#main-menu .item").unbind();
        $("#main-menu").unbind();
    },
    on_mouse_hover: function(active_item) {
        $("#main-menu .item").on( 'mouseenter', function() {
            $("#main-menu li.item").removeClass('hover');
            $(this).addClass('hover');
        });

        $("#main-menu").on('mouseleave', function() {
            $("#main-menu li.item").removeClass('hover');
            if(active_item)
                active_item.addClass('hover');
        });
    },
    active_menu_top: function() {
        var active;
        var path = window.location.pathname;
        $('#menu-top li a').each(function() {
            if(path.indexOf(this.pathname) >= 0) {
                active = $(this).closest('li');
            }
        });

        return active;
    },
    active_main_menu: function() {
        var path = window.location.pathname;
        path = path.replace(/\/$/, "");
        path = decodeURIComponent(path);

        var item;
        var subitem;

        var that = this;
        //Is something selected in main items list
        $("#main-menu .items a").each(function () {
            var url = new URL($(this).attr('href'));
            if(url.is_in(that.page_url)) {
                item = $(this).closest('.item');
            }
        });

        $("#main-menu .sub_items a").each(function(){
            var url = new URL($(this).attr('href'));
            if(url.is_in(that.page_url)) {
                item = $(this).closest('.item');
                subitem = $(this);
            }
        });

        return { item: item, subitem: subitem };
    },
    register_dynamic_links: function() {
        var stored_market = page.url.param('market') || LocalStore.get('bet_page.market');
        var start_trading = $('#topMenuStartBetting a:first');
        var trade_url = start_trading.attr("href");
        if(stored_market) {
            if(/market=/.test(trade_url)) {
                trade_url = trade_url.replace(/market=\w+/, 'market=' + stored_market);
            } else {
                trade_url += '&market=' + stored_market;
            }
            start_trading.attr("href", trade_url);

            $('#menu-top li:eq(3) a').attr('href', trade_url);
        }

        start_trading.on('click', function(event) {
            event.preventDefault();
            load_with_pjax(trade_url);
        }).addClass('unbind_later');

        $('#menu-top li:eq(3) a').on('click', function(event) {
            event.preventDefault();
            load_with_pjax(trade_url);
        }).addClass('unbind_later');

    }
};
