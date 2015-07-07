var PricingDetails = function() {
    return {
        register: function() {
            if(this.popup().length > 0) {
                this.on_open_debug_link();
                this.on_close();
                this.on_historic_vol();
            }
        },
        on_open_debug_link: function() {
            var that = this;
            $('a.pricing-details').on('click', function (event) {
                var popup = that.popup();
                $('.draggable').draggable(); // This is overkill, but nobody cares.
                popup.toggleClass('invisible');

                $('#' + popup.children(':first').attr('id')).tabs();

                $('a.vcal_tab', popup).on('click', function() {
                    that.vcal_datepicker_handler.init();
                }).addClass('unbind_later');

                event.preventDefault();
            }).addClass('unbind_later');
        },
        on_close: function() {
            var that = this;
            $('a.pricing-details-close').on('click', function (event) {
                that.popup().addClass('invisible');
                event.preventDefault();
            }).addClass('unbind_later');
        },
        on_historic_vol: function() {
            var that = this;
            $('a[class^="hvol_tab_"]').on('click', function(event) {
                event.preventDefault();
                that.get_historic_vol();
            }).addClass('unbind_later');
        },
        popup: function() {
            return $('#pricing_details_popup');
        },
        get_historic_vol: function() {
            $.post(
                    page.url.url_for('trade_get.cgi'),
                    {
                        controller_action : 'historical_vol',
            underlying        : $('#bet_underlying').val()
                    },
                    function(data) {
                        $('#hvol').html(data);
                    },
                    "html"
                  );
        },
        vcal_datepicker_handler: function() {
            var that = {};
            var cache = {};

            var getWeight = function(date) {
                var year = date.getFullYear();
                var underlying_symbol = $('#bet_underlying').val();

                var cache_key = underlying_symbol + '-' + year;
                var lookup = year + '-' + (date.getMonth()+1) + '-' + date.getDate();

                if (typeof cache[cache_key] === 'undefined') {
                    $.ajax({
                        url: page.url.url_for('trade_get.cgi'),
                        data: { controller_action: 'vcal_weights',
                            underlying_symbol: underlying_symbol,
                        year: year,
                        },
                        success: function(vcal_weights) {
                            cache[cache_key] = vcal_weights;
                        },
                        dataType:'json',
                        async: false
                    });
                }

                return cache[cache_key][lookup];
            };

            var beforeShowDay = function(date) {
                window.setTimeout(
                        function() {
                            var tds = $("div.vcal").find("td").filter(function() { return $(this).attr("class").match(/weight/); });

                            tds.find('a').html( function() {
                                var td = $(this).parent('td');
                                var weight = td.attr("class").match('\\d\\.?\\d?\\d?')[0];
                                return weight;
                            });
                        },
                        0);
                return [true, "weight" + getWeight(date), date.getDate()];
            };

            that.init = function() {
                $(".vcal").datepicker({
                    numberOfMonths: 2,
                    beforeShowDay: beforeShowDay
                });
            };

            return that;
        }()
    };
}();
