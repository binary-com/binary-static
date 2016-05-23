var BetAnalysis = function () {
    var tab_change_registered = false;
    var restored = false;
    return {
        reset: function(){
            restored = false;
            this.tab_live_chart.reset();
        },
        register_actions: function () {
            var that = this;
            if(tab_change_registered) {
                return;
            }

            tab_change_registered = true;
            MenuContent.listen_click(function (tab) {
                if (tab.menu.attr('id') == 'betsBottomPage') {
                    that.save(tab);

                    var id = tab.id;
                    var shown_some_tab = false;
                    if (id == 'tab_explanation') {
                        that.tab_explanation.render(tab);
                        shown_some_tab = true;
                    } else if(id == 'tab_last_digit') {
                        Symbols.getSymbols();
                        shown_some_tab = true;
                    } else if(id == 'tab_graph') {
                        that.tab_live_chart.render();
                        shown_some_tab = true;
                    }

                    if(!shown_some_tab) {
                        that.tab_live_chart.render();
                    }
                }

                return;
            });
        },
        save: function (tab) {
            SessionStore.set('bet_page.selected_analysis_tab', tab.id);
        },
        restore: function () {
            if(restored) {
                return;
            }
            this.show_tab(SessionStore.get('bet_page.selected_analysis_tab'));
            restored = true;
        },
        show_tab: function(tab) {
            if(!tab || !$('#' . tab)) {
                tab = 'tab_graph';
            }

            if(!this.is_showing_tab(tab)) {
                MenuContent.trigger({
                    'tab_id': tab
                });
            }
        },
        is_showing_tab: function(tab) {
            return MenuContent.is_tab_selected($('#' + tab));
        },
        was_showing_tab: function(tab) {
            return (SessionStore.get('bet_page.selected_analysis_tab') == tab);
        },
        bet_type_changed: function(bet_type) {
            var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');
            if (this.is_showing_tab('tab_explanation')) {
                MenuContent.trigger({
                    'tab_id': saved_anaysis_tab
                });
            }
        },
        underlying_changed: function() {
            var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');

            if (this.is_showing_tab('tab_graph')) {
                MenuContent.trigger({
                    'tab_id': saved_anaysis_tab
                });
            }
        },
        duration_changed: function() {
            var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');

            if (this.is_showing_tab('tab_graph')) {
                MenuContent.trigger({
                    'tab_id': saved_anaysis_tab
                });
            }
        },
        get_price_data: function (form, div, id) {
            var that = this;
            var daily_prices_url = changeUrlToSameDomain(form.action);
            var daily_prices_params = $(form).serialize()+'&id='+Math.floor(Math.random()*83720);

            var go_button = div.find('span.button');
            go_button.addClass('invisible');
            go_button.after(getImageLink());

            $.ajax(ajax_loggedin({
                url     : daily_prices_url,
                async   : true,
                data    : daily_prices_params,
                success : function (texts) {
                    div.html(texts);
                    that.set_submit_event(id);
                },
            }));
        },
        set_submit_event: function(id) {
           var that = this;
           var div = $('#' + id + '-content');
           var submit_button = div.find('button[type=submit]');
           $(submit_button.closest('form')[0]).on('submit', function (e) {
                e.preventDefault();
                return false;
           });
           submit_button.on('click', function () {
               that.get_price_data($(this).closest('form')[0], div, id);
           });
        },
        tab_explanation: function() {
            return {
                render: function(tab) {
                    var that = this;
                    showLoadingImage(tab.content);
                    $.get(that.url(), function (texts) {
                        tab.content.html(texts);
                    });
                },
                url: function() {
                    var existing_link = $('#tab_explanation').find('a');
                    var url = existing_link.attr('href').replace(/form_name=\w+/,'form_name='+ BetForm.attributes.bet_type());
                    existing_link.attr('href', url);
                    return url;
                }
            };
        }(),
    };
}();
