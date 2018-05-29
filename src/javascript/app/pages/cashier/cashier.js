const BinaryPjax       = require('../../base/binary_pjax');
const Client           = require('../../base/client');
const Header           = require('../../base/header');
const BinarySocket     = require('../../base/socket');
const isCryptocurrency = require('../../common/currency').isCryptocurrency;
const getElementById   = require('../../../_common/common_functions').getElementById;
const urlFor           = require('../../../_common/url').urlFor;
const getPropertyValue = require('../../../_common/utility').getPropertyValue;

const Cashier = (() => {
    let href = '';

    const showContent = () => {
        Client.activateByClientType();
        Header.upgradeMessageVisibility(); // To handle the upgrade buttons visibility
    };

    const displayTopUpButton = () => {
        BinarySocket.wait('balance').then((response) => {
            const currency  = response.balance.currency;
            const balance   = +response.balance.balance;
            const can_topup = (currency !== 'JPY' && balance <= 1000) || (currency === 'JPY' && balance <= 100000);
            const top_up_id = '#VRT_topup_link';
            const $a        = $(top_up_id);
            if (!$a) {
                return;
            }
            const classes   = ['toggle', 'button-disabled'];
            const new_el    = { class: $a.attr('class').replace(classes[+can_topup], classes[1 - +can_topup]), html: $a.html(), id: $a.attr('id') };
            if (can_topup) {
                href        = href || urlFor('/cashier/top_up_virtualws');
                new_el.href = href;
            }
            $a.replaceWith($('<a/>', new_el));
            $(top_up_id).parent().setVisibility(1);
        });
    };

    const onLoad = () => {
        if (Client.isJPClient()) {
            if (Client.get('residence') !== 'jp') {
                BinaryPjax.loadPreviousUrl();
            } else {
                $('.deposit').parent().addClass('button-disabled').attr('href', 'javascript:;');
            }
        }
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then(() => {
                const is_virtual = Client.get('is_virtual');
                const client_cur = Client.get('currency');
                const is_crypto  = isCryptocurrency(client_cur);
                if (is_virtual) {
                    displayTopUpButton();
                }
                const residence = Client.get('residence');
                if (residence) {
                    BinarySocket.send({ paymentagent_list: residence }).then((response) => {
                        const list = getPropertyValue(response, ['paymentagent_list', 'list']);
                        if (client_cur && (list || []).find(pa => new RegExp(client_cur).test(pa.currencies))) {
                            $('#payment-agent-section').setVisibility(1);
                        }
                    });
                }
                $(is_crypto ? '.crypto_currency' : '.normal_currency').setVisibility(1);
                if (/^BCH/.test(Client.get('currency'))) {
                    getElementById('message_bitcoin_cash').setVisibility(1);
                }
            });
        }
        showContent();
    };

    return {
        onLoad,
        PaymentMethods: { onLoad: () => { showContent(); } },
    };
})();

module.exports = Cashier;
