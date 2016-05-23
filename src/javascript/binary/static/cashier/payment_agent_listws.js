var PaymentAgentListWS = (function() {
    "use strict";

    var hiddenClass,
        ddlCountriesID,
        $paListContainer;

    var residence,
        agentTemplate;


    var init = function() {
        hiddenClass = 'hidden';
        ddlCountriesID = '#target_country';
        $paListContainer = $('#pa_list');
        agentTemplate = $paListContainer.find('#accordion').html();

        residence = $.cookie('residence');
        if(!residence || residence.length === 0) {
            residence = '00'; // just to get a list of payment agent Countries
        }

        sendRequest(residence, true);
    };

    var sendRequest = function(country, isList) {
        BinarySocket.send({
            "paymentagent_list": country ? country : $(ddlCountriesID).val(), 
            "passthrough": isList ? {"countries_list": "1"} : {}
        });
    };

    var responseHandler = function(response) {
        if(response.echo_req.passthrough && response.echo_req.passthrough.countries_list === '1') {
            populateCountriesList(response);
        }
        else {
            populateAgentsList(response.paymentagent_list.list);
        }
    };

    // --------------------------
    // ----- Countries List -----
    // --------------------------
    var populateCountriesList = function(response) {
        var $ddlCountries = $(ddlCountriesID);
        $ddlCountries.empty();

        var cList = response.paymentagent_list.available_countries;
        if(cList.length === 0) {
            $ddlCountries.parent().addClass(hiddenClass);
            showEmptyListMsg();
            return;
        }

        var requestedCountry = response.echo_req.paymentagent_list;
        var found = false;
        cList.map(function(country) {
            if(country === requestedCountry) {
                found = true;
            }
            insertListOption($ddlCountries, country[1], country[0]);
        });

        if(found) {
            $ddlCountries.val(requestedCountry);
            populateAgentsList(response.paymentagent_list.list);
        }
        else {
            sendRequest();
        }

        $ddlCountries.change(function() {
            sendRequest();
        });
    };

    var insertListOption = function($ddlObject, itemText, itemValue) {
        $ddlObject.append($('<option/>', {value: itemValue, text: itemText}));
    };

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    var populateAgentsList = function(list) {
        if(!list || list.length === 0) {
            showEmptyListMsg();
            return;
        }

        showLoadingImage($paListContainer);

        var $accordion = $('<div/>', {id: 'accordion'});

        list.map(function(agent){
            var supported_banks = '';
            if(agent.supported_banks && agent.supported_banks.length > 0) {
                var banks = agent.supported_banks.split(',');
                banks.map(function(bank){
                    supported_banks += bank.length === 0 ? 
                        '' :
                        '<img src="' + page.url.url_for_static('images/pages/payment_agent/banks/' + bank.toLowerCase() + '.png') + '" alt="' + bank + '" title="' + bank + '" />';
                });
            }
        
            $accordion.append(
                agentTemplate
                    .replace(/%name/g                   , agent.name)
                    .replace(/%summary/g                , agent.summary)
                    .replace(/%deposit_commission/g     , agent.deposit_commission)
                    .replace(/%withdrawal_commission/g  , agent.withdrawal_commission)
                    .replace(/%url/g                    , agent.url)
                    .replace(/%email/g                  , agent.email)
                    .replace(/%telephone/g              , agent.telephone)
                    .replace(/%further_information/g    , agent.further_information)
                    .replace(/%supported_banks/g        , supported_banks)
            );
        });

        $paListContainer.empty().append($accordion);

        $('#accordion').accordion({
            heightStyle : 'content',
            collapsible : true,
            active      : false
        });
    };

    var showEmptyListMsg = function() {
        $('#no_paymentagent').removeClass(hiddenClass);
    };

    return {
        init: init,
        responseHandler: responseHandler
    };
}());



pjax_config_page("payment_agent_listws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "paymentagent_list") {
                            PaymentAgentListWS.responseHandler(response);
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            PaymentAgentListWS.init();
        }
    };
});
