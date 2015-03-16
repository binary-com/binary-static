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
                    } else if(id == 'tab_ohlc' && BetForm.attributes.show_ohlc()) {
                        that.tab_ohlc.render(tab);
                        shown_some_tab = true;
                    } else if(id == 'tab_intradayprices') {
                        that.tab_intradayprices.render(tab);
                        shown_some_tab = true;
                    } else if(id == 'tab_last_digit') {
                        that.tab_last_digit.render(tab);
                        shown_some_tab = true;
                    } else if(id == 'tab_graph') {
                        that.tab_live_chart.render();
                        shown_some_tab = true;
                    } else if(id == 'tab_pricing_table') {
                        that.tab_pricing_table.render(tab);
                        shown_some_tab = true;
                    }

                    if(!shown_some_tab) {
                        that.tab_explanation.render(tab);
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
                tab = 'tab_explanation';
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

            if (this.is_showing_tab('tab_graph') || this.is_showing_tab('tab_pricing_table')) {
                MenuContent.trigger({
                    'tab_id': saved_anaysis_tab
                });
            }
        },
        duration_changed: function() {
            var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');

            if (this.is_showing_tab('tab_graph') || this.is_showing_tab('tab_pricing_table')) {
                MenuContent.trigger({
                    'tab_id': saved_anaysis_tab
                });
            }
        },
        get_price_data: function (form, div, id) {
            var that = this;
            var daily_prices_url = changeUrlToSameDomain(form.action);
            var daily_prices_params = $(form).serialize()+'&id='+Math.floor(Math.random()*83720);

            var go_button = div.find('.button');
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
        tab_ohlc: function() {
            return {
                render: function(tab) {
                    showLoadingImage(tab.content);
                    $.get(this.url(tab), function (texts) {
                        tab.content.html(texts);
                    }).done(function (data) {
                        BetAnalysis.set_submit_event(tab.id);
                    });
                },
                url: function(tab) {
                    return tab.target.attr('href').replace(/&underlying_symbol=\w+/,'&underlying_symbol=' + BetForm.attributes.underlying());
                },
                show_tab: function() {
                    var tab_ohlc = $('#tab_ohlc');
                    MenuContent.show_tab(tab_ohlc);
                    var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');
                    if(saved_anaysis_tab == 'tab_ohlc') {
                        MenuContent.trigger({
                            'tab_id': saved_anaysis_tab
                        });
                    }
                },
                hide_tab: function() {
                    var tab_ohlc = $('#tab_ohlc');
                    MenuContent.hide_tab(tab_ohlc);
                }
            };
        }(),
        tab_intradayprices: function() {
            return {
                render: function(tab) {
                    showLoadingImage(tab.content);
                    $.get(this.url(tab), function (texts) {
                        tab.content.html(texts);
                    }).done(function (data) {
                        BetAnalysis.set_submit_event(tab.id);
                    });
                },
                url: function(tab) {
                    return tab.target.attr('href').replace(/underlying=\w+/,'underlying=' + BetForm.attributes.underlying());
                },
                show_tab: function() {
                    var tab_intradayprices = $('#tab_intradayprices');
                    MenuContent.show_tab(tab_intradayprices);
                    var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');
                    if(saved_anaysis_tab == 'tab_intradayprices') {
                        MenuContent.trigger({
                            'tab_id': saved_anaysis_tab
                        });
                    }
                },
                hide_tab: function() {
                    var tab_intradayprices = $('#tab_intradayprices');
                    MenuContent.hide_tab(tab_intradayprices);
                },
            };
        }(),
        tab_pricing_table: function() {
            return {
                render: function(tab) {
                    showLoadingImage(tab.content);
                    var expiry_type = BetForm.attributes.expiry_type();

                    formData = {
                        underlying_symbol: BetForm.attributes.underlying(),
                        H: BetForm.attributes.barrier_1(),
                        L: BetForm.attributes.barrier_2(),
                        barrier_type: BetForm.attributes.barrier_type(),
                        currency: BetForm.attributes.currency(),
                        amount_type:  'payout',
                        amount: 100,
                        form_name: BetForm.attributes.bet_type(),
                        expiry_type: expiry_type,
                    };
                    if (expiry_type === 'duration') {
                        formData['duration_amount'] = BetForm.attributes.duration_amount();
                        formData['duration_units'] = BetForm.attributes.duration_units();
                    } else {
                        formData['expiry_date'] = BetForm.attributes.expiry_date();
                        formData['expiry_time'] = BetForm.attributes.expiry_time();
                    }
                    $.ajax({
                        type: 'POST',
                        url: this.url(tab),
                        data: formData,
                        success: function(prices) {
                            tab.content.html(prices);
                            attach_tabs('#pricing_table_tabs');
                        },
                        error: function(xhr, status) {
                            tab.content.html(status);
                        }
                    });
                },
                url: function(tab) {
                    return tab.target.attr('href');
                },
                show_tab: function() {
                    var tab_pricing_table = $('#tab_pricing_table');
                    MenuContent.show_tab(tab_pricing_table);
                    var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');
                    if(saved_anaysis_tab == 'tab_pricing_table') {
                        MenuContent.trigger({
                            'tab_id': saved_anaysis_tab
                        });
                    }
                },
                hide_tab: function() {
                    var tab_pricing_table = $('#tab_pricing_table');
                    MenuContent.hide_tab(tab_pricing_table);
                },
            };
        }(),
    };
}();
