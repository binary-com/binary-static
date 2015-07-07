function currencyConvertorCalculator()
{
    var currencyto = document.getElementById('currencyto');
    if (currencyto.options.length > 0)
    {
        currencyto.options.length = 0;
    }

    var i=0;
    $('#currencyfrom').find('option').each(function(){
        if (this.selected !== true)
        {
            currencyto.options[i] = new Option(this.value, this.text);
            i++;
        }
    });

    return true;
}

function checkCurrencyAmountFormat(input_value)
{
    var amount = $(input_value).val();
    var amountEXP = '^\\d+(\\.)?(\\d)?(\\d)?$';
    var amountRex = new RegExp(amountEXP);
    var displayerror = $('#currencyconverterror');
    var currencysubmit = $('#currencysubmit');

    if (amount === '')
    {
        displayerror.addClass('invisible button-disabled');
        currencysubmit.attr('disabled', 'disabled').addClass('button-disabled').parents('.button').addClass('button-disabled');
        return 1;
    }

    if (!amountRex.test(amount) && displayerror)
    {
        displayerror.removeClass('invisible');
        currencysubmit.attr('disabled', 'disabled').addClass('button-disabled').parents('.button').addClass('button-disabled');
    }
    else
    {
        displayerror.addClass('invisible');
        currencysubmit.removeAttr('disabled').removeClass('button-disabled').parents('.button').removeClass('button-disabled');
    }

    return false;
}

function activate_copy_granters() {
    $('#portfolio-table').on('click', '.paste_all_granters', function () {
            $(this).prev('textarea.granter_loginids_input').val(document.getElementById('all_approved_granter_loginids').innerHTML);
            $(this).siblings('span.button').children('.open_contract_details').attr('granter_loginids', document.getElementById('all_approved_granter_loginids').innerHTML);
    });
    $('#portfolio-table').on('change', '.granter_loginids_input', function () {
            $(this).siblings('span.button').children('.open_contract_details').attr('granter_loginids', $(this).val());
    });
}

var Portfolio = function () {
    var _price_request = null;
    var elements = $('button.open_contract_details');
    return {
        update_indicative_prices: function() {
            if(!page.client.is_logged_in) {
                window.location.href = page.url.url_for('login');
                return;
            }

            this.cancel_price_request();
            var that = this;
            if ($.isEmptyObject(elements)) return; // There are no open positions we will be able to update.
            _price_request = $.ajax(ajax_loggedin({
                url     : '/d/trade.cgi',
                type    : 'POST',
                async   : true,
                data    : 'controller_action=open_position_values',
                timeout : 60000,
                success : that.on_price_request_success,
                error   : that.on_price_request_error,
            }));
        },
        cancel_price_request: function() {
            if (_price_request) {
                _price_request.abort();
            }
        },
        on_price_request_success: function(resp, resp_status, jqXHR) {
            var data = {};
            var prices = {};
            if (typeof resp == 'object') {
               data = resp;
            } else {
                data = (JSON && JSON.parse(resp)) || $.parseJSON(resp) || {};
            }
            if (data.redirect) {
                window.location.href = data.redirect;
                return;
            } else if (data.error) {
                return;         // Something went wrong, just leave the cached version in place, it says indicative.
            } else if (data.prices) {
                prices = data.prices;
            } else {
                console.log(data);
                var exception = new Error("Invalid server response: " + data);
                Portfolio.on_price_request_error(jqXHR, resp_status, exception);
            }
            Portfolio.set_contract_prices(prices);
        },
        on_price_request_error: function(jqXHR, resp_status, exp) {
            return;         // Something went wrong, just leave the cached version in place, it says indicative.
        },
        set_contract_prices: function(prices) {
            var that = this;
            var default_price = ((prices && prices['*']) ? prices['*'] : null);
            var _update_element_price = function() {
                var el = $(this);
                var price;
                data = element_data_attrs(el);
                var shortcode = data.shortcode;
                var currency = data.currency;
                if (!prices[currency]) {
                    if (default_price !== null) {
                        prices[currency] = {};
                    } else {
                        return;
                    }
                }
                if (default_price !== null && prices[currency][shortcode] === undefined) {
                    prices[currency][shortcode] = default_price;
                }
                price = prices[currency][shortcode];
                if (price !== undefined) {
                    if (isNaN(price)) {
                        /* price is not a number, could be an error report. do not use currency nor update
                         * the price attr of the button. just update portfolio table value shown to user
                         */
                        $('p', el.parents('div').children('div')[2]).text(price);
                    } else {
                        el.attr('price', price);
                        price = stylized_price(price);
                        price = price.units + price.cents;
                        $('p', el.parents('div').children('div')[2]).text(currency + ' ' + price);
                    }
                }
            };
            elements.each(_update_element_price);
        }
    };
}();

pjax_config_page('portfolio', function() {
    return {
        onLoad: function() {
            $('#portfolio-table .hourglass').hide();
            activate_copy_granters();
            $('#currencyfrom').change(function(event) { currencyConvertorCalculator(event.target); });
            $('#currencyfrom').keyup(function(event) { currencyConvertorCalculator(event.target); });
            $('#currencyfromvalue').change(function(event) { checkCurrencyAmountFormat(event.target); });
            $('#currencyfromvalue').keyup(function(event) { checkCurrencyAmountFormat(event.target); });
            Portfolio.update_indicative_prices();
        }
    };
});
