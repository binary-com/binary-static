var calculate_button_event = function() {
    $('#pricingtable_calculate').on('click', function(e) {
        e.preventDefault();
        var form = $('form[name=pricing_table_input]').get(0);
        var url = page.url.url_for('pricing_table.cgi', getFormParams(form));
        $('#pricingtable_calculate').hide();
        $('#pricingtable_calculating').show();
        $('#pricing_table_prices_div').html('');
        $.ajax({
            url: url,
            data: {
                ajax_only: 1,
                prices_only: 1,
            },
        }).done(function(response) {
            $('#pricing_table_prices_div').html(response);
            page.url.update(url);
            $('#pricingtable_calculating').hide();
            $('#pricingtable_calculate').show();
            attach_tabs('#pricing_table_tabs');
        });
    });
};

var bet_type_select = function() {
    $('#pricing_table_input').find('select[name="bet_type"]').on('change', function() {
        var bet_type = $(this).val();
        var double_barriers = ["RANGE", "UPORDOWN", "EXPIRYRANGE", "EXPIRYMISS"];
        var is_double_barrier = 0;

        for (var i = 0; i < double_barriers.length; i++) {
            if (bet_type == double_barriers[i]) {
                is_double_barrier = 1;
                break;
            }
        }
        if (is_double_barrier == 1) {
            $("#lower_strike").show();
            $("#high_strike_label").show();
            $("#strike_label").hide();
        } else {
            $("#lower_strike").hide();
            $("#high_strike_label").hide();
            $("#strike_label").show();
        }

        var prev_underlying = $("#pricingtable_underlying").val();

        // change underlying option list
        var ajax_url = page.url.url_for('pricing_table.cgi');
        $.post(
            ajax_url,
            {
                action: "get_underlyings",
                ajax_only: 1,
                bet_type: bet_type,
                underlying: prev_underlying,
            },
            function(data) {
                $("#pricingtable_underlying_div").html(data);
                var underlying = $('#pricingtable_underlying');
                if (underlying.val() != prev_underlying) {
                    underlying.find("option").get(0).selected = true;
                    underlying.find("option").get(0).val();
                    underlying.trigger("change");
                }
            },
            "html"
        );
    });
};

var select_underlying_change = function() {
    $("#pricingtable_underlying").on("change", function() {
        var underlying = $(this).val();
        // change lower strike
        var ajax_url = page.url.url_for('pricing_table.cgi');
        $.post(
            ajax_url,
            {
                action: "get_low_strike",
                ajax_only: 1,
                underlying: underlying
            },
            function(data) {
                $("#low_strike").attr("value", data);
            },
            "html"
        );
    });
};

var select_strike_type = function() {
    $("#strike_type").on('change', function() {
        var strike_type = $(this).val();
        if (strike_type == 'Moneyness terms') {
            $("#from_strike_percent").show();
            $("#from_strike_label").hide();
        } else {
            $("#from_strike_percent").hide();
            $("#from_strike_label").show();
        }
    }).change();
};

var expiry_date_picker = function() {
    var today = new Date();
    var three_month = new Date();
    three_month.setDate(today.getDate() + 60);

    var id = $('#from_expiry');
    id.datepicker({
        dateFormat: 'yy-mm-dd',
        monthNames: [text.localize('January'), text.localize('February'), text.localize('March'), text.localize('April'), text.localize('May'), text.localize('June'),
            text.localize('July'), text.localize('August'), text.localize('September'), text.localize('October'), text.localize('November'), text.localize('December')],
        dayNamesShort: [text.localize('Su'), text.localize('Mo'), text.localize('Tu'), text.localize('We'),
            text.localize('Th'), text.localize('Fr'), text.localize('Sa')],
        minDate: today,
        maxDate: three_month,
        onSelect: function(dateText, inst) {
            id.attr("value", dateText);
        },
    }).datepicker('setDate', "0");
};

function initialize_pricing_table() {
    calculate_button_event();
    bet_type_select();
    select_underlying_change();
    select_strike_type();
    expiry_date_picker();
}

onLoad.queue_for_url(initialize_pricing_table, 'pricing_table');
