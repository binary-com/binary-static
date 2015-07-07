BetForm.attributes = function() {
    var selected_settings = {};
    return {
            form: function() {
                return $('form[name=form0]');
            },
            expiry_type: function() {
                return $('[name=expiry_type]', this.form_selector()).val();
            },
            expiry_time: function() {
                return $('[name=expiry_time]', this.form_selector()).val();
            },
            expiry_date: function() {
                return $('[name=expiry_date]', this.form_selector()).val();
            },
            no_bets: function() {
                return ($('#no_bets').length > 0);
            },
            form_selector: function() {
                return $('form[name=form0]').get(0);
            },
            form_name: function() {
                return $('[name=form_name]', this.form_selector()).val();
            },
            bet_type: function() {
                return LocalStore.get('bet_page.form_name');
            },
            prediction: function() {
                return $('[name=prediction]', this.form_selector()).val();
            },
            market: function() {
                return $('[name=market]', this.form_selector()).val();
            },
            submarket: function() {
                return $('[name=submarket]', this.form_selector()).val();
            },
            underlying: function() {
                return $('#bet_underlying', this.form_selector()).val();
            },
            underlying_text: function() {
                return $('#bet_underlying option:selected', this.form_selector()).text();
            },
            spot: function() {
                return $('[name=S]', this.form_selector()).val();
            },
            start_time: function() {
                return $('[name=date_start]', this.form_selector()).val();
            },
            start_time_moment: function() {
                var start_time = this.start_time();
                var now = moment.utc(BetForm.bom_gmt_time());
                if (typeof start_time !== 'undefined' && start_time !== 'now') {
                    now = moment.utc(start_time*1000);
                }

                return now;
            },
            barrier_1: function() {
                return $('#bet_H', this.form_selector()).val();
            },
            barrier_2: function() {
                return $('#bet_L', this.form_selector()).val();
            },
            pip_size: function() {
                return $('[name=pip_size]', this.form_selector()).val();
            },
            barrier_type: function() {
                var barriers = $('[name=H]', this.form_selector()).length + $('[name=L]', this.form_selector()).length;
                if(barriers > 0) {
                    return $('[name=barrier_type]', this.form_selector()).val();
                }
                return;
            },
            duration_container: function() {
                return $('#duration_container', this.form_selector());
            },
            duration_amount: function() {
                return $('#duration_amount', this.form_selector()).val();
            },
            duration_units: function() {
                return $('[name=duration_units]', this.form_selector()).val();
            },
            duration_seconds: function() {
                var duration = parseInt(parseFloat(this.duration_amount()));
                var duration_units = this.duration_units();

                if(duration_units == 'm') {
                    return duration * 60;
                } else if(duration_units == 'h') {
                    return duration * 3600;
                } else if(duration_units == 'd') {
                    return duration * 86400;
                }

                return duration;
            },
            duration_string: function() {
                return this.duration_amount() + this.duration_units();
            },
            minimum_duration_for: function(unit) {
                var duration_container = this.duration_container();
                var minimums = duration_container.find('.' + unit);
                if(minimums.html()) {
                    return parseInt(parseFloat(minimums.html().split(':')[1]));
                }

                return;
            },
            currency: function() {
                return $('[name=currency]', this.form_selector()).val();
            },
            amount: function() {
                var amount_str =  $('#amount', BetForm.attributes.form_selector()).val();
                if(amount_str) {
                    amount_str = amount_str.replace(',', '.');
                    amount_str = amount_str.replace(/[^\d\.]/g, '');
                }
                var amount_f = parseFloat(amount_str);
                var amount = 0;
                if (!isNaN(amount_f) && amount_f > 0) {
                    // only keep the first 2 digits of the floating value, and only 2
                    amount_f = Math.round(amount_f * 100) / 100;
                    var amount_int = Math.floor(amount_f);
                    var float_val = amount_f - amount_int;
                    if (float_val) {
                        amount = amount_f.toFixed(2);
                    } else {
                        amount = amount_int;
                    }
                }
                return amount;
            },
            is_amount_payout: function() {
                return ($('#amount_type').val() == "payout");
            },
            is_amount_stake: function() {
                return ($('#amount_type').val() == "stake");
            },
            amount_type: function() {
                return $('#amount_type', this.form_selector()).val();
            },
            show_ohlc: function() {
                return ($('input[name="showohlc"]', this.form_selector()).val() == "yes");
            },
            extratab: function() {
                return ($('input[name="extratab"]', this.form_selector()).val());
            },
            is_forward_starting: function() {
                return (this.start_time() && this.start_time().match(/^\d+$/));
            },
            can_select: function (selector, value) {
                if ($('#'+selector+' option[value="'+value+'"]').length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            model: function() {
                return {
                    form_name: function(form_name) {
                        var fallback = 'bets_tab_risefall';
                        if(form_name) {
                            LocalStore.set('bet_page.form_name', form_name);
                        }

                        form_name = this.get_setting_or_param('bet_page.form_name', 'form_name') || fallback;
                        if(!$('#' + form_name).length) {
                            form_name = fallback;
                        }

                        return form_name;
                    },
                    market: function() {
                        var market = page.url.param_if_valid('market');
                        if (market) {
                            LocalStore.set('bet_page.market', market);
                        }
                        return page.url.param_if_valid('market') || LocalStore.get('bet_page.market') || 'forex';
                    },
                    underlying: function(underlying) {
                        var for_market = this.market();
                        if(underlying) {
                            for_market = markets.by_symbol(underlying).market.name;
                            LocalStore.set('bet_page.underlying.'+for_market, underlying);
                            page.url.invalidate();
                        }

                        return page.url.param_if_valid('underlying_symbol') || LocalStore.get('bet_page.underlying.'+for_market);
                    },
                    submarket: function(submarket) {
                        if(submarket) {
                            LocalStore.set('bet_page.submarket', submarket);
                            page.url.invalidate();
                        }

                        return LocalStore.get('bet_page.submarket');
                    },
                    start_time: function(start_time) {
                        if(start_time) {
                            LocalStore.set('bet_page.start_time', start_time);
                            page.url.invalidate();
                        }

                        return this.get_setting_or_param('bet_page.start_time', 'date_start');
                    },
                    expiry_type: function(expiry_type) {
                        if (expiry_type) {
                            LocalStore.set('bet_page.expiry_type', expiry_type);
                            page.url.invalidate();
                        }

                        return page.url.param_if_valid('expiry_type') || LocalStore.get('bet_page.expiry_type') || 'duration';
                    },
                    time: function(time) {
                        if(time) {
                            LocalStore.set('bet_page.time', time);
                            page.url.invalidate();
                        }

                        return this.get_setting_or_param("bet_page.time", 'time');
                    },
                    barrier_1: function() {
                        return page.url.param_if_valid('H');
                    },
                    barrier_2: function() {
                        return page.url.param_if_valid('L');
                    },
                    amount: function(amount) {
                        if(amount) {
                            LocalStore.set('bet_page.amount', amount);
                            page.url.invalidate();
                        }

                        return this.get_setting_or_param("bet_page.amount", 'amount');
                    },
                    amount_type: function(amount_type) {
                        if(amount_type) {
                            LocalStore.set('bet_page.amount_type', amount_type);
                            page.url.invalidate();
                        }

                        return this.get_setting_or_param("bet_page.amount_type", 'amount_type');
                    },
                    currency: function(currency) {
                        if(currency) {
                            LocalStore.set('bet_page.currency', currency);
                            page.url.invalidate();
                        }

                        var url_currency = page.url.param_if_valid('currency');
                        if(url_currency) {
                            return url_currency;
                        }

                        var session_currency = LocalStore.get('bet_page.currency');
                        if(session_currency) {
                            return session_currency;
                        }

                        return;
                    },
                    get_setting_or_param: function(setting_name, param_name) {
                        var saved_param = LocalStore.get(setting_name);
                        var url_param = page.url.param_if_valid(param_name);

                        //Only take the url provided param if its valid.
                        if(url_param) {
                            return url_param;
                        }

                        return saved_param;
                    },
                };
            }(),
            restore: function() {
                return {
                    all: function() {
                        this.submarket();
                        this.underlying();
                        this.amount();
                        this.amount_type();
                        this.currency();
                    },
                    all_but_underlying: function() {
                        this.submarket();
                        this.amount();
                        this.amount_type();
                        this.currency();
                    },
                    underlying: function() {
                        var underlying = BetForm.attributes.model.underlying();
                        var market = BetForm.attributes.model.market();
                        if(underlying && BetForm.attributes.can_select('bet_underlying', underlying)) {
                            $('#bet_underlying', BetForm.attributes.form_selector()).val(underlying);
                        }
                    },
                    submarket: function() {
                        var market = BetForm.attributes.model.market();
                        var submarket = BetForm.attributes.model.submarket();
                        if(submarket && BetForm.attributes.can_select('submarket', submarket)) {
                            $('#submarket', BetForm.attributes.form_selector()).val(submarket);
                            BetForm.underlying_drop_down.update_for_submarket(submarket);
                        }
                    },
                    amount: function() {
                        var amount = BetForm.attributes.model.amount();
                        if(amount) {
                            $('#amount', BetForm.attributes.form_selector()).val(amount);
                        }
                    },
                    amount_type: function() {
                        var amount_type = BetForm.attributes.model.amount_type();
                        if(amount_type) {
                            $('#amount_type', BetForm.attributes.form_selector()).val(amount_type);
                        }
                    },
                    currency: function() {
                        if(page.client.is_logged_in) {
                            var client_currencies = Settings.get('client.currencies');
                            if(client_currencies !== 'undefined'  && client_currencies.length > 0) {
                                $('#bet_currency option').each(function() {
                                    if($.inArray($(this).val(), client_currencies) < 0) {
                                        $(this).remove();
                                    }
                                });
                            }
                        }

                        var currency = BetForm.attributes.model.currency();
                        if(currency && BetForm.attributes.can_select('bet_currency', currency)) {
                            $('#bet_currency').val(currency);
                        }
                    },
                };

            }()
    };
}();
