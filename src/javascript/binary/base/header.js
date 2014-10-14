var Header = function(params) {
    this.client = params['client'];
    this.settings = params['settings'];
    this.menu = new Menu(params['url']);
    this.clock_started = false;
};

Header.prototype = {
    on_load: function() {
        this.show_or_hide_login_form();
        this.register_dynamic_links();
        if (!this.clock_started) this.start_clock();
        this.simulate_input_placeholder_for_ie();
    },
    on_unload: function() {
        this.menu.reset();
    },
    show_or_hide_login_form: function() {
        if (this.client.is_logged_in) {
            $("#client_loginid").html(this.client.loginid);
        }
    },
    simulate_input_placeholder_for_ie: function() {
        var test = document.createElement('input');
        if ('placeholder' in test)
            return;
        $('input[placeholder]').each(function() {
            var input = $(this);
            $(input).val(input.attr('placeholder'));
            $(input).focus(function() {
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
            $(input).blur(function() {
                if (input.val() === '' || input.val() == input.attr('placeholder')) {
                    input.val(input.attr('placeholder'));
                }
            });
        });
    },
    register_dynamic_links: function() {
        var logged_in_url = page.url.url_for('');
        if(this.client.is_logged_in) {
            logged_in_url = page.url.url_for('my_account.cgi');
        }

        $('#logo').attr('href', logged_in_url).on('click', function(event) {
            event.preventDefault();
            load_with_pjax(logged_in_url);
        }).addClass('unbind_later');

        this.menu.register_dynamic_links();
    },
    start_clock: function() {
        var clock = $('#gmt-clock');
        if (clock.length === 0) {
            return;
        }

        var that = this;
        var clock_handle;
        var sync = function() {
            var query_start_time = (new Date().getTime());
            $.ajax({crossDomain: true, url: page.url.url_for('timestamp'), async: true, dataType: "json"}).done(function(response) {
                var start_timestamp = response.timestamp;

                //time now is timestamp from server + ping time.
                //ping time = roundtrip time / 2
                //roundtrip time = time at start of request - time after response.
                that.time_now = (start_timestamp * 1000) + (((new Date().getTime()) - query_start_time)/2);
                var increase_time_by = function(interval) {
                    that.time_now += interval;
                };

                var update_time = function() {
                    clock.html(moment(that.time_now).utc().format("YYYY-MM-DD HH:mm") + " GMT");
                };

                update_time();

                clearInterval(clock_handle);

                clock_handle = setInterval(function() {
                    increase_time_by(1000);
                    update_time();
                }, 1000);
            });
        };

        sync();
        setInterval(function() {
            sync();
        }, 300000);

        this.clock_started = true;
        return;
    },
};
