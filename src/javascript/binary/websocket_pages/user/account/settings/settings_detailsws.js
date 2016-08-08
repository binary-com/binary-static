var SettingsDetailsWS = (function() {
    "use strict";

    var formID,
        frmBtn,
        RealAccElements,
        errorClass;
    var fieldIDs;
    var isValid,
        changed;


    var init = function() {
        formID = '#frmPersonalDetails';
        frmBtn = formID + ' button';
        RealAccElements = '.RealAcc';
        errorClass = 'errorfield';
        changed = false;
        fieldIDs = {
            address1 : '#Address1',
            address2 : '#Address2',
            city     : '#City',
            state    : '#State',
            postcode : '#Postcode',
            phone    : '#Phone'
        };

        BinarySocket.send({"get_settings": "1"});
        if (page.client.residence === 'jp') {
            detect_hedging($('#PurposeOfTrading'), $('.hedge'));
        }
    };

    var getDetails = function(response) {
        var data = response.get_settings;

        $('#lblCountry').text(data.country || '-');
        $('#lblEmail').text(data.email);

        if(page.client.is_virtual()){ // Virtual Account
            $(RealAccElements).remove();
        }
        else { // Real Account
            var birthDate = data.date_of_birth ? moment.utc(new Date(data.date_of_birth * 1000)).format("YYYY-MM-DD") : '';
            $('#lblBirthDate').text(birthDate);
            // Generate states list
            var residence = $.cookie('residence');
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
            bind_validation.simple($(formID)[0], {
                validate: page.client.residence === 'jp' ? validateJP : validateNonJP,
                submit:   page.client.residence === 'jp' ? submitJP   : submitNonJP,
            });
        }

        $(formID).removeClass('hidden');
    };

    var populateStates = function(response) {
        $(fieldIDs.state).empty();
        var defaultValue = response.echo_req.passthrough.value;
        var states = response.states_list;
        if(states.length > 0) {
            for(var i = 0; i < states.length; i++){
                $(fieldIDs.state).append($('<option/>', {value: states[i].value, text: states[i].text}));
            }
            // set Current value
            $(fieldIDs.state).val(defaultValue);
        }
        else {
            $(fieldIDs.state).replaceWith($('<input/>', {id: 'State', type: 'text', maxlength: '35', value: defaultValue}));
        }
        $('#lblState').text($('#State option:selected').text());
        $(fieldIDs.state).on('change', function() {
          changed = true;
        });
    };

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

    function submitJP(ev, info) {
        ev.preventDefault();
        ev.stopPropagation();
        if (info.errors.length > 0 || !changed) return;
        setDetails(toJPSettings({
            hedgeAssetAmount       : hedgeAssetAmount.val().trim(),
            annualIncome           : $('#AnnualIncome').val().trim(),
            financialAsset         : $('#FinancialAsset').val().trim(),
            occupation             : $('#Occupation').val().trim(),
            equities               : $('#Equities').val().trim(),
            commodities            : $('#Commodities').val().trim(),
            foreignCurrencyDeposit : $('#ForeignCurrencyDeposit').val().trim(),
            marginFX               : $('#MarginFX').val().trim(),
            InvestmentTrust        : $('#InvestmentTrust').val().trim(),
            publicCorporationBond  : $('#PublicCorporationBond').val().trim(),
            derivativeTrading      : $('#DerivativeTrading').val().trim(),
            purposeOfTrading       : $('#PurposeOfTrading').val().trim(),
            hedgeAsset             : $('#HedgeAsset').val().trim()
        }));
    }

    function validateJP(data) {
        var V2 = ValidateV2;
        var numbers = Content.localize().textNumbers;
        var schema = {
            hedgeAssetAmount: [
                function(v) { return dv.ok(v.trim()); },
                V2.required,
                V2.regex(/^\d+$/, [numbers]),
            ],
        };
        return validate_object(schema, data);
    }

    function submitNonJP(ev, info) {
        ev.preventDefault();
        ev.stopPropagation();
        if (info.errors.length > 0 || !changed) return;
        delete values.hedgeAssetAmount;
        setDetails(info.values);
    }

    function validateNonJP(data) {
        var letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            period  = Content.localize().textPeriod,
            comma   = Content.localize().textComma;

        var V2 = ValidateV2;
        var maybeEmptyAddress = V2.regex(/^[a-zA-Z0-9\s\,\.\-\/\(\)#']*$/, [letters, numbers, space, period, comma, '- / ( ) # \'']);
        var isAddress  = V2.regex(/^[a-zA-Z0-9\s\,\.\-\/\(\)#']+$/, [letters, numbers, space, period, comma, '- / ( ) # \'']);
        var isState    = V2.regex(/^[a-zA-Z\s\-']+$/,               [letters, space, '- \'']);
        var isPostcode = V2.regex(/(^[a-zA-Z0-9\s\-\/]+$)/,         [letters, numbers, space, '- /']);
        var isPhoneNo  = V2.regex(/^(|\+?[0-9\s\-]+)$/,             [numbers, space, '-']);

        var schema = {
            address1: [V2.required, isAddress],
            address2: [maybeEmptyAddress],
            city:     [V2.required],
            state:    [V2.required, isState],
            postcode: [V2.required, V2.lengthRange(4, 20), isPostcode],
            phone:    [V2.lengthRange(6, 35), isPhoneNo],
        };
        return validate_object(data, schema);
    }

    var setDetails = function(data) {
        var req = {"set_settings" : 1};
        Object.keys(data).forEach(function(key) {
            req[key] = data[key];
        });
        console.log(req);
        //BinarySocket.send(req);
    };

    var setDetailsResponse = function(response) {
        var isError = response.set_settings !== 1;
        $('#formMessage').css('display', '')
            .attr('class', isError ? 'errorfield' : 'success-msg')
            .html(isError ? text.localize('Sorry, an error occurred while processing your account.') : '<ul class="checked"><li>' + text.localize('Your settings have been updated successfully.') + '</li></ul>')
            .delay(3000)
            .fadeOut(1000);
    };

    return {
        init: init,
        getDetails: getDetails,
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
                    if (response) {
                        var type = response.msg_type;
                        switch(type){
                            case "get_settings":
                                SettingsDetailsWS.getDetails(response);
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
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            SettingsDetailsWS.init();
        }
    };
});
