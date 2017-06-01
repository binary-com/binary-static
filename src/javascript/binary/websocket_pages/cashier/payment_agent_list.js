const BinarySocket = require('../socket');
const urlForStatic = require('../../base/url').urlForStatic;
const Cookies      = require('../../../lib/js-cookie');

const PaymentAgentList = (() => {
    'use strict';

    let $pa_list_container,
        $agent_template;

    const ddl_countries_id = '#target_country';

    const onLoad = () => {
        $(() => {
            $('#accordion').accordion({
                heightStyle: 'content',
                collapsible: true,
                active     : false,
            });
        });

        $pa_list_container = $('#pa_list');
        $agent_template    = $pa_list_container.find('#accordion').html();

        let residence = Cookies.get('residence');
        if (!residence || residence.length === 0) {
            residence = '00'; // just to get a list of payment agent Countries
        }

        sendRequest(residence, true);
    };

    const sendRequest = (country, is_list) => {
        BinarySocket.send({
            paymentagent_list: country || $(ddl_countries_id).val(),
        }).then((response) => {
            if (is_list) {
                populateCountriesList(response);
            } else {
                populateAgentsList(response.paymentagent_list.list);
            }
        });
    };

    // --------------------------
    // ----- Countries List -----
    // --------------------------
    const populateCountriesList = (response) => {
        const $ddl_countries = $(ddl_countries_id);
        $ddl_countries.empty();

        const countries = response.paymentagent_list.available_countries;
        if (countries.length === 0) {
            $ddl_countries.parent().setVisibility(0);
            showEmptyListMsg();
            return;
        }

        const requested_country = response.echo_req.paymentagent_list;
        let found = false;
        countries.map((country) => {
            if (country === requested_country) {
                found = true;
            }
            insertListOption($ddl_countries, country[1], country[0]);
        });
        $('#target_country').setVisibility(1);
        $('.barspinner').setVisibility(0);

        if (found) {
            $ddl_countries.val(requested_country);
            populateAgentsList(response.paymentagent_list.list);
        } else {
            sendRequest();
        }

        $ddl_countries.change(() => {
            sendRequest();
        });
    };

    const insertListOption = ($ddl_object, item_text, item_value) => {
        $ddl_object.append($('<option/>', { value: item_value, text: item_text }));
    };

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    const populateAgentsList = (list) => {
        if (!list || list.length === 0) {
            showEmptyListMsg();
            return;
        }

        const $accordion = $('<div/>', { id: 'accordion' });

        list.map((agent) => {
            let supported_banks = '';
            if (agent.supported_banks && agent.supported_banks.length > 0) {
                const banks = agent.supported_banks.split(',');
                banks.map((bank) => {
                    supported_banks += bank.length === 0 ?
                        '' :
                        `<img src="${urlForStatic(`images/pages/payment_agent/banks/${bank.toLowerCase()}.png`)}" alt="${bank}" title="${bank}" />`;
                });
            }

            $accordion.append(
                $agent_template
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

        $pa_list_container.empty().append($accordion);

        $('#accordion').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : false,
        });
    };

    const showEmptyListMsg = () => {
        $('.barspinner').setVisibility(0);
        $('#no_paymentagent').setVisibility(1);
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = PaymentAgentList;
