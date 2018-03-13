const BinaryPjax   = require('../../base/binary_pjax');
const Client       = require('../../base/client');
const BinarySocket = require('../../base/socket');
const urlForStatic = require('../../../_common/url').urlForStatic;

const PaymentAgentList = (() => {
    let $pa_list_container,
        $agent_template;

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

        const residence = Client.get('residence');
        if (!residence || residence.length === 0) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        sendRequest(residence, true);
    };

    const sendRequest = (country) => {
        BinarySocket.send({
            paymentagent_list: country,
            currency         : Client.get('currency'),
        }).then((response) => {
            if (response.paymentagent_list) {
                populateAgentsList(response.paymentagent_list.list);
            }
        });
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
                    .replace(/%currency/g, agent.currencies)
                    .replace(/%minmax/g, `${agent.min_withdrawal} / ${agent.max_withdrawal}`)
                    .replace(/%summary/g, agent.summary)
                    .replace(/%deposit_commission/g, agent.deposit_commission)
                    .replace(/%withdrawal_commission/g, agent.withdrawal_commission)
                    .replace(/%url/g, agent.url)
                    .replace(/%email/g, agent.email)
                    .replace(/%telephone/g, agent.telephone)
                    .replace(/%further_information/g, agent.further_information)
                    .replace(/%supported_banks/g, supported_banks));
        });

        $('.barspinner').setVisibility(0);

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
        onLoad,
    };
})();

module.exports = PaymentAgentList;
