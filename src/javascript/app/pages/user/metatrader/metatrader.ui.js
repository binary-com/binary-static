const MetaTraderConfig = require('./metatrader.config');
const Client           = require('../../../base/client');
const BinarySocket     = require('../../../base/socket');
const Dialog           = require('../../../common/attach_dom/dialog');
const Currency         = require('../../../common/currency');
const Validation       = require('../../../common/form_validation');
const getTransferFee   = require('../../../../_common/base/currency_base').getTransferFee;
const getElementById   = require('../../../../_common/common_functions').getElementById;
const localize         = require('../../../../_common/localize').localize;
const Password         = require('../../../../_common/check_password');
const State            = require('../../../../_common/storage').State;
const urlForStatic     = require('../../../../_common/url').urlForStatic;
const getHashValue     = require('../../../../_common/url').getHashValue;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const MetaTraderUI = (() => {
    let $container,
        $list_cont,
        $mt5_account,
        $list,
        $detail,
        $action,
        $templates,
        $form,
        $main_msg,
        mt5_login_list,
        validations,
        submit,
        topup_demo,
        token,
        current_action_ui;

    const accounts_info   = MetaTraderConfig.accounts_info;
    const actions_info    = MetaTraderConfig.actions_info;
    const mt5_url         = 'https://trade.mql5.com/trade';
    const getAccountsInfo = MetaTraderConfig.getAccountsInfo;

    let disabled_signup_types = {
        'real': false,
        'demo': false,
    };

    const setDisabledAccountTypes = (disabled_types_obj) => {
        disabled_signup_types = { disabled_signup_types, ...disabled_types_obj };
    };

    const init = (submit_func, topup_demo_func) => {
        token        = getHashValue('token');
        topup_demo   = topup_demo_func;
        submit       = submit_func;
        $container   = $('#mt_account_management');
        $mt5_account = $container.find('#mt5_account');
        $list_cont   = $container.find('#accounts_list');
        $list        = $list_cont.find('> div.list');
        $detail      = $container.find('#account_details');
        $action      = $container.find('#fst_action');
        $templates   = $container.find('#templates').remove();
        $main_msg    = $container.find('#main_msg');
        $container.find('[class*="act_"]').on('click', populateForm);

        BinarySocket.wait('mt5_login_list').then(() => {
            mt5_login_list = State.getResponse('mt5_login_list');
        });

        MetaTraderConfig.setMessages($templates.find('#messages'));

        validations = MetaTraderConfig.validations();

        populateAccountTypes();
        populateAccountList();
    };

    const populateWebLinks = (server_info) => {
        const query_params = `${server_info && `?servers=${server_info.environment}&trade_server=${server_info.environment}`}`;
        const $mt5_web_link = $('.mt5-web-link');

        $mt5_web_link.attr('href', `${mt5_url}${query_params}`);
    };

    const populateTradingServers = (acc_type) => {
        const $ddl_trade_server = $form.find('#ddl_trade_server');

        $ddl_trade_server.empty();
        let account_type = acc_type || newAccountGetType();
        const num_servers = {
            disabled : 0,
            supported: 0,
            used     : 0,
        };

        State.getResponse('trading_servers').forEach(trading_server => {
            // if server is not added to account type, and in accounts_info we are not storing it with server
            if (!/\d$/.test(account_type) && !getAccountsInfo(account_type)) {
                account_type += `_${trading_server.id}`;
            }
            const new_account_info = getAccountsInfo(account_type);
            const { market_type, sub_account_type } = new_account_info;
            const { supported_accounts = [] } = trading_server;
            const is_server_supported = isSupportedServer(market_type, sub_account_type, supported_accounts);

            if (is_server_supported) {
                num_servers.supported += 1;
                const is_used_server = isUsedServer(is_server_supported, trading_server);

                const is_disabled = trading_server.disabled === 1;

                const input_attributes = {
                    disabled: is_used_server || is_disabled,
                    type    : 'radio',
                    name    : 'ddl_trade_server',
                    value   : trading_server.id,
                    ...(trading_server.recommended && !is_used_server && !is_disabled && { checked: 'checked' }),
                };

                const { region, sequence } = trading_server.geolocation;
                let label_text = sequence > 1 ? `${region} ${sequence}` : region;

                if (is_used_server) {
                    num_servers.used += 1;
                    label_text += localize(' (Region added)');
                } else if (is_disabled) {
                    num_servers.disabled += 1;
                    label_text += localize(' (Temporarily unavailable)');
                }

                $ddl_trade_server
                    .append(
                        $('<div />', { id: trading_server.id, class: 'gr-padding-10 gr-parent' })
                            .append($('<input />', input_attributes))
                            .append($('<label />', { htmlFor: trading_server.id })
                                .append($('<span />', { text: label_text }))
                            )
                    );
            }
        });

        // Check whether any of the servers is checked, if not, check one.
        if ($ddl_trade_server.find('input[checked]').length === 0) {
            $ddl_trade_server.find('input:not(:disabled):first').attr('checked', 'checked');
        }

        return num_servers;
    };

    const populateAccountList = () => {
        const $acc_name = $templates.find('> .acc-name');
        let acc_group_demo_set = false;
        let acc_group_real_set = false;
        Object.keys(accounts_info)
            .sort(sortMt5Accounts)
            .forEach((acc_type) => {
                if ($list.find(`[value="${acc_type}"]`).length === 0) {
                    if (getAccountsInfo(acc_type).is_demo) {
                        if (!acc_group_demo_set) {
                            $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_demo', text: localize('Demo Accounts') }));
                            acc_group_demo_set = true;
                        }
                    } else if (!acc_group_real_set) {
                        $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_real', text: localize('Real-Money Accounts') }));
                        acc_group_real_set = true;
                    }
                    const $acc_item = $acc_name.clone();
                    $acc_item.attr('value', acc_type);
                    $list.append($acc_item);
                }
            });

        const hideList = () => {
            $list_cont.slideUp('fast', () => { $mt5_account.removeClass('open'); });
        };

        // account switch events
        $mt5_account.off('click').on('click', (e) => {
            e.stopPropagation();
            if ($list_cont.is(':hidden')) {
                $mt5_account.addClass('open');
                $list_cont.slideDown('fast');
            } else {
                hideList();
            }
        });
        $list.off('click').on('click', '.acc-name', function () {
            if (!$(this).hasClass('disabled')) {
                setAccountType($(this).attr('value'), true);
            }
        });
        $(document).off('click.mt5_account_list').on('click.mt5_account_list', () => {
            hideList();
        });
    };

    const setAccountType = (acc_type, should_set_account) => {
        if ($mt5_account.attr('value') !== acc_type) {
            Client.set('mt5_account', acc_type);
            $mt5_account.attr('value', acc_type).removeClass('empty');
            setMTAccountText();
            $list.find('.acc-name').removeClass('selected');
            $list.find(`[value="${acc_type}"]`).addClass('selected');
            $action.setVisibility(0);
            if (should_set_account) {
                setCurrentAccount(acc_type);
                $.scrollTo($('h1'), 300, { offset: -10 });
            }
        }
    };

    const updateAccount = (acc_type, should_set_account = true) => {
        updateListItem(acc_type);
        if (should_set_account) {
            setCurrentAccount(acc_type);
            showHideFinancialAuthenticate(acc_type);
        }
    };

    const setMTAccountText = () => {
        const acc_type = $mt5_account.attr('value');
        if (acc_type) {
            const sample_account = MetaTraderConfig.getSampleAccount(acc_type);
            const display_login = getPropertyValue(sample_account, ['info', 'display_login']);
            const title = `${sample_account.title}${ display_login ? ` (${display_login})` : '' }`;
            if (!new RegExp(title).test($mt5_account.text())) {
                $mt5_account.html(title);
            }
        }
    };

    const disableButtonLink = (selector) => {
        const button_link_el = $container.find(selector);
        button_link_el.addClass('button-disabled');
        button_link_el.children('span').addClass('disabled');
    };

    const updateListItem = (acc_type) => {
        const $acc_item = $list.find(`[value="${acc_type}"]`);
        $acc_item.find('.mt-type').text(getAccountsInfo(acc_type).short_title);
        if (getAccountsInfo(acc_type).info) {
            const server_info = getAccountsInfo(acc_type).info.server_info;
            const region = server_info && server_info.geolocation.region;
            const sequence = server_info && server_info.geolocation.sequence;
            const is_synthetic = getAccountsInfo(acc_type).market_type === 'gaming' || getAccountsInfo(acc_type).market_type === 'synthetic';
            const label_text = server_info ? sequence > 1 ? `${region} ${sequence}` : region : getAccountsInfo(acc_type).info.display_server;
            setMTAccountText();
            $acc_item.find('.mt-login').text(`(${getAccountsInfo(acc_type).info.display_login})`);
            if (
                server_info &&
                is_synthetic &&
                MetaTraderConfig.hasMultipleTradeServers(acc_type, accounts_info) ||
                /unknown+$/.test(acc_type)
            ) {
                $acc_item.find('.mt-server').text(`${label_text}`);

                // add disabled style to unknown or unavailable accounts
                if (/unknown+$/.test(acc_type)) {
                    $acc_item.find('.mt-server').css({
                        'color'           : '#fff',
                        'background-color': '#dedede',
                    });
                }
            } else {
                $acc_item.find('.mt-server').remove();
            }
            $acc_item.setVisibility(1);
            if (getAccountsInfo(acc_type).is_demo) {
                $list.find('#acc_group_demo').setVisibility(1);
            } else {
                $list.find('#acc_group_real').setVisibility(1);
            }
            if (acc_type === Client.get('mt5_account')) {
                const mt_balance = Currency.formatMoney(MetaTraderConfig.getCurrency(acc_type),
                    +getAccountsInfo(acc_type).info.balance);
                $acc_item.find('.mt-balance').html(mt_balance);
                $action.find('.mt5-balance').html(mt_balance);
                const $add_region_btn = $container.find('#btn_add_region');
                $add_region_btn.setVisibility(
                    getAvailableServers(false, acc_type).length > 0 && !getAccountsInfo(acc_type).is_demo,
                );
                if (disabled_signup_types.real) {
                    $add_region_btn.addClass('button-disabled');
                }
            }
            // disable MT5 account opening if created all available accounts
            if (Object.keys(accounts_info).every(type =>
                getAccountsInfo(type).info || !MetaTraderConfig.hasTradeServers(type))) {
                $container.find('.act_new_account').remove();
            }

            // Add more trade servers button.
            $container.find('#btn_add_region').click(() => {
                if (disabled_signup_types.real) {
                    return;
                }
                const $back_button = $form.find('#view_3 .btn-back');
                const $cancel_button = $form.find('#view_3 .btn-cancel');
                const account_type = Client.get('mt5_account');
                const num_servers = populateTradingServers();

                loadAction('new_account', account_type);
                $form.find('button[type="submit"]').attr('acc_type', account_type);
                $cancel_button.setVisibility(1);
                $back_button.setVisibility(0);

                if (num_servers.supported > 1){
                    displayStep(2);
                } else {
                    displayStep(3);
                }

                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            });

        } else {
            $acc_item.setVisibility(0);
        }
        // TODO: Remove once market subtype and market types are provided by error details for inaccessible accounts
        if (acc_type.split('_')[1] === 'unknown') {
            $acc_item.addClass('disabled');
        }
    };

    const displayAccountDescription = (acc_type) => {
        const $account_desc = $templates.find('.account-desc');
        let $account_type_desc = '';
        if (acc_type) {
            $account_type_desc = $account_desc.find(`.${acc_type}`);

            const landing_company_short = MetaTraderConfig.getSampleAccount(acc_type).landing_company_short;

            if ($account_type_desc.length === 2) {
                const $specific_description = $account_desc.find(`.${acc_type}.${landing_company_short}`);

                // try to find the landing_company specific description first,
                // otherwise fall back to the first item (the general description)
                $account_type_desc = $specific_description.length ? $specific_description : $account_type_desc.first();
            }
        }
        const $el_to_clone = $account_type_desc.length ? $account_type_desc : $account_desc.find('#general_desc');
        $container.find('#account_desc').html($el_to_clone.clone());
    };

    const setCurrentAccount = async (account_type) => {
        let acc_type = await account_type;
        const current_account = await Client.get('mt5_account');

        if (current_account && current_account !== acc_type) return;

        if (current_account === 'real_unknown') {
            const default_to_other = Object.keys(accounts_info).find(account => getAccountsInfo(account).info);
            acc_type = default_to_other;
            $detail.find('.acc-info').setVisibility(1);
        }

        if (current_action_ui !== 'new_account') {
            displayAccountDescription(acc_type);
        }

        if (getAccountsInfo(acc_type).info) {
            const is_demo      = getAccountsInfo(acc_type).is_demo;
            const is_synthetic = getAccountsInfo(acc_type).market_type === 'gaming' || getAccountsInfo(acc_type).market_type === 'synthetic';
            const server_info  = getAccountsInfo(acc_type).info.server_info;
            const region = server_info && server_info.geolocation.region;
            const sequence = server_info && server_info.geolocation.sequence;
            const label_text = server_info ? sequence > 1 ? `${region} ${sequence}` : region : getAccountsInfo(acc_type).info.display_server;
            $detail.find('.real-only').setVisibility(!is_demo);
            // Update account info
            $detail.find('.acc-info div[data]').map(function () {
                const key     = $(this).attr('data');
                const info    = getAccountsInfo(acc_type).info[key];
                const mapping = {
                    balance      : () => (isNaN(info) ? '' : Currency.formatMoney(MetaTraderConfig.getCurrency(acc_type), +info)),
                    broker       : () => 'Deriv Limited',
                    display_login: () => (`${info} (${is_demo ? localize('Demo Account') : localize('Real-Money Account')})`),
                    leverage     : () => `1:${info}`,
                    server       : () => `${server_info === undefined ? 'Unavailable' : server_info && server_info.environment}`,
                    ...(
                        is_synthetic &&
                        server_info.geolocation.region &&
                        MetaTraderConfig.hasMultipleTradeServers(acc_type, accounts_info) &&
                        ({ trade_server: () => label_text })
                    ),
                };

                $container.find('#mt-trade-server-container').setVisibility(!!mapping.trade_server);
                $(this).html(typeof mapping[key] === 'function' ? mapping[key]() : info);
            });

            populateWebLinks(server_info);
            setCounterpartyAndJurisdictionTooltip($('.acc-info div[data="display_login"]'), acc_type);

            if (current_action_ui !== 'new_account') {
                $container.find('.has-account').setVisibility(1);
            }

            // we need to add a small delay to let the servers details be filled before we check their availability
            setTimeout(() => {
                $container.find('#btn_add_region').setVisibility(getAvailableServers(false, MetaTraderConfig.getCleanAccType(acc_type, 2)).length > 0 && !is_demo);
            }, 50);
        } else {
            $detail.find('.acc-info, .acc-actions').setVisibility(0);
        }
        $('#mt_loading').remove();
        $container.setVisibility(1);

        setAccountType(acc_type);

        if ($action.hasClass('invisible')) {
            loadAction(defaultAction(acc_type));
        }
    };

    const defaultAction = acc_type => {
        let type = 'new_account';
        if (getAccountsInfo(acc_type) && getAccountsInfo(acc_type).info) {
            type = (getAccountsInfo(acc_type).is_demo || Client.get('is_virtual') || getHashValue('token')) ? 'manage_password' : 'cashier';
            removeUrlHash(); // only load manage_password section on first page load if token in url, after that remove it from url
        }
        return type;
    };

    const refreshAction = () => {
        current_action_ui = null;
    };

    const loadAction = (action, acc_type, should_hide_cancel) => {
        $container.find(`[class~=act_${action || defaultAction(acc_type)}]`).click();
        if (should_hide_cancel) {
            $form.find('#view_1 .btn-cancel').hide();
            $form.find('#view_3 .btn-cancel').hide();
        }
    };

    const populateForm = (e) => {
        let $target = $(e.target);

        if ($target.hasClass('button-disabled')) {
            return;
        }

        if ($target.prop('tagName').toLowerCase() !== 'a') {
            $target = $target.parents('a');
        }
        $main_msg.setVisibility(0);

        const acc_type = Client.get('mt5_account');
        const action   = $target.attr('class').split(' ').find(c => /^act_/.test(c)).replace('act_', '');

        const cloneForm = () => {
            $form = $templates.find(`#frm_${action}`).clone();
            $form.find(`.${/demo/.test(acc_type) ? 'demo' : 'real'}-only`).setVisibility(1);
            const formValues = (actions_info[action] || {}).formValues;
            if (formValues) formValues($form, acc_type, action);

            // append form
            $action.find('#frm_action').html($form).setVisibility(1).end()
                .setVisibility(1);

            if (action === 'manage_password') {
                if (shouldSetTradingPassword()) {
                    $form.find('#new_client_message').setVisibility(1);
                } else {
                    $form.find('#existing_client_message').setVisibility(1);
                }
                $form.find('button#btn_submit_password_change[type="submit"]').append(accounts_info[acc_type].info.display_login ? ` ${localize('for account [_1]', accounts_info[acc_type].info.display_login)}` : '');
                if (!token) {
                    $form.find('#frm_verify_password_reset').setVisibility(1);
                } else if (!Validation.validEmailToken(token)) {
                    $form.find('#frm_verify_password_reset').find('#token_error').setVisibility(1).end().setVisibility(1);
                } else {
                    $form.find('#frm_password_change').setVisibility(0);
                    $form.find('#frm_password_reset').setVisibility(1);
                }
            }

            $form.find('button[type="submit"]').each(function() { // cashier has two different actions
                const this_action = $(this).attr('action');
                actions_info[this_action].$form = $(this).parents('form');
                $(this).attr({ acc_type }).on('click dblclick', submit);
                Validation.init(`#frm_${this_action}`, validations[this_action]);
            });

            handleNewAccountUI(action, acc_type, $target);
        };

        if (/new_account/.test(action)) {
            showFinancialAuthentication(false);
        }

        if (/manage_password|new_account/.test(action)) {
            cloneForm();
            return;
        }

        if (action === 'cashier') { // Manage Fund
            const client_currency = Client.get('currency');
            const mt_currency     = MetaTraderConfig.getCurrency(acc_type);
            cloneForm();
            setDemoTopupStatus();
            $form.find('.binary-account').text(`${localize('[_1] Account [_2]', ['Binary', Client.get('loginid')])}`);
            $form.find('.binary-balance').html(`${Currency.formatMoney(client_currency, Client.get('balance'))}`);
            $form.find('.mt5-account').text(`${localize('[_1] Account [_2]', [getAccountsInfo(acc_type).title, getAccountsInfo(acc_type).info.display_login])}`);
            $form.find('.mt5-balance').html(`${Currency.formatMoney(mt_currency, getAccountsInfo(acc_type).info.balance)}`);
            $form.find('label[for="txt_amount_deposit"]').append(` ${Currency.getCurrencyDisplayCode(client_currency)}`);
            $form.find('label[for="txt_amount_withdrawal"]').append(` ${mt_currency}`);

            const should_show_transfer_fee = client_currency !== mt_currency;
            if (should_show_transfer_fee) {
                $('#transfer_fee_amount_to').text(getTransferFee(client_currency, mt_currency));
                $('#transfer_fee_minimum_to').text(Currency.getMinimumTransferFee(client_currency));
                $('#transfer_fee_amount_from').text(getTransferFee(mt_currency, client_currency));
                $('#transfer_fee_minimum_from').text(Currency.getMinimumTransferFee(mt_currency));
            }
            $form.find('#txt_amount_deposit, #txt_amount_withdrawal').siblings('.hint').setVisibility(should_show_transfer_fee);

            ['deposit', 'withdrawal'].forEach((act) => {
                actions_info[act].prerequisites(acc_type).then((error_msg) => {
                    if (error_msg) {
                        $container.find(`#frm_${act} .form`).replaceWith($('<p/>', { class: 'unavailable' }));
                        displayMessage(`#frm_${act} .unavailable`, error_msg, true);
                    }
                });
            });

            if (!getAccountsInfo(acc_type).is_demo) {
                let msg = '';
                if (Client.get('is_virtual')) {
                    msg = MetaTraderConfig.needsRealMessage();
                } else if (!Client.get('currency')) { // client should set currency before accessing fund management section
                    msg = $templates.find('#msg_set_currency').html();
                }
                if (msg) {
                    displayMainMessage(msg, false);
                    $action.find('#frm_cashier').setVisibility(0);
                }
            }

            const remaining_transfers = getPropertyValue(State.getResponse('get_limits'), ['daily_transfers', 'mt5', 'available']);

            if (typeof remaining_transfers !== 'undefined') {
                const $remaining_container = $form.find('#mt5_remaining_transfers');
                $remaining_container.setVisibility(1);
                const $remaining_number = $remaining_container.find('strong');
                $remaining_number.text(remaining_transfers);
                if (+remaining_transfers) {
                    $remaining_number.removeClass('empty');
                } else {
                    $remaining_number.addClass('empty');
                }
            }

            return;
        }

        actions_info[action].prerequisites(acc_type).then((error_msg) => {
            if (error_msg) { // does not meet one of prerequisites
                displayMainMessage(error_msg);
                $action.find('#frm_action').empty().end().setVisibility(1);
                $container.find('[class*="act_"]').removeClass('selected');
                $container.find(`[class~=act_${action}]`).addClass('selected');
                return;
            }

            if (!$action.find(`#frm_${action}`).length) {
                $main_msg.setVisibility(0);
            }

            cloneForm();
        });
    };

    const getAvailableServers = (should_ignore_used = false, acc_type) =>
        State.getResponse('trading_servers').filter(trading_server => {
            if (/unknown+$/.test(acc_type)) return false;
            let account_type = acc_type || newAccountGetType();
            // if server is not added to account type, and in accounts_info we are storing it without server
            if (!/\d$/.test(account_type) && !getAccountsInfo(account_type)) {
                account_type += `_${trading_server.id}`;
            }
            const new_account_info = getAccountsInfo(account_type);
            const { supported_accounts } = trading_server;

            if (!new_account_info || !supported_accounts) {
                return false;
            }

            const { market_type, sub_account_type } = new_account_info;

            const is_server_supported = isSupportedServer(market_type, sub_account_type, supported_accounts);

            if (should_ignore_used) {
                return is_server_supported;
            }

            const is_used_server = isUsedServer(is_server_supported, trading_server);
            const is_available = trading_server.disabled !== 1;

            return is_server_supported && is_available && !is_used_server;
        });

    const isSupportedServer = (market_type, sub_account_type, supported_accounts) => {
        const is_synthetic     = (market_type === 'gaming' || market_type === 'synthetic') && sub_account_type === 'financial';
        const is_financial     = market_type === 'financial' && sub_account_type === 'financial';
        const is_financial_stp = market_type === 'financial' && sub_account_type === 'financial_stp';

        return (
            (is_synthetic && supported_accounts.includes('gaming')) ||
            (is_financial && supported_accounts.includes('financial')) ||
            (is_financial_stp && supported_accounts.includes('financial_stp'))
        );
    };

    const isUsedServer = (is_server_supported, trading_server) =>
        is_server_supported && Object.keys(accounts_info).find(account =>
            getAccountsInfo(account).info &&
            isSupportedServer(
                getAccountsInfo(account).info.market_type,
                getAccountsInfo(account).info.sub_account_type,
                trading_server.supported_accounts
            ) &&
            trading_server.id === getAccountsInfo(account).info.server
        );

    const shouldSetTradingPassword = () => {
        const { status } = State.getResponse('get_account_status');

        return Array.isArray(status) && status.includes('trading_password_required');
    };

    const displayStep = (step) => {
        const new_account_type = newAccountGetType();
        const is_demo = /demo/.test(new_account_type);
        const should_set_trading_password = shouldSetTradingPassword();
        const is_synthetic = /gaming/.test(new_account_type);
        const has_mt5_account = mt5_login_list.length > 0;

        $form.find('#msg_form').remove();
        $form.find('#mv_new_account div[id^="view_"]').setVisibility(0);
        $form.find(`#view_${step}`).setVisibility(1);
        $form.find('#view_3').find('.error-msg, .days-to-crack').setVisibility(0);

        // Show proper notice msg based on api flag
        if (should_set_trading_password) {
            $form.find('#view_3').find('#trading_password_new_user').setVisibility(1);
            if (has_mt5_account) {
                $form.find('#trading_password_input').setVisibility(0);
                $form.find('#has_mt5_new_user_btn_submit_new_account').setVisibility(1);
            } else {
                $form.find('#new_user_btn_submit_new_account').setVisibility(1);
            }
        } else {
            $form.find('#view_3').find('#trading_password_existing_user').setVisibility(1);
        }

        $form.find(`.${is_demo ? 'real' : 'demo'}-only`).setVisibility(0);

        // we do not show step 2 (servers selection) to demo and non synthetic accouns
        // as the server will be set to the closest/best suitable by API
        if (step === 2 && !is_demo && is_synthetic) {
            const num_servers = populateTradingServers();

            if (num_servers.used === 0) {
                // API will choose server for the first time
                displayStep(1);
            }

            const sample_account = MetaTraderConfig.getSampleAccount(new_account_type);
            $form.find('#view_2 #mt5_account_type').text(sample_account.title);
            $form.find('button[type="submit"]').attr('acc_type', MetaTraderConfig.getCleanAccType(newAccountGetType(), 2));

            const $view_2_button_container = $form.find('#view_2-buttons');
            $view_2_button_container.setVisibility(1);
        } else if (step === 3) {
            $form.find('input').not(':input[type=radio]').val('');
            $form.find('#trading_password_reset_required').setVisibility(0);

            let $view_3_button_container;
            if (should_set_trading_password) {
                $view_3_button_container = $form.find('#view_3-buttons_new_user');
            } else {
                $view_3_button_container = $form.find('#view_3-buttons_existing_user');
            }
            $('<p />', { id: 'msg_form', class: 'center-text gr-padding-10 error-msg no-margin invisible' }).prependTo($view_3_button_container);
            $view_3_button_container.setVisibility(1);
            $view_3_button_container.find('#btn_forgot_trading_password').on('click', () => displayStep(4));
        } else if (step === 4) {
            BinarySocket.send({
                verify_email: Client.get('email'),
                type        : 'trading_platform_password_reset',
            });
        } else if (step !== 1) {
            displayStep(1);
        }
    };

    // -----------------------
    // ----- New Account -----
    // -----------------------
    const handleNewAccountUI = (action, acc_type, $target) => {
        current_action_ui = action;

        const is_new_account = /new_account/.test(action);
        const $acc_actions = $container.find('.acc-actions');
        $acc_actions.find('.new-account').setVisibility(is_new_account);
        $acc_actions.find('.has-account').setVisibility(!is_new_account);
        $detail.setVisibility(!is_new_account);

        $container.find('[class*="act_"]').removeClass('selected');
        // set active tab
        if (is_new_account) {
            $container.find(`[class~=act_${action}]`).addClass('selected');
        } else {
            $detail.setVisibility(1);
            $target.addClass('selected');
            return;
        }

        // is_new_account
        displayAccountDescription();
        $form = actions_info[action].$form;
        if (Object.keys(accounts_info).every(a_type => !getAccountsInfo(a_type).info)) {
            $form.find('#view_1 .btn-cancel').addClass('invisible');
        }

        // Navigation buttons: cancel, next, back
        $form.find('.btn-cancel').click(() => {
            loadAction(null, acc_type);
            displayAccountDescription(getAccountsInfo(acc_type) ? acc_type : undefined);
            $.scrollTo($('h1'), 300, { offset: -10 });
            showFinancialAuthentication(true);
        });

        $form.find('#view_1 .btn-next').click(function() {
            if (!$(this).hasClass('button-disabled')) {
                const account_type = newAccountGetType();
                const is_demo = /^demo_/.test(account_type);

                if (is_demo) {
                    // If accound is demo, we will skip server selection and show the following step
                    displayStep(3);
                    $form.find('button[type="submit"]').attr('acc_type', newAccountGetType());
                } else {
                    const num_servers = populateTradingServers();
                    // if account is real, we will skip server selection when the first server is being selected (chosen by API)
                    // or when there are no multiple servers supported
                    if (num_servers.supported > 1 && num_servers.used > 0){
                        displayStep(2);
                    } else {
                        displayStep(3);
                    }
                    $form.find('button[type="submit"]').attr('acc_type', MetaTraderConfig.getCleanAccType(newAccountGetType(), 2));
                }
                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            }
        });

        $form.find('#view_2 .btn-next').click(function() {
            if (!$(this).hasClass('button-disabled') && Validation.validate('#frm_new_account')) {
                displayStep(3);
                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            }
        });

        $form.find('#ddl_trade_server').off('click').on('click', (e) => {
            $form.find('#ddl_trade_server').find('input').not(':input[disabled]').removeAttr('checked');

            if (e.target.nodeName === 'SPAN') {
                $(e.target.parentElement).parent().find('input').not(':input[disabled]').attr('checked', 'checked');
            }
            if (e.target.nodeName === 'LABEL') {
                $(e.target.parentElement).find('input').not(':input[disabled]').attr('checked', 'checked');
            }
            if (e.target.nodeName === 'INPUT') {
                $(e.target).not(':input[disabled]').attr('checked', 'checked');
            }

            const new_user_submit_button = $form.find(mt5_login_list.length > 0 ? '#has_mt5_new_user_btn_submit_new_account' : '#new_user_btn_submit_new_account');
            const existing_user_submit_button = $form.find('#existing_user_btn_submit_new_account');

            // Disable/enable submit button based on whether any of the checkboxes is checked.
            if ($form.find('#ddl_trade_server input[checked]').length > 0) {
                new_user_submit_button.removeAttr('disabled');
                existing_user_submit_button.removeAttr('disabled');
            } else {
                new_user_submit_button.attr('disabled', true);
                existing_user_submit_button.attr('disabled', true);
            }
        });

        $form.find('#view_3 .btn-back').click(() => {
            const password_selector = $form.find('.password--input-field').attr('id');
            if (password_selector) {
                Password.removeCheck(`#${password_selector}`, true);
            }
            displayStep(2);
        });
        $form.find('#view_2 .btn-back').click(() => { displayStep(1); });

        // Account type selection
        $form.find('.mt5_type_box').click(selectAccountTypeUI);

        // disable signups by types that have errors
        if (disabled_signup_types.demo) {
            $('#rbtn_demo').addClass('disabled').next('p').css('color', '#DEDEDE');
        } else if (disabled_signup_types.real) {
            $('#rbtn_real').addClass('disabled').next('p').css('color', '#DEDEDE');
        }
    };

    const newAccountGetType = () => {
        const selected_type = $form && $form.find('.step-2 .selected').attr('data-acc-type');
        // if user selected account type using the form, send that
        if (selected_type) {
            return MetaTraderConfig.getCleanAccType(`${$form.find('.step-1 .selected').attr('data-acc-type') || 'real'}_${$form.find('.step-2 .selected').attr('data-acc-type')}`);
        }
        // otherwise they are adding more server to their current account type
        return Client.get('mt5_account');
    };

    const selectAccountTypeUI = (e) => {
        const box_class = 'mt5_type_box';
        let $item = $(e.target);
        if (!$item.hasClass(box_class)) {
            $item = $item.parents(`.${box_class}`);
        }
        if (/\b(disabled|selected|existed)\b/.test($item.attr('class'))) return;
        $item.parents('.type-group').find(`.${box_class}.selected`).removeClass('selected');
        $item.addClass('selected');
        const selected_acc_type = $item.attr('data-acc-type');
        const action            = 'new_account';
        if (/(demo|real)/.test(selected_acc_type)) {
            displayAccountDescription();
            updateAccountTypesUI(selected_acc_type);
            switchAccountTypesUI(selected_acc_type, $form);
            $form.find('#view_1 .btn-next').addClass('button-disabled');
            $form.find('#view_1 .step-2').setVisibility(1);
            displayMessage('#new_account_msg', (selected_acc_type === 'real' && Client.get('is_virtual')) ? MetaTraderConfig.needsRealMessage() : '', true);
        } else {
            const new_acc_type = newAccountGetType();
            displayAccountDescription(new_acc_type);
            actions_info[action].prerequisites(new_acc_type).then((error_msg) => {
                displayMessage('#new_account_msg', error_msg || '');
                $form.find('#view_1 .btn-next')[error_msg ? 'addClass' : 'removeClass']('button-disabled');
                $form.find('#view_1 .btn-cancel').removeClass('invisible');
            });
        }

        // disable next button and Synthetic option if all servers are used or unavailable
        const num_servers = populateTradingServers('real_gaming_financial');
        if (/real/.test(selected_acc_type) && num_servers.supported === num_servers.used + num_servers.disabled) {
            disableButtonLink('.btn-next');
            $form.find('.step-2 #rbtn_gaming_financial').addClass('existed');
        }
    };

    const switchAccountTypesUI = (type, form) => {
        const demo_btn = form.find('#view_1 .step-2 .type-group .template_demo');
        const real_btn = form.find('#view_1 .step-2 .type-group .template_real');

        if (/demo/.test(type)) {
            demo_btn.removeClass('invisible');
            real_btn.addClass('invisible');
        } else {
            demo_btn.addClass('invisible');
            real_btn.removeClass('invisible');
        }
    };

    const sortMt5Accounts = (a, b) => {
        if (/demo/.test(a) && !/demo/.test(b)) {
            return -1;
        }
        if (/demo/.test(b) && !/demo/.test(a)) {
            return 1;
        }
        if (/svg$/.test(a)) {
            return -1;
        }
        if (/vanuatu|svg_standard/.test(a)) {
            return /svg$/.test(b) ? 1 : -1;
        }
        return 1;
    };

    const updateAccountTypesUI = (type) => {
        Object.keys(accounts_info)
            .filter(acc_type => acc_type.indexOf(type) === 0)
            .forEach((acc_type) => {
                let class_name = (type === 'real' && Client.get('is_virtual')) ? 'disabled' : '';
                if (getAccountsInfo(acc_type).info && (getAvailableServers(false, acc_type).length === 0 || type === 'demo')) {
                    class_name = 'existed';
                }
                const clean_acc_type = MetaTraderConfig.getCleanAccType(acc_type, 2);
                $form.find(`.step-2 #${clean_acc_type.replace(type, 'rbtn')}`)
                    .removeClass('existed disabled selected')
                    .addClass(class_name);
            });
    };

    const populateAccountTypes = () => {
        const $acc_template_demo = $($templates.find('#rbtn_template_demo').parent().remove()[0]);
        const $acc_template_real = $($templates.find('#rbtn_template_real').parent().remove()[0]);
        const $acc_template_mt   = $templates.find('#frm_new_account #view_1 .step-2 .type-group');
        if (!$acc_template_demo.length
            || !$acc_template_real.length
            || !$acc_template_mt.length) return;

        let count = 0;
        const filtered_accounts = {};
        Object.keys(accounts_info).sort(sortMt5Accounts).forEach(acc_type => {
            // remove server from name
            const clean_acc_type = MetaTraderConfig.getCleanAccType(acc_type, 2);
            filtered_accounts[clean_acc_type] = getAccountsInfo(acc_type);
        });

        Object.keys(filtered_accounts).forEach((acc_type) => {
            // TODO: remove once we have market type and sub type data from error response details
            if (/unknown+$/.test(acc_type)) return;
            const $acc  = getAccountsInfo(acc_type, filtered_accounts).is_demo
                ? $acc_template_demo.clone() : $acc_template_real.clone();
            const type  = acc_type.split('_').slice(1).join('_');
            const image =  getAccountsInfo(acc_type, filtered_accounts).market_type === 'gaming' || getAccountsInfo(acc_type, filtered_accounts).market_type === 'synthetic'  ? 'synthetic' : getAccountsInfo(acc_type, filtered_accounts).sub_account_type; // image name can be (financial_stp|financial|synthetic)
            $acc.attr({ id: `template_${type}` });
            $acc.find('.mt5_type_box').attr({ id: `rbtn_${type}`, 'data-acc-type': type })
                .find('img').attr('src', urlForStatic(`/images/pages/metatrader/icons/acc_${image}.svg`));
            $acc.find('p').text(getAccountsInfo(acc_type, filtered_accounts).short_title);
            $acc_template_mt.append($acc);

            count++;
        });
        $templates.find('.hl-types-of-accounts').setVisibility(count > 1);
    };

    // -------------------
    // ----- General -----
    // -------------------
    const postValidate = (acc_type, action) => {
        const validate = actions_info[action].pre_submit;
        return validate ? validate(actions_info[action].$form, acc_type, displayFormMessage) :
            new Promise(resolve => resolve(true));
    };

    const removeUrlHash = () => {
        const url = location.href.split('#')[0];
        window.history.replaceState({ url }, document.title, url);
    };

    const hideFormMessage = (action) => {
        actions_info[action].$form.find('#msg_form').html('').setVisibility(0);
    };

    const displayFormMessage = (message, action) => {
        actions_info[action].$form.find('#msg_form').html(message).setVisibility(1);
    };

    const displayMainMessage = (message, should_scroll = true) => {
        $main_msg.html(message).setVisibility(1);
        if (should_scroll) {
            $.scrollTo($action, 500, { offset: -80 });
        }
    };

    const displayMessage = (selector, message, is_centered) => {
        $container.find(selector).html(message).attr('class', `notice-msg hint ${is_centered ? 'center-text' : 'align-start'}`).setVisibility(message.length);
    };

    const displayPageError = (message) => {
        $('#page_msg').html(message).setVisibility(1);
        $('#mt_loading').remove();
    };

    /**
     * @param {string} action
     * @returns {jQuery}
     */
    const  getActionButton = (action) => {
        let button_selector = 'button';
        if (action === 'new_account') {
            if (shouldSetTradingPassword()) {
                if (mt5_login_list.length > 0) {
                    button_selector = '#has_mt5_new_user_btn_submit_new_account';
                } else {
                    button_selector = '#new_user_btn_submit_new_account';
                }
            } else {
                button_selector = '#existing_user_btn_submit_new_account';
            }
        }
        return actions_info[action].$form.find(button_selector);
    };

    const disableButton = (action) => {
        const $btn = getActionButton(action);

        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: 'invisible' });
            showLoadingImage($btn[0], 'white');
            $btn.append($btn_text);
        }
    };

    const enableButton = (action, response) => {
        const $btn = getActionButton(action);
        if ($btn.length && $btn.find('.barspinner').length) {
            $btn.removeAttr('disabled').html($btn.find('span').text());
        }
        if (/password_reset/.test(action)) {
            // after submit is done, reset token value
            resetManagePasswordTab(action, response);
        }
        if (/new_account/.test(action)) {
            resetNewAccountForm(response);
        }
    };

    const resetNewAccountForm = (response) => {
        const should_reset_view = ['#view_3-buttons_reset_password', '#trading_password_reset_required'];
        const normal_view = ['#trading_password_existing_user', '#view_3-buttons_existing_user', '#trading_password_input'];
        const $hint = $('#trading_password_existing_user_validation_error');
        $('#trading_password').val('').focus();
        $hint.setVisibility(0); // Make sure hint is hidden unless told otherwise
        // We need to render a different form on this error.
        if (response.error && response.error.code === 'PasswordReset') {
            normal_view.forEach(selector => $(selector).setVisibility(0));
            should_reset_view.forEach(selector => $(selector).setVisibility(1));
            $('#btn_reset_trading_password').on('click.reset_password', () => displayStep(4));
            $('#try_again').on('click', () => {
                // Reset previous form
                normal_view.forEach(selector => $(selector).setVisibility(1));
                should_reset_view.forEach(selector => $(selector).setVisibility(0));
                $('#btn_reset_trading_password').off('click.reset_password');
                displayStep(3);
            });
        }
        if (response.error && response.error.code === 'PasswordError') {
            $hint.setVisibility(1);
        }
    };

    const resetManagePasswordTab = (action, response) => {
        const has_invalid_token = getPropertyValue(response, ['error', 'code']) === 'InvalidToken';
        if (!response.error || has_invalid_token) {
            token = '';
            if (action === 'password_reset') { // go back to verify reset password form
                loadAction('manage_password');
                if (!response.error) {
                    displayMainMessage(localize('The investor password of account number [_1] has been changed.', MetaTraderConfig.getDisplayLogin(response.echo_req.account_id)));
                } else if (has_invalid_token) {
                    $form.find('#frm_verify_password_reset #token_error').setVisibility(1);
                }
            }
        }
    };

    const showHideFinancialAuthenticate = (acc_type) => {
        if (MetaTraderConfig.hasAccount(acc_type)) {
            $('#financial_authenticate_msg').setVisibility(MetaTraderConfig.isAuthenticationPromptNeeded());
        }
    };

    const showFinancialAuthentication = (should_show) => {
        $('#financial_authenticate_msg').setVisibility(should_show ? MetaTraderConfig.isAuthenticationPromptNeeded() : 0);
    };

    const setCounterpartyAndJurisdictionTooltip = ($el, acc_type) => {
        // TODO: Remove once we have market type and sub type in error details
        if (/unknown+$/.test(acc_type)) {
            return;
        }

        const $icon = $el.parent().find('.display_login_tip');
        const is_mobile = window.innerWidth < 770;
        /*
            The details for vanuatu landing company was changed to
            those of the svg landing company, thus it will show
            the new details instead of the old one even when the
            account is still on the old landing company.

            The code below is to stop the tooltip from showing wrong
            information.
        */
        if ((getAccountsInfo(acc_type).landing_company_short === 'vanuatu' &&
            getAccountsInfo(acc_type).market_type === 'financial' &&
            getAccountsInfo(acc_type).sub_account_type === 'financial') ||
            is_mobile) {
            $icon.remove();
            return;
        }

        BinarySocket.wait('landing_company').then((response) => {
            const landing_company_name = getAccountsInfo(acc_type).market_type === 'synthetic' ? 'mt_gaming_company' : `mt_${getAccountsInfo(acc_type).market_type}_company`;
            const company = response.landing_company[landing_company_name][getAccountsInfo(acc_type).sub_account_type];

            $icon.attr({
                'data-balloon'       : `${localize('Counterparty')}: ${company.name}, ${localize('Jurisdiction')}: ${company.country}`,
                'data-balloon-length': 'large',
            });
        });
    };

    const setDemoTopupStatus = () => {
        const el_demo_topup_btn  = getElementById('demo_topup_btn');
        const el_loading         = getElementById('demo_topup_loading');
        const acc_type           = Client.get('mt5_account');
        const is_demo            = getAccountsInfo(acc_type).is_demo;
        const topup_btn_text     = localize('Get [_1]', `10,000.00 ${MetaTraderConfig.getCurrency(acc_type)}`);

        el_loading.setVisibility(0);
        el_demo_topup_btn.firstChild.innerText = topup_btn_text;

        if (is_demo) {
            const balance     = +getAccountsInfo(acc_type).info.balance;
            const min_balance = 1000;

            if (balance <= min_balance) {
                enableDemoTopup(true, acc_type);
            } else {
                enableDemoTopup(false, acc_type);
            }
        }
    };

    const enableDemoTopup = (is_enabled, acc_type) => {
        const el_demo_topup_btn = getElementById('demo_topup_btn');
        const el_demo_topup_info = getElementById('demo_topup_info');

        const function_to_call = is_enabled ? 'addEventListener' : 'removeEventListener';
        el_demo_topup_btn[function_to_call]('click', topup_demo);

        el_demo_topup_btn.classList.add(is_enabled ? 'button' : 'button-disabled');
        el_demo_topup_btn.classList.remove(is_enabled ? 'button-disabled' : 'button');

        el_demo_topup_info.innerText = is_enabled
            ? localize('Your demo account balance is currently [_1] or less. You may top up your account with an additional [_2].', [`1,000.00 ${MetaTraderConfig.getCurrency(acc_type)}`, `10,000.00 ${MetaTraderConfig.getCurrency(acc_type)}`])
            : localize('You can top up your demo account with an additional [_1] if your balance is [_2] or less.', [`10,000.00 ${MetaTraderConfig.getCurrency(acc_type)}`, `1,000.00 ${MetaTraderConfig.getCurrency(acc_type)}`]);
    };

    const setTopupLoading = (is_loading) => {
        const el_demo_topup_btn  = getElementById('demo_topup_btn');
        const el_demo_topup_info = getElementById('demo_topup_info');
        const el_loading         = getElementById('demo_topup_loading');

        el_demo_topup_btn.setVisibility(!is_loading);
        el_demo_topup_info.setVisibility(!is_loading);
        el_loading.setVisibility(is_loading);

        if (!is_loading) {
            setDemoTopupStatus();
        }
    };

    const showNewAccountConfirmationPopup = (e, onConfirm, onAbort) => {

        Dialog.confirm({
            id               : 'create_mt5_popup_container',
            ok_text          : localize('Yes, I\'m sure'),
            cancel_text      : localize('Cancel'),
            localized_title  : localize('Are you sure?'),
            localized_message: localize('You will not be able to change your fiat account\'s currency after creating this MT5 account. Are you sure you want to proceed?'),
            onConfirm        : () => {
                onConfirm();
                submit(e);
            },
            onAbort,
        });
    };

    return {
        init,
        setAccountType,
        setDisabledAccountTypes,
        loadAction,
        updateAccount,
        postValidate,
        hideFormMessage,
        displayFormMessage,
        displayMainMessage,
        displayMessage,
        displayPageError,
        disableButton,
        disableButtonLink,
        enableButton,
        refreshAction,
        setTopupLoading,
        showNewAccountConfirmationPopup,

        $form                  : () => $form,
        getDisabledAccountTypes: () => disabled_signup_types,
        getToken               : () => token,
        setToken               : (verification_code) => { token = verification_code; },
    };
})();

module.exports = MetaTraderUI;
