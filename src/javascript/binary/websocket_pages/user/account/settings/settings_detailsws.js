var SettingsDetailsWS = (function() {
    "use strict";

    var formID = '#frmPersonalDetails';
    var RealAccElements = '.RealAcc';
    var changed = false;
    var fieldIDs = {
        address1 : '#Address1',
        address2 : '#Address2',
        city     : '#City',
        state    : '#State',
        postcode : '#Postcode',
        phone    : '#Phone'
    };


    function init() {
        var isJP = page.client.residence === 'jp';
        BinarySocket.send({"get_settings": "1"});
        bind_validation.simple($(formID)[0], {
            schema: isJP ? getJPSchema() : getNonJPSchema(),
            submit: function(ev, info) {
                ev.preventDefault();
                ev.stopPropagation();
                if (info.errors.length > 0) return;
                if (!changed) {
                    showFormMessage('You did not change anything.', false);
                    return;
                }
                if (isJP) return submitJP(info.values);
                submitNonJP(info.values);
            },
        });
        if (isJP) {
            detect_hedging($('#PurposeOfTrading'), $('.hedge'));
        }
    }

    function getDetailsResponse(response) {
        var data = response.get_settings;

        $('#lblCountry').text(data.country || '-');
        $('#lblEmail').text(data.email);

        if (page.client.is_virtual()) { // Virtual Account
            $(RealAccElements).remove();
            $(formID).removeClass('hidden');
            return;
        }
        // Real Account
        var birthDate = data.date_of_birth ? moment.utc(new Date(data.date_of_birth * 1000)).format("YYYY-MM-DD") : '';
        $('#lblBirthDate').text(birthDate);
        // Generate states list
        var residence = Cookies.get('residence');
        if (residence) {
            BinarySocket.send({"states_list": residence, "passthrough": {"value": data.address_state}});
        }
        if (page.client.residence === 'jp') {
            var jpData = response.get_settings.jp_settings;
            $('#lblName').text((data.last_name || ''));
            $('#lblGender').text(text.localize(jpData.gender) || '');
            $('#lblAddress1').text(data.address_line_1 || '');
            $('#lblAddress2').text(data.address_line_2 || '');
            $('#lblCity').text(data.address_city || '');
            $('#lblPostcode').text(data.address_postcode || '');
            $('#lblPhone').text(data.phone || '');

            $('#AnnualIncome').val(jpData.annual_income);
            $('#FinancialAsset').val(jpData.financial_asset);
            $('#Occupation').val(jpData.occupation);
            $('#Equities').val(jpData.trading_experience_equities);
            $('#Commodities').val(jpData.trading_experience_commodities);
            $('#ForeignCurrencyDeposit').val(jpData.trading_experience_foreign_currency_deposit);
            $('#MarginFX').val(jpData.trading_experience_margin_fx);
            $('#InvestmentTrust').val(jpData.trading_experience_investment_trust);
            $('#PublicCorporationBond').val(jpData.trading_experience_public_bond);
            $('#DerivativeTrading').val(jpData.trading_experience_option_trading);
            $('#PurposeOfTrading').val(jpData.trading_purpose);
            if (jpData.hedge_asset !== null && jpData.hedge_asset_amount !== null) {
              $('#HedgeAsset').val(jpData.hedge_asset);
              $('#HedgeAssetAmount').val(jpData.hedge_asset_amount);
              $('.hedge').removeClass('invisible');
            }
            $('.JpAcc').removeClass('invisible')
                       .removeClass('hidden');

            $('#AnnualIncome, #FinancialAsset, #Occupation, #Equities, #Commodities,' +
                '#ForeignCurrencyDeposit, #MarginFX, #InvestmentTrust, #PublicCorporationBond,' +
                '#DerivativeTrading, #PurposeOfTrading, #HedgeAsset, #HedgeAssetAmount')
                .on('change', function() {
                changed = true;
            });
        } else {
            $('#lblName').text((data.salutation || '') + ' ' + (data.first_name || '') + ' ' + (data.last_name || ''));
            $(fieldIDs.address1).val(data.address_line_1);
            $(fieldIDs.address2).val(data.address_line_2);
            $(fieldIDs.city).val(data.address_city);

            $(fieldIDs.postcode).val(data.address_postcode);
            $(fieldIDs.phone).val(data.phone);

            $('#Address1, #Address2, #City, #State, #Postcode, #Phone').on('change', function() {
              changed = true;
            });

            $(RealAccElements).removeClass('hidden');
        }
        $('.JpAcc').removeClass('invisible')
                   .removeClass('hidden');

        $('#AnnualIncome, #FinancialAsset, #Occupation, #Equities, #Commodities,' +
            '#ForeignCurrencyDeposit, #MarginFX, #InvestmentTrust, #PublicCorporationBond,' +
            '#DerivativeTrading, #PurposeOfTrading, #HedgeAsset, #HedgeAssetAmount')
            .on('change', function() {
            changed = true;
        });
        $(formID).removeClass('hidden');
    }

    function populateStates(response) {
        var $field = $(fieldIDs.state);
        var defaultValue = response.echo_req.passthrough.value;
        var states = response.states_list;

        $field.empty();

        if (states.length > 0) {
            states.forEach(function(state) {
                $field.append($('<option/>', {value: state.value, text: state.text}));
            });
        } else {
            $field.replaceWith($('<input/>', {id: fieldIDs.state, name: 'address_state', type: 'text', maxlength: '35'}));
        }

        $field.val(defaultValue);
        $('#lblState').text($('#State option:selected').text());
        $field.on('change', function() {
            changed = true;
        });
    }

    function toJPSettings(data) {
        var jp_settings = {};
        jp_settings = {};
        jp_settings["annual_income"]                               = data.annualIncome;
        jp_settings["financial_asset"]                             = data.financialAsset;
        jp_settings["occupation"]                                  = data.occupation;
        jp_settings["trading_experience_equities"]                 = data.equities;
        jp_settings["trading_experience_commodities"]              = data.commodities;
        jp_settings["trading_experience_foreign_currency_deposit"] = data.foreignCurrencyDeposit;
        jp_settings["trading_experience_margin_fx"]                = data.marginFX;
        jp_settings["trading_experience_investment_trust"]         = data.InvestmentTrust;
        jp_settings["trading_experience_public_bond"]              = data.publicCorporationBond;
        jp_settings["trading_experience_option_trading"]           = data.derivativeTrading;
        jp_settings["trading_purpose"]                             = data.purposeOfTrading;
        if (data.purposeOfTrading === 'Hedging') {
            jp_settings["hedge_asset"]        = data.hedgeAsset;
            jp_settings["hedge_asset_amount"] = data.hedgeAssetAmount;
        }
        return {jp_settings: jp_settings};
    }

    function submitJP(data) {
        function trim(s) {
            return $(s).val().trim();
        }
        setDetails(toJPSettings({
            hedgeAssetAmount       : data.hedge_asset_amount,
            annualIncome           : trim('#AnnualIncome'),
            financialAsset         : trim('#FinancialAsset'),
            occupation             : trim('#Occupation'),
            equities               : trim('#Equities'),
            commodities            : trim('#Commodities'),
            foreignCurrencyDeposit : trim('#ForeignCurrencyDeposit'),
            marginFX               : trim('#MarginFX'),
            InvestmentTrust        : trim('#InvestmentTrust'),
            publicCorporationBond  : trim('#PublicCorporationBond'),
            derivativeTrading      : trim('#DerivativeTrading'),
            purposeOfTrading       : trim('#PurposeOfTrading'),
            hedgeAsset             : trim('#HedgeAsset')
        }));
    }

    function getJPSchema(data) {
        var V2 = ValidateV2;
        return {
            hedge_asset_amount: [
                function(v) { return dv.ok(v.trim()); },
                V2.required,
                V2.regex(/^\d+$/, [Content.localize().textNumbers]),
            ],
        };
    }

    function submitNonJP(data) {
        delete data.hedge_asset_amount;
        setDetails(data);
    }

    function getNonJPSchema() {
        var letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            period  = Content.localize().textPeriod,
            comma   = Content.localize().textComma;

        var V2 = ValidateV2;
        var isAddress  = V2.regex(/^[a-zA-Z0-9\s\,\.\-\/\(\)#']+$/, [letters, numbers, space, period, comma, '- / ( ) # \'']);
        var isCity     = isAddress;
        var isState    = V2.regex(/^[a-zA-Z\s\-']+$/,               [letters, space, '- \'']);
        var isPostcode = V2.regex(/^[\w\s-]+$/,                     [letters, numbers, space, '-']);
        var isPhoneNo  = V2.regex(/^(|\+?[0-9\s\-]+)$/,             [numbers, space, '-']);

        function maybeEmptyAddress(value) {
            return value.length ? isAddress(value) : dv.ok(value);
        }

        return {
            address_line_1:   [V2.required, isAddress],
            address_line_2:   [maybeEmptyAddress],
            address_city:     [V2.required, isCity],
            address_state:    [V2.required, isState],
            address_postcode: [V2.required, V2.lengthRange(1, 20), isPostcode],
            phone:            [V2.lengthRange(6, 35), isPhoneNo],
        };
    }

    function setDetails(data) {
        var req = {"set_settings" : 1};
        Object.keys(data).forEach(function(key) {
            req[key] = data[key];
        });
        console.log(req);
        BinarySocket.send(req);
    }

    function showFormMessage(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    }

    function setDetailsResponse(response) {
        var isError = response.set_settings !== 1;
        // allow user to resubmit the form on error.
        changed = isError ? true : false;
        showFormMessage(isError ?
            'Sorry, an error occurred while processing your account.' :
            'Your settings have been updated successfully.', !isError);
    }

    return {
        init: init,
        getDetailsResponse: getDetailsResponse,
        setDetailsResponse: setDetailsResponse,
        populateStates: populateStates
    };
}());



pjax_config_page_require_auth("settings/detailsws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (!response) {
                        console.log('some error occured');
                        return;
                    }
                    var type = response.msg_type;
                    switch(type){
                        case "get_settings":
                            SettingsDetailsWS.getDetailsResponse(response);
                            break;
                        case "set_settings":
                            SettingsDetailsWS.setDetailsResponse(response);
                            break;
                        case "states_list":
                            SettingsDetailsWS.populateStates(response);
                            break;
                        case "error":
                            $('#formMessage').attr('class', 'errorfield').text(response.error.message);
                            break;
                        default:
                            break;
                    }
                }
            });

            Content.populate();
            SettingsDetailsWS.init();
        }
    };
});
