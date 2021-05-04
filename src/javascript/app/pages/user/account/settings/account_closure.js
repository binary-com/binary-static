const getAllCurrencies             = require('../../get_currency').getAllCurrencies;
const getCurrenciesOfOtherAccounts = require('../../get_currency').getCurrenciesOfOtherAccounts;
const Metatrader                   = require('../../metatrader/metatrader');
const BinarySocket                 = require('../../../../base/socket');
const Client                       = require('../../../../base/client');
const Currency                     = require('../../../../common/currency');
const localize                     = require('../../../../../_common/localize').localize;
const Url                          = require('../../../../../_common/url');
const isCryptocurrency             = require('../../../../../_common/base/currency_base').isCryptocurrency;
const hasAccountType               = require('../../../../../_common/base/client_base').hasAccountType;
const hasCurrencyType              = require('../../../../../_common/base/client_base').hasCurrencyType;
const hasOnlyCurrencyType          = require('../../../../../_common/base/client_base').hasOnlyCurrencyType;

const AccountClosure = (() => {
    const form_selector = '#form_closure';
    let $form,
        $txt_other_reason,
        $closure_loading,
        $submit_loading,
        $closure_container,
        $trading_limit,
        $real_unset,
        $fiat_1,
        $fiat_2,
        $crypto_1,
        $crypto_2,
        $virtual,
        $success_msg,
        $error_msg;

    const onLoad = () => {
        $txt_other_reason   = $('#other_reason');
        $closure_loading    = $('#closure_loading');
        $submit_loading     = $('#submit_loading');
        $closure_container  = $('#closure_container');
        $success_msg        = $('#msg_main');
        $error_msg          = $('#msg_form');
        $trading_limit      = $('.trading_limit');
        $virtual            = $('.virtual');
        $crypto_1           = $('.crypto_1');
        $crypto_2           = $('.crypto_2');
        $real_unset         = $('.real_unset');
        $fiat_1             = $('.fiat_1');
        $fiat_2             = $('.fiat_2');
        $form               = $(form_selector);

        $closure_loading.setVisibility(1);

        const is_virtual        = !hasAccountType('real');
        const is_svg            = Client.get('landing_company_shortcode') === 'svg';
        const has_trading_limit = hasAccountType('real');
        const is_real_unset     = hasOnlyCurrencyType('unset');
        const is_fiat           = hasOnlyCurrencyType('fiat');
        const is_crypto         = hasOnlyCurrencyType('crypto');
        const is_both           = hasCurrencyType('fiat') && hasCurrencyType('crypto');
        const current_email     = Client.get('email');
        const current_currency  = Client.get('currency');

        BinarySocket.wait('landing_company').then((response) => {
            const currencies = getAllCurrencies(response.landing_company);
            const other_currencies = getCurrenciesOfOtherAccounts(true);

            if (is_virtual) {
                $virtual.setVisibility(1);
                currencies.forEach((currency) => {
                    $virtual.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                });

            } else {
                if (has_trading_limit) {
                    $trading_limit.setVisibility(1);
                    $('#closing_steps').setVisibility(1);
                }
                if (is_real_unset) {
                    $real_unset.setVisibility(1);
                    $trading_limit.setVisibility(0);
                    currencies.forEach((currency) => {
                        let is_allowed = true;
                        other_currencies.forEach((other_currency) => {
                            if (currency === other_currency) {
                                is_allowed = false;
                            }
                        });
                        if (is_allowed) {
                            $real_unset.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                        }
                    });
                }
                if (is_fiat) {
                    $fiat_1.setVisibility(1);
                    if (is_svg) {
                        $fiat_2.setVisibility(1);
                    }

                    let fiat_currency = Client.get('currency');

                    if (Client.get('is_virtual')) {
                        other_currencies.forEach((currency) => {
                            if (!isCryptocurrency(currency)) {
                                fiat_currency = currency;
                            }
                        });
                    }

                    $('#current_currency_fiat').text(fiat_currency);
                    $('.current_currency').text(fiat_currency);

                    currencies.forEach((currency) => {
                        let is_allowed = true;
                        other_currencies.forEach((other_currency) => {
                            if (currency === other_currency) {
                                is_allowed = false;
                            }
                        });
                        if (is_allowed) {
                            if (isCryptocurrency(currency)) {
                                $fiat_2.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                            } else {
                                $fiat_1.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                            }
                        }
                    });
                }

                if (is_crypto) {
                    $crypto_1.setVisibility(1);
                    if (is_svg) {
                        $crypto_2.setVisibility(1);
                    }

                    let crypto_currencies = '';
                    let has_all_crypto = true;
                    let crypto_numbers = 0;

                    if (!Client.get('is_virtual')) {
                        crypto_currencies = Client.get('currency');
                        crypto_numbers++;
                    }

                    other_currencies.forEach((currency) => {
                        if (isCryptocurrency(currency)) {
                            crypto_numbers++;
                            if (!crypto_currencies) {
                                crypto_currencies += currency;
                            } else {
                                crypto_currencies += `, ${currency}`;
                            }
                        }
                    });

                    if (crypto_numbers > 1) {
                        crypto_currencies += ` ${localize('accounts')}`;
                    } else {
                        crypto_currencies += ` ${localize('account')}`;
                    }

                    $('.current_currency').text(crypto_currencies);
                    $('#current_currency_crypto').text(crypto_currencies);
                    currencies.forEach((currency) => {
                        let is_allowed = true;
                        other_currencies.forEach((other_currency) => {
                            if (currency === other_currency) {
                                is_allowed = false;
                            }
                        });
                        if (is_allowed) {
                            if (isCryptocurrency(currency)) {
                                has_all_crypto = false;
                                $crypto_2.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                            } else {
                                $crypto_1.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                            }
                        }
                    });

                    if (has_all_crypto) {
                        $crypto_2.setVisibility(0);
                    }
                }

                if (is_both) {
                    $fiat_1.setVisibility(1);
                    if (is_svg) {
                        $crypto_2.setVisibility(1);
                    }

                    let crypto_currencies = '';
                    let has_all_crypto = true;
                    let crypto_numbers = 0;

                    if (isCryptocurrency(current_currency)) {
                        crypto_currencies = Client.get('currency');
                        crypto_numbers++;
                        other_currencies.forEach(currency => {
                            if (isCryptocurrency(currency)) {
                                crypto_currencies += `, ${currency}`;
                                crypto_numbers++;
                            } else {
                                $('#current_currency_fiat').text(currency);
                                $('.current_currency').text(currency);
                            }
                        });
                        if (crypto_numbers > 1) {
                            crypto_currencies += ` ${localize('accounts')}`;
                        } else {
                            crypto_currencies += ` ${localize('account')}`;
                        }
                        $('#current_currency_crypto').text(crypto_currencies);
                    } else {
                        let fiat_currency = '';

                        if (Client.get('is_virtual')) {
                            other_currencies.forEach((currency) => {
                                if (isCryptocurrency(currency)) {
                                    crypto_numbers++;
                                    if (!crypto_currencies) {
                                        crypto_currencies += currency;
                                    } else {
                                        crypto_currencies += `, ${currency}`;
                                    }
                                } else {
                                    fiat_currency = currency;
                                    // eslint-disable-next-line
                                    if (Client.get('is_virtual')) {
                                        fiat_currency = currency;
                                    } else {
                                        fiat_currency = current_currency;
                                    }
                                }
                            });
                        } else {
                            other_currencies.forEach((currency) => {
                                if (isCryptocurrency(currency)) {
                                    crypto_numbers++;
                                    if (!crypto_currencies) {
                                        crypto_currencies += currency;
                                    } else {
                                        crypto_currencies += `, ${currency}`;
                                    }
                                }
                            });

                            fiat_currency = current_currency;
                        }

                        if (crypto_numbers > 1) {
                            crypto_currencies += ` ${localize('accounts')}`;
                        } else {
                            crypto_currencies += ` ${localize('account')}`;
                        }

                        $('#current_currency_fiat').text(fiat_currency);
                        $('.current_currency').text(fiat_currency);
                        $('#current_currency_crypto').text(crypto_currencies);
                    }

                    currencies.forEach((currency) => {
                        let is_allowed = true;
                        other_currencies.forEach((other_currency) => {
                            if (currency === other_currency) {
                                is_allowed = false;
                            }
                        });
                        if (is_allowed) {
                            if (isCryptocurrency(currency)) {
                                has_all_crypto = false;
                                $crypto_2.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                            } else {
                                $fiat_1.find('ul').append(`<li>${Currency.getCurrencyFullName(currency)}</li>`);
                            }
                        }
                    });

                    if (has_all_crypto) {
                        $crypto_2.setVisibility(0);
                    }

                }

                BinarySocket.send({ statement: 1, limit: 1 });
                BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(async () => {
                    const is_eligible = await Metatrader.isEligible();
                    if (is_eligible) {
                        $('.metatrader-link').setVisibility(1);
                    }

                });
            }

            $('#current_email').text(current_email);
            $closure_loading.setVisibility(0);

            $closure_container.setVisibility(1);
        }).catch((error) => {
            showFormMessage(error.message);
            $closure_loading.setVisibility(0);
            $closure_container.setVisibility(1);
        });

        $('#closure_accordion').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : true,
        });
        const $account_closure_warning = $('#account_closure_warning');
        const $account_closure_error = $('#account_closure_error');

        const hideDialogs = () => {
            $account_closure_warning.setVisibility(0);
            $account_closure_error.setVisibility(0);
        };

        hideDialogs();

        $('.back').on('click', () => {
            hideDialogs();
        });

        $('#deactivate').on('click', () => {
            $account_closure_warning.setVisibility(0);
            submitForm($account_closure_error);
        });

        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            if (getReason()) {
                $account_closure_warning.setVisibility(1);
            }
        });

        $txt_other_reason.setVisibility(0);

        $txt_other_reason.on('keyup', () => {
            const input = $txt_other_reason.val();
            if (input && validateReasonTextField(false)) {
                $txt_other_reason.removeClass('error-field');
                $error_msg.css('display', 'none');
            }
        });
        $('#reason input[type=radio]').on('change', (e) => {
            const { value } = e.target;

            if (value === 'other') {
                $txt_other_reason.setVisibility(1);
            } else {
                $txt_other_reason.setVisibility(0);
                $txt_other_reason.removeClass('error-field');
                $txt_other_reason.val('');
                $error_msg.css('display', 'none');
            }
        });
    };

    const submitForm = ($account_closure_error) => {
        const $btn_submit = $form.find('#btn_submit');
        $submit_loading.setVisibility(1);
        $btn_submit.attr('disabled', true);

        const data  = { account_closure: 1, reason: getReason() };
        BinarySocket.send(data).then(async (response) => {
            if (response.error) {
                $submit_loading.setVisibility(0);
                if (response.error.details) {
                    await showErrorPopUp(response, $account_closure_error);
                    $account_closure_error.setVisibility(1);
                } else {
                    showFormMessage(response.error.message || localize('Sorry, an error occurred while processing your request.'));
                }
                $btn_submit.attr('disabled', false);
            } else {
                $submit_loading.setVisibility(0);
                $closure_container.setVisibility(0);
                $success_msg.setVisibility(1);
                $.scrollTo(0, 500);

                sessionStorage.setItem('closingAccount', 1);
                setTimeout(() => {
                    // we need to clear all stored client data by performing a logout action and then redirect to home
                    // otherwise it will think that client is still logged in and redirect to trading page
                    Client.sendLogoutRequest(false, Url.urlFor('home'));
                }, 10000);
            }
        });
    };

    const showErrorPopUp = async (response, $account_closure_error) => {
        const mt5_login_list = (await BinarySocket.wait('mt5_login_list')).mt5_login_list;
        // clear all previously added details first
        $account_closure_error.find('.account-closure-details').remove();
        const $parent = $('<div/>', { class: 'gr-padding-10 gr-child account-closure-details' });
        let section_id = '';
        let display_name = '';
        const addSection = (account, info) => {
            const $section = $parent.clone();
            $section
                .append($('<div />')
                    .append($('<strong />', { text: display_name }))
                    .append($('<div />', { text: account.replace(/^MT[DR]?/i, '') })))
                .append($('<span />', { text: info }));
            $account_closure_error.find(section_id).setVisibility(1).append($section);
        };
        const getMTDisplay = (account) => {
            const mt5_account = (mt5_login_list.find(acc => acc.login === account) || {});
            const market_type = mt5_account.market_type === 'synthetic' ? 'gaming' : mt5_account.market_type;
            return Client.getMT5AccountDisplays(market_type, mt5_account.sub_account_type).short;
        };
        if (response.error.details.open_positions) {
            Object.keys(response.error.details.open_positions).forEach((account) => {
                const txt_positions = `${response.error.details.open_positions[account]} position(s)`;
                if (/^MT/.test(account)) {
                    section_id = '#account_closure_open_mt';
                    display_name = getMTDisplay(account);
                } else {
                    section_id = '#account_closure_open';
                    display_name = Client.get('currency', account);
                }
                addSection(account, txt_positions);
            });
        }
        if (response.error.details.balance) {
            Object.keys(response.error.details.balance).forEach((account) => {
                const txt_balance = `${response.error.details.balance[account].balance} ${response.error.details.balance[account].currency}`;
                if (/^MT/.test(account)) {
                    section_id = '#account_closure_balance_mt';
                    display_name = getMTDisplay(account);
                } else {
                    section_id = '#account_closure_balance';
                    display_name = Currency.getCurrencyName(response.error.details.balance[account].currency);
                }
                addSection(account, txt_balance);
            });
        }
    };

    const showFormMessage = (localized_msg, scroll_on_error) => {
        if (scroll_on_error) $.scrollTo($('#reason'), 500, { offset: -20 });
        $error_msg
            .attr('class', 'errorfield')
            .html(localized_msg)
            .css('display', 'block');
    };

    const validateReasonTextField = (scroll_on_error) => {
        const other_reason_input = $txt_other_reason.val();

        if (!other_reason_input) {
            $txt_other_reason.addClass('error-field');
            showFormMessage(localize('Please specify the reasons for closing your accounts'), scroll_on_error);
            return false;
        } else if (other_reason_input.length < 5 || other_reason_input.length > 250) {
            $txt_other_reason.addClass('error-field');
            showFormMessage(localize('The reason should be between 5 and 250 characters'), scroll_on_error);
            return false;
        } else if (!/^[0-9A-Za-z .,'-]{5,250}$/.test(other_reason_input)) {
            $txt_other_reason.addClass('error-field');
            showFormMessage(localize('Only letters, numbers, space, hyphen, period, comma, and apostrophe are allowed.'), scroll_on_error);
            return false;
        }
        return true;
    };

    const getReason = () => {
        const $selected_reason   = $('#reason input[type=radio]:checked');
        const reason_radio_val   = $selected_reason.val();
        const reason_radio_id    = $selected_reason.attr('id');
        const reason_radio_text  = $(`label[for=${reason_radio_id }]`).text();
        const other_reason_input = $txt_other_reason.val();

        if (reason_radio_val) {
            if (reason_radio_val === 'other') {
                if (validateReasonTextField(true)){
                    return other_reason_input;
                }
                return false;
            }
            return reason_radio_text;
        }
        showFormMessage(localize('Please select a reason.'));
        return false;
    };

    return {
        onLoad,
    };
})();

module.exports = AccountClosure;
