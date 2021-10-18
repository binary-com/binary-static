const getCurrencies    = require('../user/get_currency').getCurrencies;
const Client           = require('../../base/client');
const BinarySocket     = require('../../base/socket');
const Currency         = require('../../common/currency');
const elementInnerHtml = require('../../../_common/common_functions').elementInnerHtml;
const getElementById   = require('../../../_common/common_functions').getElementById;
const localize         = require('../../../_common/localize').localize;
const State            = require('../../../_common/storage').State;
const Url              = require('../../../_common/url');
const getPropertyValue = require('../../../_common/utility').getPropertyValue;
const Dialog           = require('../../common/attach_dom/dialog');
const BinaryPjax       = require('../../base/binary_pjax');
const Accounts         = require('../user/accounts');
const Header           = require('../../base/header');
const isEuCountry      = require('../../common/country_base').isEuCountry;

const Cashier = (() => {
    let href = '';
    const default_virtual_balance = 10000;

    const showContent = () => {
        Client.activateByClientType();
        const anchor = Url.paramsHash().anchor;
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
                Client.isLoggedIn()                         // only show to logged-in clients
            );
        });
    };

    const setP2PVisibility = async () => {
        const is_agent = !(await BinarySocket.send({ p2p_agent_info: 1 })).error;
        if (is_agent) {
            $('#dp2p_info').setVisibility(1);
            return;
        }

        const has_offer = await checkP2PHasOffer();
        if (has_offer) {
            $('#dp2p_info').setVisibility(1);
        }
    };

    const checkP2PHasOffer = () => new Promise(async (resolve) => {
        const offer_list_response = await BinarySocket.send({ p2p_offer_list: 1 });
        resolve(getPropertyValue(offer_list_response, ['p2p_offer_list', 'list']).length);
    });

    const isDefaultVirtualBalance = () => +Client.get('balance') === default_virtual_balance;

    const displayResetButton = () => {
        const el_virtual_topup_info = getElementById('virtual_topup_info');
        const top_up_id = '#VRT_topup_link';
        const $a        = $(top_up_id);
        if (!$a) return;
        const new_el    = { class: 'toggle button', html: $a.html(), id: $a.attr('id') };
        href            = href || Url.urlFor('/cashier/top_up_virtualws');
        new_el.href     = href;
        if (isDefaultVirtualBalance()) {
            new_el.class = 'toggle button button-disabled';
            new_el.href = '';
        }
        el_virtual_topup_info.innerText = localize('Reset the balance of your demo account to [_1] anytime.', [`${Client.get('currency')} 10,000.00`]);
        $a.replaceWith($('<a/>', new_el));
        $(top_up_id).parent().setVisibility(1);
    };

    const showCurrentCurrency = (currency, statement, mt5_logins) => {
        const has_no_mt5          = mt5_logins.length === 0;
        const has_no_transaction  = (statement.count === 0 && statement.transactions.length === 0);
        const el_acc_currency     = getElementById('account_currency');
        const el_currency_image   = getElementById('account_currency_img');
        const el_current_currency = getElementById('account_currency_current');
        const el_current_hint     = getElementById('account_currency_hint');
        const upgrade_info        = Client.getUpgradeInfo();
        const can_change          = Client.canChangeCurrency(statement, mt5_logins);
        const has_upgrade         = upgrade_info.can_upgrade || upgrade_info.can_open_multi
                                    || can_change;
        const account_action_text = has_upgrade ? `<br />${localize('[_1]Manage your accounts[_2]', [`<a href=${Url.urlFor('user/accounts')}>`, '</a>'])}` : '';
        const is_iom_client       = Client.get('residence') === 'im' || State.getResponse('website_status.clients_country') === 'im';
        const change_text_for_iom = is_iom_client ? localize('time') : localize('time or create an MT5 account');
        const url_user_account    = `<a href=${Url.urlFor('user/accounts')}>`;

        const missingCriteria = (has_mt5, has_transaction) => {
            const existing_mt5_msg          = localize('You can no longer change the currency because you\'ve created an MT5 account.') + account_action_text;
            const existing_transaction_msg  = localize('You can no longer change the currency because you\'ve made a first-time deposit.') + account_action_text;

            return has_mt5 && !has_transaction ? existing_mt5_msg : existing_transaction_msg;
        };

        // Set messages based on currency being crypto or fiat
        // If fiat, set message based on if they're allowed to change currency or not
        // Condition is to have no MT5 accounts *and* have no transactions
        const currency_message = Currency.isCryptocurrency(currency)
            ? localize('This is your [_1] account.', `${Currency.getCurrencyDisplayCode(currency)}`)
            : has_no_mt5 && has_no_transaction
                ? localize('Your fiat account\'s currency is currently set to [_1].', `${currency}`)
                : localize('Your fiat account\'s currency is set to [_1].', `${currency}`);

        const currency_hint = Currency.isCryptocurrency(currency)
            ? localize('Don\'t want to trade in [_1]? You can open another cryptocurrency account.', `${Currency.getCurrencyDisplayCode(currency)}`) + account_action_text
            : has_no_mt5 && has_no_transaction
                ? localize('You can [_1]set a new currency[_2] before you deposit for the first [_3].', [can_change ? url_user_account : '', can_change ? '</a>' : '', change_text_for_iom])
                : missingCriteria(!has_no_mt5, !has_no_transaction);

        elementInnerHtml(el_current_currency, currency_message);
        elementInnerHtml(el_current_hint, currency_hint);
        el_currency_image.src = Url.urlForStatic(`/images/pages/cashier/icons/icon-${currency}.svg`);

        const available_currencies  = getCurrencies(State.getResponse('landing_company'));

        const has_more_crypto = (available_currencies.find(cur => Currency.isCryptocurrency(cur)) || []).length > 0;

        const show_current_currency = !Currency.isCryptocurrency(currency) ||
            (Currency.isCryptocurrency(currency) && has_more_crypto);

        el_acc_currency.setVisibility(show_current_currency);
    };

    const setCryptoMinimumWithdrawal = () => {
        BinarySocket.wait('website_status').then((response) => {
            $('#cryptocurrency tbody tr').each(function () {
                const $row = $(this);
                const $columns = $row.find('td:nth-child(2) div:nth-child(2)');

                const $crypto_min_withdrawal = $columns.find('span[data-currency]');
                const shortname = $crypto_min_withdrawal.attr('data-currency');

                if (shortname && $crypto_min_withdrawal) {
                    const minimum_withdrawal = getPropertyValue(response, ['website_status', 'crypto_config', shortname, 'minimum_withdrawal']);

                    let to_fixed = 0;
                    // cut long numbers off after two non-zero decimals
                    // examples: 0.00123456 -> 0.0012, 0.01234567 -> 0.012, 0.12345678 -> 0.12, 0.00102345 -> 0.00102
                    // first check if number has any decimal places
                    if (/\./.test(minimum_withdrawal)) {
                        let count_non_zero = 0;

                        // change number to string so we can use split on it
                        // split by . separator to only parse the decimal places
                        // split to array so we can parse each number one by one
                        const array_decimals = minimum_withdrawal.toString().split('.')[1].split('');

                        to_fixed = array_decimals.findIndex((n) => {
                            // if current number is not a zero
                            // and we have parsed more than 2 non-zero numbers
                            // cut off the number here
                            if (+n !== 0 && count_non_zero >= 2) {
                                return true;
                            }
                            // otherwise add to the count if current number is not zero and move to the next number
                            if (+n !== 0) {
                                count_non_zero += 1;
                            }
                            return false;
                        });
                    }
                    // if there is not more than 2 non-zero decimals
                    // don't cut off the number
                    const min_withdrawal = to_fixed === -1 ? minimum_withdrawal : minimum_withdrawal.toFixed(to_fixed);
                    $crypto_min_withdrawal.text(min_withdrawal);
                }
            });
        });
    };

    const setBtnDisable = selector => $(selector).addClass('button-disabled').click(false);

    const applyStateLockLogic = (status, deposit, withdraw) => {
        const is_uk_client = Client.get('residence') === 'gb';

        // statuses to check with their corresponding selectors
        const statuses_to_check = [
            { lock: 'cashier_locked', selectors: is_uk_client ? [withdraw] : [deposit, withdraw] },
            { lock: 'deposit_locked', selectors: [deposit] },
            { lock: 'withdrawal_locked', selectors: [withdraw] },
            { lock: 'no_withdrawal_or_trading', selectors: [withdraw] },
            { lock: 'unwelcome', selectors: [deposit] },
        ];
        statuses_to_check.forEach(item => {
            if (status.includes(item.lock)) {
                item.selectors.forEach(selector => setBtnDisable(selector));
            }
        });
    };

    const checkStatusIsLocked = ({ status }) => {
        applyStateLockLogic(status, '.deposit_btn_cashier', '.withdraw_btn_cashier');
    };

    const checkLockStatusPA = () => {
        BinarySocket.wait('get_account_status').then(() => {
            const { status } = State.getResponse('get_account_status');
            applyStateLockLogic(status, '.deposit', '.withdraw');
        });
    };

    const switchToAccount = (account_type, transaction_type, fiat_account) => {
        const ok_text = localize('Switch account');
        const fiat_currency = Client.get('currency', fiat_account);
        let localized_title = '';
        let localized_message = '';

        if (account_type === 'fiat') {
            localized_title = localize('Switch account?');
            if (transaction_type === 'deposit') {
                localized_message = localize('To deposit money, please switch to your [_1] account.', fiat_currency);
            } else {
                localized_message = localize('To withdraw money, please switch to your [_1] account.', fiat_currency);
            }
        } else {
            localized_title = localize('Switch to crypto account?');
            if (transaction_type === 'deposit') {
                localized_message = localize('To deposit cryptocurrency, switch your account.');
            } else {
                localized_message = localize('To withdraw cryptocurrency, switch your account.');
            }
        }

        BinarySocket.send({ authorize: 1 }).then(() => {
            Dialog.confirm({
                id          : 'deposit_currency_change_popup_container',
                ok_text,
                ok_class    : 'switch-ok-btn',
                cancel_text : localize('Cancel'),
                cancel_class: 'switch-cancel-btn',
                localized_title,
                localized_message,
                onConfirm   : () => {
                    if (account_type === 'fiat') {
                        Header.switchLoginid(fiat_account, transaction_type);
                    } else {
                        Accounts.showCurrencyPopUp('switch', transaction_type, false, true);
                    }
                },
                onAbort: () => BinaryPjax.load(Url.urlFor('cashier')),
            });
        
        });
    };

    const onLoad = () => {
        const is_virtual = Client.get('is_virtual');
        if (is_virtual && isDefaultVirtualBalance()) {
            getElementById('VRT_topup_link').classList.add('button-disabled');
        }
        if (Client.isLoggedIn()) {
            BinarySocket.send({ statement: 1, limit: 1 });
            BinarySocket.wait('authorize', 'mt5_login_list', 'statement', 'get_account_status', 'landing_company').then(() => {
                if (!is_virtual) checkStatusIsLocked(State.getResponse('get_account_status'));
                const residence  = Client.get('residence');
                const currency   = Client.get('currency');
                if (is_virtual) {
                    displayResetButton();
                } else if (currency) {
                    const is_p2p_allowed_currency = currency === 'USD';
                    const is_show_dp2p = /show_dp2p/.test(window.location.hash);

                    showCurrentCurrency(
                        currency,
                        State.getResponse('statement'),
                        State.getResponse('mt5_login_list')
                    );
                    if (is_p2p_allowed_currency && is_show_dp2p) {
                        setP2PVisibility();
                    }
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

                const has_fiat_account = Client.hasCurrencyType('fiat');
                const has_crypto_account = Client.hasCurrencyType('crypto');
                const is_cryptocurrency_account = Currency.isCryptocurrency(currency);
                const is_virtual_account = Client.get('is_virtual');
                const el_fiat_deposit = $('#fiat_deposit_link');
                const el_fiat_withdraw = $('#fiat_withdraw_link');
                const el_crypto_deposit = $('#crypto_deposit_link');
                const el_crypto_withdraw = $('#crypto_withdraw_link');
                const el_paymentmethod_deposit = $('#payment_agent_deposit_link');
                const el_paymentmethod_withdraw  = $('#payment_agent_withdraw_link');
                if (!isEuCountry()) {
                    $('.crypto_currency').setVisibility(1);
                    $('#payment-agent-section').setVisibility(1);
                }

                if (is_virtual_account || is_cryptocurrency_account) {
                    $('.normal_currency').setVisibility(1);
                    $('.payment-agent-section').setVisibility(1);
                    if (has_fiat_account) {
                        el_fiat_deposit.on('click', () => {
                            switchToAccount('fiat', 'deposit', has_fiat_account);
                            return false;
                        });
                        el_fiat_withdraw.on('click', () => {
                            switchToAccount('fiat', 'withdrawal', has_fiat_account);
                            return false;
                        });
                    } else {
                        el_fiat_deposit.on('click', ()=>{
                            Accounts.showCurrencyPopUp('create', 'deposit', true);
                            return false;
                        });
                        el_fiat_withdraw.on('click', ()=>{
                            Accounts.showCurrencyPopUp('create', 'withdrawal', true);
                            return false;
                        });
                    }
                } else {
                    $('.normal_currency').setVisibility(1);
                    el_fiat_deposit.attr('href',`${Url.urlFor('cashier/forwardws')}?action=deposit`);
                    el_fiat_withdraw.attr('href',`${Url.urlFor('cashier/forwardws')}?action=withdraw`);
                }

                if (is_virtual_account || !is_cryptocurrency_account){
                    $('.normal_currency').setVisibility(1);
                    if (has_crypto_account) {
                        el_crypto_deposit.on('click', () => {
                            switchToAccount('crypto', 'deposit');
                            return false;
                        });
                        el_crypto_withdraw.on('click', () => {
                            switchToAccount('crypto', 'withdrawal');
                            return false;
                        });
                    } else {
                        el_crypto_deposit.on('click', ()=>{
                            Accounts.showCurrencyPopUp('create', 'deposit', false, true);
                            return false;
                        });
                        el_crypto_withdraw.on('click', ()=>{
                            Accounts.showCurrencyPopUp('create', 'withdrawal', false, true);
                            return false;
                        });
                    }
                } else {
                    $('.normal_currency').setVisibility(1);
                    el_crypto_deposit.on('click', ()=>{
                        Accounts.showCurrencyPopUp('switch', 'deposit', false, true);
                        return false;
                    });
                    el_crypto_withdraw.on('click', ()=>{
                        Accounts.showCurrencyPopUp('switch', 'withdrawal', false, true);
                        return false;
                    });
                }
              
                if (has_fiat_account || has_crypto_account){
                    el_paymentmethod_deposit.on('click', () => {
                        BinarySocket.send({ authorize: 1 }).then(() => {
                            Accounts.showCurrencyPopUp('switch', 'payment_agent_deposit', false, false);
                        });
                        return false;
                    });
                    el_paymentmethod_withdraw.on('click', () => {
                        BinarySocket.send({ authorize: 1 }).then(() => {
                            Accounts.showCurrencyPopUp('switch', 'payment_agent_withdrawal', false, false);
                        });
                        return false;
                    });
                    
                } else {
                    el_paymentmethod_deposit.on('click', () => {
                        el_paymentmethod_deposit.attr('href', Url.urlFor('/new_account/real_account'));
                    });
                    el_paymentmethod_withdraw.on('click', () => {
                        el_paymentmethod_withdraw.attr('href', Url.urlFor('/new_account/real_account'));
                    });
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
                checkLockStatusPA();
                setCryptoMinimumWithdrawal();
            },
        },
    };
})();

module.exports = Cashier;
