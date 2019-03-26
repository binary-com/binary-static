const Client           = require('../../base/client');
const BinarySocket     = require('../../base/socket');
const isCryptocurrency = require('../../common/currency').isCryptocurrency;
const elementInnerHtml = require('../../../_common/common_functions').elementInnerHtml;
const getElementById   = require('../../../_common/common_functions').getElementById;
const localize         = require('../../../_common/localize').localize;
const paramsHash       = require('../../../_common/url').paramsHash;
const urlFor           = require('../../../_common/url').urlFor;
const getPropertyValue = require('../../../_common/utility').getPropertyValue;

const Cashier = (() => {
    let href = '';

    const showContent = () => {
        Client.activateByClientType();
        const anchor = paramsHash().anchor;
        let $toggler;
        if (anchor) {
            $toggler = $(`[data-anchor='${anchor}']`);
            $toggler.find('.td-description').addClass('active'); // toggle open description
            $toggler.find('.td-list').removeClass('active');
            $toggler.find('.toggler').addClass('open');
        }
        $('.toggler').on('click', (e) => {
            if ($(e.target)[0].nodeName === 'A') return;
            e.preventDefault();
            $toggler = $(e.target).closest('.toggler');
            $toggler.children().toggleClass('active');
            $toggler.toggleClass('open');
        });
        showCashierNote();
    };

    const showCashierNote = () => {
        // TODO: remove `wait` & residence check to release to all countries
        BinarySocket.wait('authorize').then(() => {
            $('.cashier_note').setVisibility(
                Client.isLoggedIn() &&                          // only show to logged-in clients
                !Client.get('is_virtual') &&                    // only show to real accounts
                !isCryptocurrency(Client.get('currency'))       // only show to fiat currencies
            );
        });
    };

    const displayTopUpButton = () => {
        BinarySocket.wait('balance').then((response) => {
            const el_virtual_topup_info = getElementById('virtual_topup_info');
            const balance   = +response.balance.balance;
            const can_topup = balance <= 1000;
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
            el_virtual_topup_info.innerText = can_topup
                ? localize('Your virtual account balance is currently [_1] or less. You may top up your account with an additional [_2].', [`${Client.get('currency')} 1,000.00`, `${Client.get('currency')} 10,000.00`])
                : localize('You can top up your virtual account with an additional [_1] if your balance is [_2] or less.', [`${Client.get('currency')} 10,000.00`, `${Client.get('currency')} 1,000.00`]);
            $a.replaceWith($('<a/>', new_el));
            $(top_up_id).parent().setVisibility(1);
        });
    };

    const showCurrentCurrency = (currency) => {
        const el_acc_currency     = getElementById('account_currency');
        const el_currency_image   = getElementById('account_currency_img');
        const el_current_currency = getElementById('account_currency_current');
        const el_current_hint     = getElementById('account_currency_hint');

        // Set messages based on if currency is crypto or fiat
        const currency_message    = isCryptocurrency(currency)
            ? localize('This is your [_1] account.', `${currency}`)
            : localize('Your fiat account’s currency is currently set to [_1].', `${currency}`);
        const currency_hint       = isCryptocurrency(currency)
            ? localize('Don\'t want to trade in [_1]? You can open another cryptocurrency account. [_2]Manage your accounts[_3].', [`${currency}`, `<a href=${urlFor('user/accounts')}>`, '</a>'])
            : localize('You can set a new currency before you deposit for the first time. [_1]Manage your accounts[_2].', [`<a href=${urlFor('user/accounts')}>`, '</a>']);

        elementInnerHtml(el_current_currency, currency_message);
        elementInnerHtml(el_current_hint, currency_hint);
        el_currency_image.src = `/images/pages/cashier/icons/icon-${currency}.svg`;

        el_acc_currency.setVisibility(1);
    };

    const onLoad = () => {
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then(() => {
                const residence = Client.get('residence');
                const currency  = Client.get('currency');

                if (Client.get('is_virtual')) {
                    displayTopUpButton();
                } else {
                    showCurrentCurrency(currency);
                }

                if (residence) {
                    BinarySocket.send({ paymentagent_list: residence }).then((response) => {
                        const list = getPropertyValue(response, ['paymentagent_list', 'list']);
                        if (list && list.length) {
                            const regex_currency = new RegExp(currency);
                            if (!/^UST$/.test(currency) || list.find(pa => regex_currency.test(pa.currencies))) {
                                $('#payment-agent-section').setVisibility(1);
                            }
                        }
                    });
                }
                $(isCryptocurrency(currency) ? '.crypto_currency' : '.normal_currency').setVisibility(1);
                if (/^BCH/.test(currency)) {
                    getElementById('message_bitcoin_cash').setVisibility(1);
                }
            });
        }
        showContent();
    };

    return {
        onLoad,
        PaymentMethods: {
            onLoad: () => {
                showContent();
            },
        },
    };
})();

module.exports = Cashier;
