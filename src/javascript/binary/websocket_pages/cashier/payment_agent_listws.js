const showLoadingImage = require('../../base/utility').showLoadingImage;
const Cookies          = require('../../../lib/js-cookie');
const Content          = require('../../common_functions/content').Content;
const url_for_static   = require('../../base/url').url_for_static;

const PaymentAgentListWS = (function() {
    'use strict';

    let hiddenClass,
        ddlCountriesID,
        $paListContainer,
        residence,
        agentTemplate;


    const init = function() {
        $(function() {
            $('#accordion').accordion({
                heightStyle: 'content',
                collapsible: true,
                active     : false,
            });
        });

        hiddenClass = 'hidden';
        ddlCountriesID = '#target_country';
        $paListContainer = $('#pa_list');
        agentTemplate = $paListContainer.find('#accordion').html();

        residence = Cookies.get('residence');
        if (!residence || residence.length === 0) {
            residence = '00'; // just to get a list of payment agent Countries
        }

        sendRequest(residence, true);
    };

    const sendRequest = function(country, isList) {
        BinarySocket.send({
            paymentagent_list: country || $(ddlCountriesID).val(),
            passthrough      : isList ? { countries_list: '1' } : {},
        });
    };

    const responseHandler = function(response) {
        if (response.echo_req.passthrough && response.echo_req.passthrough.countries_list === '1') {
            populateCountriesList(response);
        } else {
            populateAgentsList(response.paymentagent_list.list);
        }
    };

    // --------------------------
    // ----- Countries List -----
    // --------------------------
    const populateCountriesList = function(response) {
        const $ddlCountries = $(ddlCountriesID);
        $ddlCountries.empty();

        const cList = response.paymentagent_list.available_countries;
        if (cList.length === 0) {
            $ddlCountries.parent().addClass(hiddenClass);
            showEmptyListMsg();
            return;
        }

        const requestedCountry = response.echo_req.paymentagent_list;
        let found = false;
        cList.map(function(country) {
            if (country === requestedCountry) {
                found = true;
            }
            insertListOption($ddlCountries, country[1], country[0]);
        });

        if (found) {
            $ddlCountries.val(requestedCountry);
            populateAgentsList(response.paymentagent_list.list);
        } else {
            sendRequest();
        }

        $ddlCountries.change(function() {
            sendRequest();
        });
    };

    const insertListOption = function($ddlObject, itemText, itemValue) {
        $ddlObject.append($('<option/>', { value: itemValue, text: itemText }));
    };

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    const populateAgentsList = function(list) {
        if (!list || list.length === 0) {
            showEmptyListMsg();
            return;
        }

        showLoadingImage($paListContainer);

        const $accordion = $('<div/>', { id: 'accordion' });

        list.map(function(agent) {
            let supported_banks = '';
            if (agent.supported_banks && agent.supported_banks.length > 0) {
                const banks = agent.supported_banks.split(',');
                banks.map(function(bank) {
                    supported_banks += bank.length === 0 ?
                        '' :
                        '<img src="' + url_for_static('images/pages/payment_agent/banks/' + bank.toLowerCase() + '.png') + '" alt="' + bank + '" title="' + bank + '" />';
                });
            }

            $accordion.append(
                agentTemplate
                    .replace(/%name/g, agent.name)
                    .replace(/%summary/g, agent.summary)
                    .replace(/%deposit_commission/g, agent.deposit_commission)
                    .replace(/%withdrawal_commission/g, agent.withdrawal_commission)
                    .replace(/%url/g, agent.url)
                    .replace(/%email/g, agent.email)
                    .replace(/%telephone/g, agent.telephone)
                    .replace(/%further_information/g, agent.further_information)
                    .replace(/%supported_banks/g, supported_banks));
        });

        $paListContainer.empty().append($accordion);

        $('#accordion').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : false,
        });
    };

    const showEmptyListMsg = function() {
        $('#no_paymentagent').removeClass(hiddenClass);
    };

    const onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    if (response.msg_type === 'paymentagent_list') {
                        responseHandler(response);
                    }
                }
            },
        });
        Content.populate();
        init();
    };

    return {
        init           : init,
        responseHandler: responseHandler,
        onLoad         : onLoad,
    };
})();

module.exports = PaymentAgentListWS;
