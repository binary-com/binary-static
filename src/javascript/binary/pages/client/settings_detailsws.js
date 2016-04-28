var SettingsDetailsWS = (function() {
    "use strict";

    var formID,
        frmBtn,
        RealAccElements,
        errorClass;
    var fieldIDs;
    var isValid;


    var init = function() {
        formID = '#frmPersonalDetails';
        frmBtn = formID + ' button';
        RealAccElements = '.RealAcc';
        errorClass = 'errorfield';
        fieldIDs = {
            address1 : '#Address1',
            address2 : '#Address2',
            city     : '#City',
            state    : '#State',
            postcode : '#Postcode',
            phone    : '#Phone'
        };

        BinarySocket.send({"get_settings": "1"});
    };

    var getDetails = function(response) {
        var data = response.get_settings;

        $('#lblCountry').text(data.country);
        $('#lblEmail').text(data.email);

        if(page.client.is_virtual()){ // Virtual Account
            $(RealAccElements).remove();
        }
        else { // Real Account
            var birthDate = data.date_of_birth ? moment.utc(new Date(data.date_of_birth * 1000)).format("YYYY-MM-DD") : '';
            $('#lblBirthDate').text(birthDate);
            // Generate states list
            var residence = $.cookie('residence');
            BinarySocket.send({"states_list": residence, "passthrough": {"value": data.address_state}});
            if (page.client.residence === 'jp') {
                $('#lblName').text((data.last_name || '') + ' ' + (data.first_name || ''));
                $('#lblGender').text(text.localize(data.gender) || '');
                $('#lblOccupation').text(text.localize(data.occupation) || '');
                $('#lblAddress1').text(data.address_line_1 || '');
                $('#lblAddress2').text(data.address_line_2 || '');
                $('#lblCity').text(data.address_city || '');
                $('#lblPostcode').text(data.address_postcode || '');
                $('#lblPhone').text(data.phone || '');
                $('#lblAnnualIncome').text(text.localize(data.annual_income) || '');
                $('#lblFinancialAsset').text(text.localize(data.financial_asset) || '');
                $('#lblDailyLossLimit').text(data.daily_loss_limit || '');
                $('#lblEquities').text(text.localize(data.trading_experience_equities) || '');
                $('#lblCommodities').text(text.localize(data.trading_experience_commodities) || '');
                $('#lblForeignCurrencyDeposit').text(text.localize(data.trading_experience_foreign_currency_deposit) || '');
                $('#lblMarginFX').text(text.localize(data.trading_experience_margin_fx) || '');
                $('#lblInvestmentTrust').text(text.localize(data.trading_experience_investment_trust) || '');
                $('#lblPublicCorporationBond').text(text.localize(data.trading_experience_public_bond) || '');
                $('#lblDerivativeTrading').text(text.localize(data.trading_experience_option_trading) || '');
                $('#lblPurposeOfTrading').text(text.localize(data.trading_purpose) || '');
                if (data.hedge_asset !== null && data.hedge_asset_amount !== null) {
                  $('#lblHedgeAsset').text(text.localize(data.hedge_asset) || '');
                  $('#lblHedgeAssetAmount').text(data.hedge_asset_amount || '');
                  $('.hedge').css('display', 'block');
                }
                $('.JpAcc').css('display', 'block');
                $('.rowBirthDate').removeClass('hidden');
                $('.rowName').removeClass('hidden');
                $('.rowCustomerSupport').removeClass('hidden');
            } else {
                $('#lblName').text((data.salutation || '') + ' ' + (data.first_name || '') + ' ' + (data.last_name || ''));
                $(fieldIDs.address1).val(data.address_line_1);
                $(fieldIDs.address2).val(data.address_line_2);
                $(fieldIDs.city).val(data.address_city);

                $(fieldIDs.postcode).val(data.address_postcode);
                $(fieldIDs.phone).val(data.phone);

                $(RealAccElements).removeClass('hidden');

                $(frmBtn).click(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    return setDetails();
                });
            }
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
    };

    var formValidate = function() {
        clearError();
        isValid = true;

        var address1 = $(fieldIDs.address1).val().trim(),
            address2 = $(fieldIDs.address2).val().trim(),
            city     = $(fieldIDs.city).val().trim(),
            state    = $(fieldIDs.state).val(),
            postcode = $(fieldIDs.postcode).val().trim(),
            phone    = $(fieldIDs.phone).val().trim();

        var letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            period  = Content.localize().textPeriod,
            comma   = Content.localize().textComma;

        // address 1
        if(!isRequiredError(fieldIDs.address1) && !(/^[a-zA-Z0-9\s\,\.\-\/\(\)#']+$/).test(address1)) {
            showError(fieldIDs.address1, Content.errorMessage('reg', [letters, numbers, space, period, comma, '- / ( ) # \'']));
        }

        // address line 2
        if(!(/^[a-zA-Z0-9\s\,\.\-\/\(\)#']*$/).test(address2)) {
            showError(fieldIDs.address2, Content.errorMessage('reg', [letters, numbers, space, period, comma, '- / ( ) # \'']));
        }

        // town/city
        isRequiredError(fieldIDs.city);

        // state
        if(!isRequiredError(fieldIDs.state) && ($(fieldIDs.state).is('input') && !(/^[a-zA-Z\s\-']+$/).test(state))) {
            showError(fieldIDs.state, Content.errorMessage('reg', [letters, space, '- \'']));
        }

        // postcode
        if(!isRequiredError(fieldIDs.postcode) && !isCountError(fieldIDs.postcode, 4, 20) && !(/(^[a-zA-Z0-9\s\-\/]+$)/).test(postcode)) {
            showError(fieldIDs.postcode, Content.errorMessage('reg', [letters, numbers, space, '- /']));
        }

        // telephone
        if(!isCountError(fieldIDs.phone, 6, 35) && !(/^(|\+?[0-9\s\-]+)$/).test(phone)) {
            showError(fieldIDs.phone, Content.errorMessage('reg', [numbers, space, '-']));
        }

        if(isValid) {
            return {
                address1 : address1,
                address2 : address2,
                city     : city,
                state    : state,
                postcode : postcode,
                phone    : phone
            };
        }
        else {
            return false;
        }
    };

    var isRequiredError = function(fieldID) {
        if(!$(fieldID).val() || !(/.+/).test($(fieldID).val().trim())){
            showError(fieldID, Content.errorMessage('req'));
            return true;
        } else {
            return false;
        }
    };

    var isCountError = function(fieldID, min, max) {
        var fieldValue = $(fieldID).val().trim();
        if((fieldValue.length > 0 && fieldValue.length < min) || fieldValue.length > max) {
            showError(fieldID, Content.errorMessage('range', '(' + min + '-' + max + ')'));
            return true;
        } else {
            return false;
        }
    };

    var showError = function(fieldID, errMsg) {
        $(fieldID).after($('<p/>', {class: errorClass, text: errMsg}));
        isValid = false;
    };

    var clearError = function(fieldID) {
        $(fieldID ? fieldID : formID + ' .' + errorClass).remove();
    };

    var setDetails = function() {
        var formData = formValidate();
        if(!formData)
            return false;

        BinarySocket.send({
            "set_settings"    : 1,
            "address_line_1"  : formData.address1,
            "address_line_2"  : formData.address2,
            "address_city"    : formData.city,
            "address_state"   : formData.state,
            "address_postcode": formData.postcode,
            "phone"           : formData.phone
        });
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
        setDetails: setDetails,
        setDetailsResponse: setDetailsResponse,
        populateStates: populateStates
    };
}());



pjax_config_page("settings/detailsws", function() {
    return {
        onLoad: function() {
            if (page.client.redirect_if_logout()) {
                return;
            }

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
