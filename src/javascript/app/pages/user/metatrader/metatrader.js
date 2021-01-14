const MetaTraderConfig   = require('./metatrader.config');
const MetaTraderUI       = require('./metatrader.ui');
const Client             = require('../../../base/client');
const BinarySocket       = require('../../../base/socket');
const setCurrencies      = require('../../../common/currency').setCurrencies;
const Validation         = require('../../../common/form_validation');
const localize           = require('../../../../_common/localize').localize;
const State              = require('../../../../_common/storage').State;
const applyToAllElements = require('../../../../_common/utility').applyToAllElements;

const MetaTrader = (() => {
    let show_new_account_popup = true;

    const accounts_info = MetaTraderConfig.accounts_info;
    const actions_info  = MetaTraderConfig.actions_info;
    const fields        = MetaTraderConfig.fields;

    const onLoad = () => {
        BinarySocket.send({ statement: 1, limit: 1 });
        BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(async () => {
            await BinarySocket.send({ trading_servers: 1, platform: 'mt5' });

            if (isEligible()) {
                if (Client.get('is_virtual')) {
                    addAllAccounts();
                } else {
                    BinarySocket.send({ get_limits: 1 }).then(addAllAccounts);
                }
            } else {
                MetaTraderUI.displayPageError(localize('Sorry, this feature is not available in your jurisdiction.'));
            }
        });
    };

    const isEligible = () => {
        const landing_company = State.getResponse('landing_company');
        // hide MT5 dashboard for IOM account or VRTC of IOM landing company
        if (State.getResponse('landing_company.gaming_company.shortcode') === 'iom' && !Client.isAccountOfType('financial')) {
            return false;
        }
        return 'mt_gaming_company' in landing_company || 'mt_financial_company' in landing_company;
    };

    const addAllAccounts = () => {
        BinarySocket.wait('mt5_login_list').then((response) => {
            if (response.error) {
                MetaTraderUI.displayPageError(response.error.message);
                return;
            }

            const { mt_financial_company, mt_gaming_company } = State.getResponse('landing_company');
            addAccount('gaming', mt_gaming_company);
            addAccount('financial', mt_financial_company);

            const trading_servers = State.getResponse('trading_servers');
            // for legacy clients on the real01 server, real01 server is not going to be offered in trading servers
            // but we need to build their object in accounts_info or they can't view their legacy account
            response.mt5_login_list.forEach((mt5_login) => {
                const is_server_offered =
                    trading_servers.find((trading_server => trading_server.id === mt5_login.server));

                if (!is_server_offered && !/demo/.test(mt5_login.server)) {
                    const landing_company = mt5_login.market_type === 'gaming' ? mt_gaming_company : mt_financial_company;

                    addAccount(mt5_login.market_type, landing_company, mt5_login.server);
                }
            });

            getAllAccountsInfo(response);
        });
    };

    // * mt5_login_list returns these:
    // landing_company_short: "svg" | "malta" | "maltainvest" |  "vanuatu"  | "labuan" | "bvi"
    // account_type: "real" | "demo"
    // market_type: "financial" | "gaming"
    // sub_account_type: "financial" | "financial_stp" | "swap_free"
    //
    // (all market type gaming are synthetic accounts and can only have financial or swap_free sub account)
    //
    // * we should map them to landing_company:
    // mt_financial_company: { financial: {}, financial_stp: {}, swap_free: {} }
    // mt_gaming_company: { financial: {}, swap_free: {} }
    const addAccount = (market_type, company = {}, server) => {
        Object.keys(company)
            .filter(sub_account_type => sub_account_type !== 'swap_free') // TODO: remove this when releasing swap_free
            .forEach((sub_account_type) => {
                const landing_company_short = company[sub_account_type].shortcode;

                ['demo', 'real'].forEach((account_type) => {
                    const is_demo = account_type === 'demo';
                    const display_name =
                        Client.getMT5AccountDisplays(market_type, sub_account_type, is_demo);
                    const leverage = getLeverage(market_type, sub_account_type, landing_company_short);

                    const addAccountsInfo = (trading_server) => {
                        // e.g. real_gaming_financial
                        let key = `${account_type}_${market_type}_${sub_account_type}`;

                        // e.g. real_gaming_financial_real01
                        if (trading_server) {
                            key += `_${trading_server.id}`;
                        }

                        accounts_info[key] = {
                            is_demo,
                            landing_company_short,
                            leverage,
                            market_type,
                            sub_account_type,
                            short_title: display_name.short,
                            title      : display_name.full,
                        };
                    };

                    if (server && !is_demo) {
                        addAccountsInfo({ id: server });
                    } else {
                        const available_servers = getAvailableServers(market_type, sub_account_type);

                        // demo only has one server, no need to create for each trade server
                        if (available_servers.length > 1 && !is_demo) {
                            available_servers.forEach(trading_server => addAccountsInfo(trading_server));
                        } else {
                            addAccountsInfo();
                        }

                    }

                });
            });
    };

    const getAvailableServers = (market_type, sub_account_type) => {
        const is_synthetic     = market_type === 'gaming'    && sub_account_type === 'financial';
        const is_financial     = market_type === 'financial' && sub_account_type === 'financial';
        const is_financial_stp = market_type === 'financial' && sub_account_type === 'financial_stp';

        return State.getResponse('trading_servers').filter(trading_server => {
            const { supported_accounts = [] } = trading_server;
            const is_server_supported =
                (is_synthetic && supported_accounts.includes('gaming')) ||
                (is_financial && supported_accounts.includes('financial')) ||
                (is_financial_stp && supported_accounts.includes('financial_stp'));

            return is_server_supported;
        });
    };

    // synthetic is 500
    // financial is 1000, unless maltainvest then 30
    // financial_stp is 100
    const getLeverage = (market_type, sub_account_type, landing_company_short) => {
        if (market_type === 'gaming') {
            return 500;
        }
        if (sub_account_type === 'financial') {
            return landing_company_short === 'maltainvest' ? 30 : 1000;
        }
        if (sub_account_type === 'financial_stp') {
            return 100;
        }
        return 0;
    };

    const getAllAccountsInfo = (response) => {
        MetaTraderUI.init(submit, sendTopupDemo);
        show_new_account_popup = Client.canChangeCurrency(State.getResponse('statement'), (response.mt5_login_list || []), false);
        allAccountsResponseHandler(response);
    };

    const getDefaultAccount = () => {
        let default_account = '';
        if (MetaTraderConfig.hasAccount(Client.get('mt5_account'))) {
            default_account = Client.get('mt5_account');
        } else {
            default_account = MetaTraderConfig.getAllAccounts()[0] || '';
        }
        return default_account;
    };

    const makeRequestObject = (acc_type, action) => {
        const req = {};

        Object.keys(fields[action]).forEach((field) => {
            const field_obj = fields[action][field];
            if (!field_obj.request_field) return;

            if (field_obj.is_radio) {
                req[field_obj.request_field] = MetaTraderUI.$form().find(`input[name=${field_obj.id.slice(1)}]:checked`).val();
            } else {
                req[field_obj.request_field] = MetaTraderUI.$form().find(field_obj.id).val();
            }
        });

        if (!/^(verify_password_reset)$/.test(action)) {
            // set main command
            req[`mt5_${action}`] = 1;
        }

        // add additional fields
        $.extend(req, fields[action].additional_fields(acc_type, MetaTraderUI.getToken()));

        return req;
    };

    const submit = (e) => {
        e.preventDefault();

        if (show_new_account_popup) {
            MetaTraderUI.showNewAccountConfirmationPopup(
                e,
                () => show_new_account_popup = false,
                () => show_new_account_popup = true
            );

            return;
        }

        const $btn_submit = $(e.target);
        const acc_type    = $btn_submit.attr('acc_type');
        const action      = $btn_submit.attr('action');
        MetaTraderUI.hideFormMessage(action);
        if (Validation.validate(`#frm_${action}`)) {
            MetaTraderUI.disableButton(action);
            // further validations before submit (password_check)
            MetaTraderUI.postValidate(acc_type, action).then((is_ok) => {
                if (!is_ok) {
                    MetaTraderUI.enableButton(action);
                    return;
                }

                if (action === 'verify_password_reset_token') {
                    MetaTraderUI.setToken($('#txt_verification_code').val());
                    if (typeof actions_info[action].onSuccess === 'function') {
                        actions_info[action].onSuccess({}, MetaTraderUI.$form());
                    }
                    return;
                }

                const req = makeRequestObject(acc_type, action);
                BinarySocket.send(req).then(async (response) => {
                    if (response.error) {
                        MetaTraderUI.displayFormMessage(response.error.message, action);
                        if (typeof actions_info[action].onError === 'function') {
                            actions_info[action].onError(response, MetaTraderUI.$form());
                        }
                        if (/^MT5(Deposit|Withdrawal)Error$/.test(response.error.code)) {
                            // update limits if outdated due to exchange rates changing for currency
                            BinarySocket.send({ website_status: 1 }).then((response_w) => {
                                if (response_w.website_status) {
                                    setCurrencies(response_w.website_status);
                                }
                            });
                        }
                        MetaTraderUI.enableButton(action, response);
                    } else {
                        await BinarySocket.send({ get_account_status: 1 });
                        if (accounts_info[acc_type] && accounts_info[acc_type].info) {
                            const parent_action = /password/.test(action) ? 'manage_password' : 'cashier';
                            if (parent_action === 'cashier') {
                                await BinarySocket.send({ get_limits: 1 });
                            }
                            MetaTraderUI.loadAction(parent_action);
                            MetaTraderUI.enableButton(action, response);
                            MetaTraderUI.refreshAction();
                        }
                        if (typeof actions_info[action].success_msg === 'function') {
                            const success_msg = actions_info[action].success_msg(response, acc_type);
                            if (actions_info[action].success_msg_selector) {
                                MetaTraderUI.displayMessage(actions_info[action].success_msg_selector, success_msg, 1);
                            } else {
                                MetaTraderUI.displayMainMessage(success_msg);
                            }
                            MetaTraderUI.enableButton(action, response);
                        }
                        if (typeof actions_info[action].onSuccess === 'function') {
                            actions_info[action].onSuccess(response, MetaTraderUI.$form());
                        }
                        BinarySocket.send({ mt5_login_list: 1 }).then((response_login_list) => {
                            MetaTraderUI.refreshAction();
                            allAccountsResponseHandler(response_login_list);

                            let account_type = acc_type;
                            if (action === 'new_account' && !/\d$/.test(account_type) && !accounts_info[account_type]) {
                                const server = $('#frm_new_account').find('#ddl_trade_server input[checked]').val();
                                if (server) {
                                    account_type += `_${server}`;

                                    if (!accounts_info[account_type]) {
                                        account_type = acc_type;
                                    }
                                }
                            }

                            MetaTraderUI.setAccountType(account_type, true);
                            MetaTraderUI.loadAction(null, account_type);
                        });
                    }
                });
            });
        }
    };

    const allAccountsResponseHandler = (response) => {
        if (response.error) {
            MetaTraderUI.displayPageError(response.error.message || localize('Sorry, an error occurred while processing your request.'));
            return;
        }

        const trading_servers = State.getResponse('trading_servers');

        // Update account info
        response.mt5_login_list.forEach((account) => {
            let acc_type = `${account.account_type}_${account.market_type}_${account.sub_account_type}`;
            const acc_type_server = `${acc_type}_${account.server}`;
            if (!(acc_type in accounts_info) || acc_type_server in accounts_info) {
                acc_type = acc_type_server;
            }

            // in case trading_server API response is corrupted, acc_type will not exist in accounts_info due to missing supported_accounts prop
            if (acc_type in accounts_info) {
                accounts_info[acc_type].info = account;

                accounts_info[acc_type].info.display_login = MetaTraderConfig.getDisplayLogin(account.login);
                accounts_info[acc_type].info.login         = account.login;
                accounts_info[acc_type].info.server        = account.server;

                const geolocation = (trading_servers.find(server => server.id === account.server) || {}).geolocation;
                if (geolocation) {
                    accounts_info[acc_type].info.display_server = geolocation.sequence > 1 ? `${geolocation.region} ${geolocation.sequence}` : geolocation.region;
                }

                MetaTraderUI.updateAccount(acc_type);
            }
        });

        const current_acc_type = getDefaultAccount();
        Client.set('mt5_account', current_acc_type);

        // Update types with no account
        Object.keys(accounts_info)
            .filter(acc_type => !MetaTraderConfig.hasAccount(acc_type))
            .forEach((acc_type) => { MetaTraderUI.updateAccount(acc_type); });
    };

    const sendTopupDemo = () => {
        MetaTraderUI.setTopupLoading(true);
        const acc_type = Client.get('mt5_account');
        const req      = {
            mt5_deposit: 1,
            to_mt5     : accounts_info[acc_type].info.login,
        };

        BinarySocket.send(req).then((response) => {
            if (response.error) {
                MetaTraderUI.displayPageError(response.error.message);
                MetaTraderUI.setTopupLoading(false);
            } else {
                MetaTraderUI.displayMainMessage(
                    localize(
                        '[_1] has been credited into your MT5 Demo Account: [_2].',
                        [`10,000.00 ${MetaTraderConfig.getCurrency(acc_type)}`, accounts_info[acc_type].info.display_login]
                    ));
                BinarySocket.send({ mt5_login_list: 1 }).then((res) => {
                    allAccountsResponseHandler(res);
                    MetaTraderUI.setTopupLoading(false);
                });
            }
        });
    };

    const metatraderMenuItemVisibility = () => {
        BinarySocket.wait('landing_company', 'get_account_status').then(async () => {
            if (isEligible()) {
                const mt_visibility = document.getElementsByClassName('mt_visibility');
                applyToAllElements(mt_visibility, (el) => {
                    el.setVisibility(1);
                });
            }
        });
    };

    const onUnload = () => {
        MetaTraderUI.refreshAction();
    };

    return {
        onLoad,
        onUnload,
        isEligible,
        metatraderMenuItemVisibility,
    };
})();

module.exports = MetaTrader;
