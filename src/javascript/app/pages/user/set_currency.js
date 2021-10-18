const moment             = require('moment');
const setIsForNewAccount = require('./account/settings/personal_details').setIsForNewAccount;
const GetCurrency        = require('./get_currency');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const Header             = require('../../base/header');
const BinarySocket       = require('../../base/socket');
const Dialog             = require('../../common/attach_dom/dialog');
const Currency           = require('../../common/currency');
const isCryptocurrency   = require('../../../_common/base/currency_base').isCryptocurrency;
const localize           = require('../../../_common/localize').localize;
const State              = require('../../../_common/storage').State;
const Url                = require('../../../_common/url');

const SetCurrency = (() => {
    let is_new_account,
        popup_action,
        onConfirmAdditional,
        $submit;

    const onLoad = async (fncOnConfirm, redirect_to, all_fiat, all_crypto) => {
        onConfirmAdditional = fncOnConfirm;
        is_new_account = localStorage.getItem('is_new_account');
        localStorage.removeItem('is_new_account');
        const el = is_new_account ? 'show' : 'hide';
        $(`#${el}_new_account`).setVisibility(1);

        const landing_company = (await BinarySocket.wait('landing_company')).landing_company;
        const { can_upgrade, type } = Client.getUpgradeInfo();
        $('#upgrade_to_mf').setVisibility(can_upgrade && type === 'financial');

        const payout_currencies = (await BinarySocket.wait('payout_currencies')).payout_currencies;
        const $currency_list    = $('.currency_list');
        const $error            = $('#set_currency').find('.error-msg');

        $('#deposit_btn').off('click dblclick').on('click dblclick', () => {
            if (popup_action) {
                cleanupPopup();
            }
            BinaryPjax.load(`${Url.urlFor('cashier/forwardws')}?action=deposit`);
        });
        $('#maybe_later_btn').off('click dblclick').on('click dblclick', () => {
            const url = Client.isAccountOfType('financial') ? Url.urlFor('user/metatrader') : Client.defaultRedirectUrl();
            BinaryPjax.load(url);
        });
        popup_action = localStorage.getItem('popup_action');
        if (Client.get('currency') || popup_action) {
            if (is_new_account) {
                $('#set_currency_loading').remove();
                $('#set_currency').setVisibility(1);
                $('#deposit_row').setVisibility(1);
                $('#congratulations_message').html(localize('You have added a [_1] account.', [Client.get('currency')]));
            } else if (popup_action) {
                let currencies = [];

                if (/multi_account|set_currency/.test(popup_action)) {
                    currencies = getOtherCurrencies(landing_company, all_fiat, all_crypto);
                } else if (/switch_account/.test(popup_action)) {
                    currencies = getCurrentCurrencies(all_fiat, all_crypto);
                } else {
                    currencies = getCurrencyChangeOptions(landing_company);
                }

                $('#hide_new_account').setVisibility(0);

                if (currencies.length === 0){
                    return;
                }

                $(`.show_${popup_action}`).setVisibility(1);
                populateCurrencies(landing_company, currencies, all_crypto);
                onSelection($currency_list, $error, false);

                const action_map = {
                    set_currency   : localize('Set currency'),
                    change_currency: localize('Change currency'),
                    multi_account  : localize('Add account'),
                    switch_account : localize('Continue'),
                };

                $('.btn_cancel').off('click dblclick').on('click dblclick', cleanupPopup);
                $submit = $('#btn_ok');
                $submit
                    .off('click dblclick')
                    .on('click dblclick', () => {
                        if (!$submit.hasClass('button-disabled')) {
                            onConfirm($currency_list, $error, popup_action === 'multi_account', redirect_to, all_fiat, all_crypto);
                        }
                        $submit.addClass('button-disabled');
                    })
                    .find('span')
                    .text(action_map[popup_action]);
            } else {
                BinaryPjax.loadPreviousUrl();
            }
            return;
        }

        populateCurrencies(landing_company, getAvailableCurrencies(landing_company, payout_currencies), all_crypto);

        onSelection($currency_list, $error, true);
    };
    const getAvailableCurrencies = (landing_company, payout_currencies) =>
        Client.hasSvgAccount() ? GetCurrency.getCurrencies(landing_company) : payout_currencies;

    const getCurrentCurrencies = (all_fiat = false, all_crypto = false) => {
        const current_currencies = GetCurrency.getCurrenciesOfOtherAccounts(true);
        const is_virtual = Client.get('is_virtual');

        if (!is_virtual) current_currencies.push(Client.get('currency'));
        if (all_fiat) {
            return current_currencies.filter(
                currency => !isCryptocurrency(currency)
            );
        }
        if (all_crypto) {
            return current_currencies.filter(
                currency => isCryptocurrency(currency)
            );
        }
        return current_currencies;
    };

    const getOtherCurrencies = (landing_company, all_fiat = false, all_crypto = false) => {
        const allowed_currencies =  Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies');
        const current_currencies = GetCurrency.getCurrenciesOfOtherAccounts(true);
        const is_virtual = Client.get('is_virtual');

        if (!is_virtual) current_currencies.push(Client.get('currency'));
        if (all_fiat) {
            return allowed_currencies.filter(
                currency => !current_currencies.includes(currency) && !isCryptocurrency(currency)
            );
        }
        if (all_crypto) {
            return allowed_currencies.filter(
                currency => !current_currencies.includes(currency) && isCryptocurrency(currency)
            );
        }
        
        return allowed_currencies.filter(
            currency => !current_currencies.includes(currency)
        );
    };

    const getCurrencyChangeOptions = (landing_company) => {
        const allowed_currencies = Client.getLandingCompanyValue(Client.get('loginid'), landing_company, 'legal_allowed_currencies');
        const current_currencies = GetCurrency.getCurrenciesOfOtherAccounts();
        current_currencies.push(Client.get('currency'));

        return allowed_currencies.filter(
            currency => !current_currencies.includes(currency) && !isCryptocurrency(currency)
        );
    };

    const populateCurrencies = (landing_company, currencies, all_crypto) => {
        const $fiat_currencies  = $('<div/>');
        const $cryptocurrencies = $('<div/>');
        currencies.forEach((c) => {
            const $wrapper = $('<div/>', { class: 'gr-3 gr-4-m currency_wrapper', id: c });
            const $image   = $('<div/>').append($('<img/>', { src: Url.urlForStatic(`images/pages/set_currency/${c.toLowerCase()}.svg`) }));
            const $name    = $('<div/>', { class: 'currency-name' });
            const $display_name = $('<span/>', {
                text: Currency.getCurrencyName(c) || c,
                ...(/^UST$/.test(c) && {
                    'data-balloon'       : localize('Tether Omni (USDT) is a version of Tether that\'s pegged to USD and is built on the Bitcoin blockchain.'),
                    'data-balloon-length': 'medium',
                    'data-balloon-pos'   : 'top',
                    'class'              : 'show-mobile',
                }),
                ...(/^eUSDT/.test(c) && {
                    'data-balloon'       : localize('Tether ERC20 (eUSDT) is a version of Tether that\'s pegged to USD and is hosted on the Ethereum platform.'),
                    'data-balloon-length': 'medium',
                    'data-balloon-pos'   : 'top',
                    'class'              : 'show-mobile',
                }),
            });

            $name.append($display_name).append($('<br/>')).append(`(${Currency.getCurrencyDisplayCode(c)})`);

            $wrapper.append($image).append($name);
            (Currency.isCryptocurrency(c) ? $cryptocurrencies : $fiat_currencies).append($wrapper);
        });

        const fiat_currencies = $fiat_currencies.html();
        let crypto_currencies = '';
        const upgrade_info        = Client.getUpgradeInfo();
        const has_upgrade         = upgrade_info.can_upgrade || upgrade_info.can_open_multi;
        let show_add_account      = false;
             
        if (popup_action === 'switch_account') {
            if (fiat_currencies) {
                $cryptocurrencies.prepend(fiat_currencies);
            }

            if (has_upgrade){
                const $add_wrapper = $('<div/>', { class: 'gr-3 gr-4-m currency_wrapper', id: 'NEW' });
                const $add_image   = $('<div/>').append($('<img/>',  { src: Url.urlForStatic('images/pages/set_currency/add.svg') }));
                const $add_name    = $('<div/>', { class: 'currency-name' });
                const available_crypto = getOtherCurrencies(landing_company, false, true);

                if (all_crypto) {
                    if (available_crypto.length > 0) {
                        $add_name.text(localize('Add new crypto account'));
                        $add_wrapper.append($add_image).append($add_name);
                        $cryptocurrencies.append($add_wrapper);
                        show_add_account = true;
                    }
                } else {
                    $add_name.text(localize('Add new account'));
                    $add_wrapper.append($add_image).append($add_name);
                    $cryptocurrencies.append($add_wrapper);
                    show_add_account = true;
                }
            }

            crypto_currencies = $cryptocurrencies.html();
            if (crypto_currencies) {
                $('#crypto_currencies').setVisibility(0);
                $('#crypto_currency_list').html(crypto_currencies).parent().setVisibility(1);
            }
        } else {
            if (fiat_currencies) {
                $('#fiat_currencies').setVisibility(1);
                $('#fiat_currency_list').html(fiat_currencies).parent().setVisibility(1);
            }

            crypto_currencies = $cryptocurrencies.html();
            if (crypto_currencies) {
                $('#crypto_currencies').setVisibility(1);
                $('#crypto_currency_list').html(crypto_currencies).parent().setVisibility(1);
            } else {
                $('#crypto_currency_list').setVisibility(0);
            }
        }

        const has_one_group = (!fiat_currencies && crypto_currencies) || (fiat_currencies && !crypto_currencies);
        if (has_one_group) {
            if (popup_action === 'multi_account') {
                if (!fiat_currencies && crypto_currencies) {
                    $('#crypto_currencies').setVisibility(0);
                    $('#set_currency_text').text(localize('Create a cryptocurrency account'));
                    $('#set_currency_text_secondary').text(localize('Choose your preferred cryptocurrency'));
                    $('#set_currency_text_note').text(localize('You can open an account for each cryptocurrency.'));
                } else if (fiat_currencies && !crypto_currencies) {
                    $('#set_currency_text').setVisibility(0);
                    $('#set_currency_text_secondary').setVisibility(0);
                }
            } else if (popup_action === 'switch_account') {
                if (show_add_account) {
                    if (all_crypto) {
                        $('#set_currency_text').text(localize('Choose a cryptocurrency account'));
                        $('#set_currency_text_secondary').text(localize('Choose one of your accounts or add a new cryptocurrency account'));
                    } else {
                        $('#set_currency_text').text(localize('Choose an account'));
                        $('#set_currency_text_secondary').text(localize('Choose one of your accounts or add a new account'));
                    }
                } else {
                    $('#set_currency_text').text(localize('Choose an account'));
                    $('#set_currency_text_secondary').text(localize('Choose one of your accounts'));
                }
            } else if (popup_action === 'change_currency') {
                $('#fiat_currencies').find('.text').setVisibility(0);
            } else {
                $('#set_currency_text').text(localize('Please select the currency for this account:'));
            }
        } else if (popup_action === 'switch_account') {
            if (show_add_account) {
                $('#set_currency_text').text(localize('Choose an account'));
                $('#set_currency_text_secondary').text(localize('Choose one of your accounts or add a new account'));
            } else {
                $('#set_currency_text').text(localize('Choose an account'));
                $('#set_currency_text_secondary').text(localize('Choose one of your accounts'));
            }
        } else {
            $('#set_currency_text').setVisibility(0);
            $('#set_currency_text_secondary').setVisibility(0);
            $('#set_currency_text_note').setVisibility(0);
        }

        $('#set_currency_loading').remove();
        $('#set_currency, .select_currency').setVisibility(1);
    };

    const onSelection = ($currency_list, $error, should_show_confirmation) => {
        $('.currency_wrapper').off('click dblclick').on('click dblclick', function () {
            removeError($error, true);
            const $clicked_currency = $(this);
            $currency_list.find('> div').removeClass('selected');
            $clicked_currency.addClass('selected');

            if (should_show_confirmation) {
                const currency            = $clicked_currency.attr('id');
                const is_iom_client       = Client.get('residence') === 'im' || State.getResponse('website_status.clients_country') === 'im';
                const change_text_for_iom = is_iom_client ? localize('deposit') : localize('deposit or create a CFDs account');
                let localized_message     = '';
                let localized_footnote    = '';

                if (Currency.isCryptocurrency(currency)) {
                    localized_message = localize('Are you sure you want to create your [_1] account now?', `<strong>${Currency.getCurrencyName(currency)} (${Currency.getCurrencyDisplayCode(currency)})</strong>`);
                    localized_footnote = `${localize('Note:')} ${localize('You may open one account for each supported cryptocurrency.')}`;
                } else {
                    localized_message = localize('Are you sure you want to create a fiat account in [_1]?', `${currency}`);
                    localized_footnote = `${localize('Note:')} ${localize('You are limited to one fiat account. You can change the currency of your fiat account anytime before you make a first-time [_1].', change_text_for_iom)}`;
                }

                Dialog.confirm({
                    id             : 'set_currency_popup_container',
                    ok_text        : localize('Yes'),
                    cancel_text    : localize('Cancel'),
                    localized_title: localize('Create [_1] account', `${Currency.getCurrencyDisplayCode(currency)}`),
                    localized_message,
                    localized_footnote,
                    onConfirm      : () => onConfirm($currency_list, $error, false),
                    onAbort        : () => $currency_list.find('> div').removeClass('selected'),
                });
            }
        });
    };

    const onConfirm = ($currency_list, $error, should_create_account, redirect_to, all_fiat, all_crypto) => {
        removeError($error);
        const $selected_currency = $currency_list.find('.selected');
        const has_fiat_account    = Client.hasCurrencyType('fiat');

        if ($selected_currency.length) {
            const selected_currency = $selected_currency.attr('id');
            let request = {};

            if (popup_action === 'switch_account') {
                if (selected_currency === 'NEW'){
                    localStorage.setItem('popup_action', 'multi_account');
                    if (!all_fiat && !all_crypto && has_fiat_account) {
                        onLoad(null, false, false, true);
                    } else {
                        onLoad(null, false, all_fiat, all_crypto);
                    }
                } else {
                    cleanupPopup();
                    Header.switchLoginid(getLoginid(selected_currency), redirect_to, true);
                }

                return;
            }
            if (should_create_account) {
                request = populateReqMultiAccount(selected_currency);
            } else {
                request = { set_account_currency: selected_currency };
            }
            BinarySocket.send(request).then((response_c) => {
                if ($submit) {
                    $submit.removeClass('button-disabled');
                }
                if (response_c.error) {
                    if (popup_action === 'multi_account'  && /InsufficientAccountDetails|InputValidationFailed/.test(response_c.error.code)) {
                        cleanupPopup();
                        setIsForNewAccount(true);
                        // ask client to set any missing information
                        BinaryPjax.load(Url.urlFor('/new_account/real_account'));
                        localStorage.setItem('choosenCurrency', request.currency);
                        localStorage.setItem('SignAccountCurrencyForm', 'showFirstStep');
                    } else {
                        $error.text(response_c.error.message).setVisibility(1);
                    }
                } else {
                    const previous_currency = Client.get('currency');
                    // Use the client_id while creating a new account
                    const new_account_loginid = popup_action === 'multi_account' ? response_c.new_account_real.client_id : undefined;
                    Client.set('currency', selected_currency, new_account_loginid);
                    BinarySocket.send({ balance: 1 });
                    BinarySocket.send({ payout_currencies: 1 }, { forced: true });
                    Header.displayAccountStatus();

                    if (typeof onConfirmAdditional === 'function') {
                        onConfirmAdditional();
                    }

                    let redirect_url;
                    if (is_new_account) {
                        if (Client.isAccountOfType('financial')) {
                            const get_account_status = State.getResponse('get_account_status');
                            if (!/authenticated/.test(get_account_status.status)) {
                                redirect_url = Url.urlFor('user/authenticate');
                            }
                        }
                        // Do not redirect MLT clients to cashier, because they need to set self exclusion before trading
                        if (!redirect_url && /^(malta)$/i.test(Client.get('landing_company_shortcode'))) {
                            redirect_url = Url.urlFor('user/security/self_exclusionws');
                        }
                        // Do not redirect MX clients to cashier, because they need to set max limit before making deposit
                        if (!redirect_url && !/^(iom)$/i.test(Client.get('landing_company_shortcode'))) {
                            redirect_url = Url.urlFor('cashier');
                        }
                    } else if (/[set|change]_currency/.test(popup_action)) {
                        const previous_currency_display = Currency.getCurrencyDisplayCode(previous_currency);
                        const selected_currency_display = Currency.getCurrencyDisplayCode(selected_currency);
                        $('.select_currency').setVisibility(0);
                        $('#congratulations_message').html(
                            popup_action === 'set_currency' ?
                                localize('You have successfully set your account currency to [_1].', [`<strong>${selected_currency_display}</strong>`]) :
                                localize('You have successfully changed your account currency from [_1] to [_2].', [`<strong>${previous_currency_display}</strong>`, `<strong>${selected_currency_display}</strong>`])
                        );
                        $('.btn_cancel, #deposit_btn, #set_currency, #show_new_account').setVisibility(1);
                        $(`#${Client.get('loginid')}`).find('td[datath="Currency"]').text(selected_currency_display);
                    } else if (popup_action === 'multi_account') {
                        const new_account = response_c.new_account_real;
                        localStorage.setItem('is_new_account', 1);
                        cleanupPopup();
                        // add new account to store and refresh the page
                        Client.processNewAccount({
                            email       : Client.get('email'),
                            loginid     : new_account.client_id,
                            token       : new_account.oauth_token,
                            redirect_url: Url.urlFor('user/set-currency'),
                        });
                        return;
                    } else {
                        redirect_url = BinaryPjax.getPreviousUrl();
                    }

                    if (redirect_url) {
                        window.location.href = redirect_url; // load without pjax
                    } else {
                        Header.populateAccountsList(); // update account title
                        $('.select_currency').setVisibility(0);
                        $('#deposit_row').setVisibility(1);
                    }
                }
            });
        } else {
            removeError(null, true);
            $error.text(localize('Please choose a currency')).setVisibility(1);
        }
    };

    /**
     * Get login id by selected currency
     */
    const getLoginid = (selected_currency) => {
        const all_loginids = Client.getAllLoginids();
        const real_all_loginids = all_loginids.filter(loginid => !loginid.includes('VRTC'));
        let loginid = '';
        real_all_loginids.forEach((id) => {
            const currency = Client.get('currency', id);
            if (selected_currency === currency) {
                loginid = id;
            }
        });

        return loginid;
    };

    /**
     * Remove error text if $error is defined
     * Enable confirm button if is_btn_enabled is true
     *
     * @param {object} $error // error text jquery element
     * @param {boolean} is_btn_enabled // Enable button
     */
    const removeError = ($error, is_btn_enabled) => {
        if ($error) {
            $error.setVisibility(0);
        }
        if ($submit && is_btn_enabled) {
            $submit.removeClass('button-disabled');
        }
    };

    const populateReqMultiAccount = (selected_currency) => {
        const get_settings = State.getResponse('get_settings');

        const request = {
            new_account_real      : 1,
            currency              : selected_currency,
            date_of_birth         : moment.utc(+get_settings.date_of_birth * 1000).format('YYYY-MM-DD'),
            salutation            : get_settings.salutation,
            first_name            : get_settings.first_name,
            last_name             : get_settings.last_name,
            address_line_1        : get_settings.address_line_1,
            address_line_2        : get_settings.address_line_2,
            address_city          : get_settings.address_city,
            address_state         : get_settings.address_state,
            address_postcode      : get_settings.address_postcode,
            phone                 : get_settings.phone,
            account_opening_reason: get_settings.account_opening_reason,
            citizen               : get_settings.citizen,
            place_of_birth        : get_settings.place_of_birth,
            residence             : Client.get('residence'),
            ...(get_settings.tax_identification_number && {
                tax_identification_number: get_settings.tax_identification_number,
            }),
            ...(get_settings.tax_residence && {
                tax_residence: get_settings.tax_residence,
            }),
        };
        Object.keys(request).forEach(key => {
            if (!request[key] || request[key] === '') delete request[key];
        });
        return request;
    };

    const cleanupPopup = () => {
        localStorage.removeItem('popup_action');
        $('.lightbox').remove();
    };

    return {
        onLoad,
        cleanupPopup,
    };
})();

module.exports = SetCurrency;
