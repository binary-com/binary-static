const BinaryPjax   = require('../../base/binary_pjax');
const Client       = require('../../base/client');
const BinarySocket = require('../../base/socket');
const Url          = require('../../../_common/url');

const PaymentAgentList = (() => {
    let $pa_list_container,
        $agent_template;

    const onLoad = () => {
        if (!Client.get('currency')) {
            BinaryPjax.load(`${Url.urlFor('user/set-currency')}`);
            return;
        }

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
        const currency = Client.get('currency');
        BinarySocket.send({
            paymentagent_list: country,
            ...(currency && { currency }),
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

        const getNormalizedPaymentMethod = (method) => {
            const all_payment_methods = ['alertpay', 'alipay', 'bank', 'bankbri', 'bch', 'bni', 'btc', 'card', 'cash',
                'cimbniaga', 'crypto', 'dai', 'diamondbank', 'egold', 'eth', 'ethd', 'ewallet', 'firstbank', 'grupbca',
                'gtbank', 'icbc', 'libertyreserve', 'ltc', 'mandiri_syariah', 'mandiri', 'mandirisyariah', 'mastercard', 'mixed',
                'moneygram', 'paypal', 'perfectmoney', 'permatabank', 'solidtrustpay', 'tether', 'verve', 'visa', 'wechatpay',
                'zenithbank'];

            const normalized_payment_methods = {
                bank   : ['banks', 'bankdeposit', 'banktransfer', 'bankwire', 'bankwiretransfer', 'localbankwire', 'localbank', 'localbanks', 'localbanktransfer'],
                btc    : ['bitcoin'],
                bankbri: ['bri'],
                card   : ['cards'],
                cash   : ['cashdeposits'],
                crypto : ['cryptos', 'cryptocurrencies', 'cryptocurrency', 'weacceptcrypto'],
                eth    : ['ethereum'],
                ewallet: ['ewallets', 'ewalletpayment', 'skrill'],
                grupbca: ['bca'],
                ltc    : ['litecoin'],
                mixed  : ['mix'],
            };

            const trimmed_payment_method = method.replace(/[' ',-]/g, '').toLowerCase();

            if (all_payment_methods.includes(trimmed_payment_method)){
                return trimmed_payment_method;
            }

            const normalized_payment_method = Object.entries(normalized_payment_methods).reduce((pay_method, [ key, value ]) => value.some(el => el === trimmed_payment_method) ? key : pay_method, '');
            return normalized_payment_method;
        };

        list.map((agent) => {
            let supported_banks = '';
            if (agent.supported_payment_methods && agent.supported_payment_methods.length > 0) {
                agent.supported_payment_methods.map((item) => {
                    const payment_method = getNormalizedPaymentMethod(item.payment_method);
                    supported_banks += payment_method ?
                        `<img src="${Url.urlForStatic(`images/pages/payment_agent/banks/${payment_method.toLowerCase()}.png`)}" alt="${payment_method}" title="${payment_method}" />`
                        : '';
                });
            } else if (agent.supported_banks && agent.supported_banks.length > 0) {
                // TODO: remove this block when support for multiple payment methods is released
                const banks = agent.supported_banks.split(',');
                banks.map((bank) => {
                    const supported_bank = getNormalizedPaymentMethod(bank);
                    supported_banks += supported_bank ?
                        `<img src="${Url.urlForStatic(`images/pages/payment_agent/banks/${supported_bank.toLowerCase()}.png`)}" alt="${supported_bank}" title="${supported_bank}" />`
                        : '';
                });
            }

            let urls = '';
            if (agent.urls && agent.urls.length > 0) {
                agent.urls.map((item, index) => {
                    urls += index ? ',' : '';
                    urls += `<a href="${item.url}" target='_blank'>${item.url}</a>`;
                });
            } else {
                // TODO: remove this when support for multiple payment agent urls is released
                urls = `<a href="${agent.url}" target='_blank'>${agent.url}</a>`;
            }

            let phone_numbers = '';
            if (agent.phone_numbers && agent.phone_numbers.length > 0) {
                agent.phone_numbers.map((item, index) => {
                    phone_numbers += index ? ',' : '';
                    phone_numbers += `<a href="tel:${item.phone_number}">${item.phone_number}</a>`;
                });
            } else {
                // TODO: remove this when support for multiple payment agent phones is released
                phone_numbers = `<a href="tel:${agent.telephone}">${agent.telephone}</a>`;
            }

            $accordion.append(
                $agent_template
                    .replace(/%name/g, agent.name)
                    .replace(/%currency/g, agent.currencies)
                    .replace(/%minmax/g, `${agent.min_withdrawal} / ${agent.max_withdrawal}`)
                    .replace(/%summary/g, agent.summary)
                    .replace(/%deposit_commission/g, agent.deposit_commission)
                    .replace(/%withdrawal_commission/g, agent.withdrawal_commission)
                    .replace(/%url/g, urls)
                    .replace(/%email/g, agent.email)
                    .replace(/%telephone/g, phone_numbers)
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
