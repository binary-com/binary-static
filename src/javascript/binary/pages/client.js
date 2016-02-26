var client_form;
onLoad.queue(function() {
    client_form = new ClientForm({valid_loginids: page.settings.get('valid_loginids')});
});

var select_user_country = function() {
    if ($('#residence').length > 0) {
        var selected_country = $('#residence').val();
        var c_config = page.settings.get('countries_list');
        if (selected_country && selected_country.length > 0) {
            if (c_config[selected_country]['gaming_company'] == 'none' && c_config[selected_country]['financial_company'] == 'none') {
                selected_country = '';
            }
            $('#residence').val(selected_country).change();
        } else {
            $.ajax({
                crossDomain: true,
                url: page.url.url_for('country'),
                async: true,
                dataType: "json"
            }).done(function(response) {
                selected_country = response.country;
                if (selected_country && c_config[selected_country]['gaming_company'] == 'none' && c_config[selected_country]['financial_company'] == 'none') {
                    selected_country = '';
                }
                $('#residence').val(selected_country).change();
            });
        }
    }
};

var disable_residence = function () {
    var vr_residence = page.client.residence;
    if (vr_residence.length > 0 && vr_residence == $('#residence').val()) {
        $('#residence').attr('disabled', true);
    }
};

var enable_residence_form_submit = function () {
    $('form#openAccForm').submit(function (event) {
        var field_error = false;
        $("form#openAccForm").find('p.errorfield:visible').each(function() {
            if ($(this).text().length > 0) {
                field_error = true;
                return false;
            }
        });
        if (!field_error) {
            $('#residence').removeAttr('disabled');
        }
    });
};

var upgrade_investment_disabled_field = function () {
    if (page.client.is_real) {
        var fields = ['mrms', 'fname', 'lname', 'dobdd', 'dobmm', 'dobyy', 'residence', 'secretquestion', 'secretanswer'];
        fields.forEach(function (element, index, array) {
            var obj = $('#'+element);
            if (obj.length > 0) {
                $('#'+element).attr('disabled', true);
            }
        });
    } else {
        $('#residence').attr('disabled', true);
    }
};

var financial_enable_fields_form_submit = function () {
    $('form#openAccForm').submit(function (event) {
        var field_error = false;
        $("form#openAccForm").find('p.errorfield:visible').each(function() {
            if ($(this).text().length > 0) {
                field_error = true;
                return false;
            }
        });
        if (field_error) {
            return;
        }

        if (page.client.is_real) {
            var fields = ['mrms', 'fname', 'lname', 'dobdd', 'dobmm', 'dobyy', 'residence', 'secretquestion', 'secretanswer'];
            fields.forEach(function (element, index, array) {
                var obj = $('#'+element);
                if (obj.length > 0) {
                    obj.removeAttr('disabled');
                }
            });
        } else {
            $('#residence').removeAttr('disabled');
        }
    });
};

var hide_account_opening_for_risk_disclaimer = function () {
    var risk_section = $('#risk_disclaimer_section');
    if (risk_section.length > 0) {
        $('.formObject fieldset').not("#risk_disclaimer_section").hide();
    }
};

var toggle_hedging_assets_japan = function() {
    var trading_purpose = $('#trading_purpose');
    var hedging_assets_fields = $('.hedging_assets');

    if (trading_purpose.val() === 'Hedging') {
        hedging_assets_fields.show();
    } else {
        hedging_assets_fields.hide();
    }
};

var validate_hedging_fields_form_submit = function () {
    $('form#openAccForm').submit(function (event) {
        if ($('#trading_purpose').val() === 'Hedging') {
            if ($('#hedge_asset').val() === '') {
                $('#error_hedge_asset').text(text.localize('Please select a value.'));
            }
            if ($('#hedge_asset_amount').val() === '') {
                $('#error_hedge_asset_amount').text(text.localize('Please enter amount.'));
            }
        }
    });
};

pjax_config_page('new_account/maltainvest', function() {
    return {
        onLoad: function() {
            if (!page.client.is_real) {
                client_form.on_residence_change();
                select_user_country();
            }
            upgrade_investment_disabled_field();
            financial_enable_fields_form_submit();
            hide_account_opening_for_risk_disclaimer();
        }
    };
});

pjax_config_page('new_account/japan', function() {
    return {
        onLoad: function() {
            client_form.set_idd_for_residence('jp');
            toggle_hedging_assets_japan();
            $('#trading_purpose').on('change', function() {
                toggle_hedging_assets_japan();
            });
            validate_hedging_fields_form_submit();
        }
    };
});

pjax_config_page('user/assessment', function() {
    return {
        onLoad: function() {
            hide_account_opening_for_risk_disclaimer();
        }
    };
});
