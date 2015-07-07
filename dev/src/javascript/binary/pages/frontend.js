var slider = function() {
    var slider = $('#slider');
    if (slider.size()) {
        $('.invisibleslides').show();
        slider.slides({
            container: 'slides-container',
            paginationClass: 'slides-pagination',
            generatePagination: false,
            generateNextPrev: false,
            start: 1,
            preload: true,
            play: 10000,
            slideSpeed: 800,
        });
        if ($('.slides_control').height() < 300) {
            $('.slides_control').css('min-height', '300px');
        }
    }
};


var sidebar_scroll = function(elm_selector) {
    elm_selector.on('click', '#sidebar-nav li', function() {
        var clicked_li = $(this);
        $.scrollTo($('.section:eq(' + clicked_li.index() + ')'), 500);
        return false;
    }).addClass('unbind_later');

    if (elm_selector.size()) {
        // grab the initial top offset of the navigation
        var selector = elm_selector.find('.sidebar');
        var width = selector.width();
        var sticky_navigation_offset_top = selector.offset().top;
        // With thanks:
        // http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery

        // our function that decides weather the navigation bar should have "fixed" css position or not.
        var sticky_navigation = function() {
            var scroll_top = $(window).scrollTop(); // our current vertical position from the top

            // if we've scrolled more than the navigation, change its position to fixed to stick to top,
            // otherwise change it back to relative
            if (scroll_top > sticky_navigation_offset_top) {
                selector.css({'position': 'fixed', 'top': 0, 'width': width});
            } else {
                selector.css({'position': 'relative'});
            }
        };

        //run our function on load
        sticky_navigation();

        var sidebar_nav = selector.find('#sidebar-nav');
        var length = elm_selector.find('.section').length;
        $(window).on('scroll', function() {
            // and run it again every time you scroll
            sticky_navigation();

            for (var i = 0; i < length; i++) {
                if ($(window).scrollTop() === 0 || $(this).scrollTop() >= $('.section:eq(' + i + ')').offset().top - 5) {
                    sidebar_nav.find('li').removeClass('selected');

                    if ($(window).scrollTop() === 0) {
                        // We're at the top of the screen, so highlight first nav item
                        sidebar_nav.find('li:first-child').addClass('selected');
                    } else if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                        // We're at bottom of screen so highlight last nav item.
                        sidebar_nav.find('li:last-child').addClass('selected');
                    } else {
                        sidebar_nav.find('li:eq(' + i + ')').addClass('selected');
                    }
                }
            }
        });
    }
};

var get_started_behaviour = function() {
    // Get Started behaviour:
    var update_active_subsection = function(to_show) {
        var fragment;
        var subsection = $('.subsection');
        subsection.addClass('hidden');
        to_show.removeClass('hidden');
        var nav_back = $('.subsection-navigation .back');
        var nav_next = $('.subsection-navigation .next');

        if (to_show.hasClass('first')) {
            nav_back.addClass('disabled');
            nav_next.removeClass('disabled');
        } else if (to_show.hasClass('last')) {
            nav_back.removeClass('disabled');
            nav_next.addClass('disabled');
        } else {
            nav_back.removeClass('disabled');
            nav_next.removeClass('disabled');
        }

        fragment = to_show.find('a[name]').attr('name').slice(0, -8);
        document.location.hash = fragment;

        return false;
    };
    var to_show;
    var nav = $('.get-started').find('.subsection-navigation');
    var fragment;
    var len = nav.length;

    if (len) {
        nav.on('click', 'a', function() {
            var button = $(this);
            if (button.hasClass('disabled')) {
                return false;
            }
            var now_showing = $('.subsection:not(.hidden)');
            var show = button.hasClass('next') ? now_showing.next('.subsection') : now_showing.prev('.subsection');
            return update_active_subsection(show);
        });

        fragment = (location.href.split('#'))[1];
        to_show = fragment ? $('a[name=' + fragment + '-section]').parent('.subsection') : $('.subsection.first');
        update_active_subsection(to_show);
    }

    var random_market = $('.random-markets');
    if (random_market.length > 0) {
        sidebar_scroll(random_market);
    }
};


var get_ticker = function() {
    var ticker = $('#hometicker');
    if (ticker.size()) {
        $.ajax({ crossDomain: true, url: page.url.url_for('ticker'), async: true, dataType: "html" }).done(function(ticks) {
            ticker.html(ticks);
            ticker.find('ul').simplyScroll();
        });
    }
};


var select_user_country = function() {
    if($('#residence').length > 0) {
        get_user_country(function() {
            var restricted_countries = new RegExp(page.settings.get('restricted_countries'));
            if(restricted_countries.test(this.country)) {
                $('#residence').val('default').change();
            } else {
                $('#residence').val(this.country).change();
            }
        });
    }
};

var Charts = function(charts) {
    window.open(charts, 'DetWin', 'width=580,height=710,scrollbars=yes,location=no,status=no,menubar=no');
};

var home_bomoverlay = {
    url : {
	    param : {
            get : function(name) {
                name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
                var regexS = "[\\?&]"+name+"=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.href);
                return (results === null)? null:results[1];
            }
        }
    },

    init : function() {
        if (! this.url.param.get('frombom')) return;
        var obj = document.getElementById('banner').getElementsByClassName('wrapper')[0];
        var div = document.createElement('div');
        div.className = 'bomoverlay';
        obj.appendChild(div);
        div.addEventListener('click', function() { this.parentNode.removeChild(this); });
    }
};

var get_random_download_symbols = function () {
    var indices = $('#random_download_indices');
    if (indices.size()) {
        $.ajax({
            crossDomain:true,
            type: 'POST',
            url: '//archive.binary.com/d/tick-data-downloads.cgi',
            data: {action: 'get_symbols'},
            async: true,
            dataType: "json"
        })
        .done(function (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    indices.append($('<option>', {
                        value: data[key].value,
                        text: data[key].label,
                    }));
                }
            }
        });
    }
};

var random_symbol_change = function () {
    $('#section-5').on('change', '#random_download_indices', function () {
        var that = this;
        var week_select = $('#random_download_week');
        if($(that).val() != 'default') {
            $.ajax({
                crossDomain:true,
                type: 'POST',
                url: '//archive.binary.com/d/tick-data-downloads.cgi',
                data: {action: 'get_json', underlying: $(that).val()},
                async: true,
                dataType: "json"
            })
            .done(function (data) {
                week_select.empty();
                week_select.show();
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var timeepoch = parseInt(data[key].timestamp) * 1000;
                        week_select.append($('<option>', {
                            value: data[key].timestamp,
                            text: text.localize('Week of') + ' ' + moment(new Date(timeepoch)).format('YYYY-MM-DD HH:mm'),
                            link: data[key].link,
                        }));
                    }
                }
                $('#download_random_data').show();
            });
        } else {
            week_select.empty();
            week_select.hide();
            $('#download_random_data').hide();
        }
    });
};

var random_download_data = function () {
    $('#section-5').on('click', '#download_random_data', function () {
        var href = $('#random_download_week').find(':selected').attr('link');
        if(typeof href != 'undefined') {
            $(this).attr('href', href);
        }
    });
};

pjax_config_page('/$|/home', function() {
    return {
        onLoad: function() {
            slider();
            select_user_country();
            get_ticker();
            home_bomoverlay.init();
        }
    };
});

pjax_config_page('/why-us', function() {
    return {
        onLoad: function() {
            var whyus = $('.why-us');
            sidebar_scroll(whyus);
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/smart-indices', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.smart-indices'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/open-source-projects', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.open-source-projects'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/white-labels', function() {
    return {
        onLoad: function() {
            sidebar_scroll($('.white-labels'));
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/partnerapi', function() {
    return {
        onLoad: function() {
            var partnerapi = $('.partnerapi-content');
            sidebar_scroll(partnerapi);
        },
        onUnload: function() {
            $(window).off('scroll');
        }
    };
});

pjax_config_page('/get-started', function() {
    return {
        onLoad: function() {
            get_started_behaviour();
        },
        onUnload: function() {
            $(window).off('scroll');
        },
    };
});

pjax_config_page('/random-markets', function() {
    return {
        onLoad: function() {
            get_random_download_symbols();
            random_symbol_change();
            random_download_data();
        },
    };
});
