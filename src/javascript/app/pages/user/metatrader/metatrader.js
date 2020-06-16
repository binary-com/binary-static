const MetaTraderConfig   = require('./metatrader.config');
const MetaTraderUI       = require('./metatrader.ui');
const Client             = require('../../../base/client');
const BinarySocket       = require('../../../base/socket');
const setCurrencies      = require('../../../common/currency').setCurrencies;
const Validation         = require('../../../common/form_validation');
const localize           = require('../../../../_common/localize').localize;
const State              = require('../../../../_common/storage').State;
const isEmptyObject      = require('../../../../_common/utility').isEmptyObject;
const applyToAllElements = require('../../../../_common/utility').applyToAllElements;

const MetaTrader = (() => {
    let mt_companies;
    let show_new_account_popup = true;
    const accounts_info        = MetaTraderConfig.accounts_info;
    const actions_info         = MetaTraderConfig.actions_info;
    const fields               = MetaTraderConfig.fields;

    const mt_company = {};

    const onLoad = () => {
        BinarySocket.send({ statement: 1, limit: 1 });
        BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(async () => {
            if (isEligible()) {
                if (Client.get('is_virtual')) {
                    try {
                        await addAllAccounts();
                    } catch (error) {
                        MetaTraderUI.displayPageError(error.message);
                    }
                } else {
                    BinarySocket.send({ get_limits: 1 }).then(async () => {
                        try {
                            await addAllAccounts();
                        } catch (error) {
                            MetaTraderUI.displayPageError(error.message);
                        }
                    });
                }
            } else {
                MetaTraderUI.displayPageError(localize('Sorry, this feature is not available in your jurisdiction.'));
            }
        });
    };

    const setMTCompanies = () => {
        const mt_financial_company = State.getResponse('landing_company.mt_financial_company');
        const mt_gaming_company    = State.getResponse('landing_company.mt_gaming_company');

        // Check if mt_gaming_company is offered, if not found, switch to mt_financial_company
        const mt_landing_company = isEmptyObject(mt_gaming_company) ? mt_financial_company : mt_gaming_company;

        // Check if any of the account type shortcodes from mt_landing_company account is maltainvest
        const is_financial = mt_landing_company ? Object.keys(mt_landing_company)
            .some((key) => mt_landing_company[key].shortcode === 'maltainvest') : undefined;

        mt_companies = mt_companies || MetaTraderConfig[is_financial ? 'configMtFinCompanies' : 'configMtCompanies']();
    };

    const isEligible = () => {
        // hide MT5 dashboard for IOM account or VRTC of IOM landing company
        if (State.getResponse('landing_company.gaming_company.shortcode') === 'iom' && !Client.isAccountOfType('financial')) {
            return false;
        }
        setMTCompanies();
        return Object.keys(mt_companies).find((company) =>
            !!Object.keys(mt_companies[company]).find((acc_type) =>
                !!State.getResponse(`landing_company.mt_${company}_company.${MetaTraderConfig.getMTFinancialAccountType(acc_type)}.shortcode`)
            )
        );
    };

    const addAllAccounts = () => (
        new Promise((resolve, reject) => {
            BinarySocket.wait('mt5_login_list').then((response) => {
                if (response.error) {
                    reject(response.error);
                    return;
                }

                const vanuatu_standard_demo_account = response.mt5_login_list.find(account =>
                    Client.getMT5AccountType(account.group) === 'demo_vanuatu_standard');

                const vanuatu_standard_real_account = response.mt5_login_list.find(account =>
                    Client.getMT5AccountType(account.group) === 'real_vanuatu_standard');

                // Explicitly add (demo|real)_vanuatu_standard if it exist in API.
                if (vanuatu_standard_demo_account) {
                    accounts_info.demo_vanuatu_standard = {
                        is_demo     : true,
                        account_type: 'demo',
                        ...mt_companies.financial.demo_standard,
                    };
                }
                if (vanuatu_standard_real_account) {
                    accounts_info.real_vanuatu_standard = {
                        is_demo     : false,
                        account_type: 'financial',
                        ...mt_companies.financial.real_standard,
                    };
                }

                Object.keys(mt_companies).forEach((company) => {
                    Object.keys(mt_companies[company]).forEach((acc_type) => {
                        mt_company[company] = State.getResponse(`landing_company.mt_${company}_company.${MetaTraderConfig.getMTFinancialAccountType(acc_type)}.shortcode`);

                        // If vanuatu exists, don't add svg anymore unless it's for volatility.
                        const vanuatu_and_svg_exists = (
                            (vanuatu_standard_demo_account && /demo_standard/.test(acc_type)) ||
                            (vanuatu_standard_real_account && /real_standard/.test(acc_type))
                        ) &&
                        /svg/.test(mt_company[company]) &&
                        mt_companies[company][acc_type].mt5_account_type;

                        if (mt_company[company] && !vanuatu_and_svg_exists) addAccount(company, acc_type);
                    });
                });
                resolve();
                getAllAccountsInfo(response);
            });
        })
    );

    const addAccount = (company, acc_type) => {
        const company_info     = mt_companies[company][acc_type];
        const mt5_account_type = company_info.mt5_account_type;
        const is_demo          = /^demo_/.test(acc_type);
        const type             = is_demo ? 'demo' : 'real';

        accounts_info[`${type}_${mt_company[company]}${mt5_account_type ? `_${mt5_account_type}` : ''}`] = {
            account_type: is_demo ? 'demo' : company,
            is_demo,
            max_leverage: company_info.max_leverage,
            mt5_account_type,
            short_title : company_info.short_title,
            title       : company_info.title,
        };
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

    const setAccountDetails = (login, acc_type, data) => {
        if (data.mt5_login_list) {
            const info = data.mt5_login_list.find(mt5_account => mt5_account.login === login);
            if (info) {
                accounts_info[acc_type].info = info;
                accounts_info[acc_type].info.display_login = MetaTraderConfig.getDisplayLogin(info.login);
                MetaTraderUI.updateAccount(acc_type);
            }
        }
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
                        if (accounts_info[acc_type].info) {
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
                            MetaTraderUI.setAccountType(acc_type, true);
                            MetaTraderUI.loadAction(null, acc_type);
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
        // Ignore old accounts which are not linked to any group or has deprecated group
        const mt5_login_list = (response.mt5_login_list || []).filter(obj => (
            obj.group && Client.getMT5AccountType(obj.group) in accounts_info
        ));

        // Update account info
        mt5_login_list.forEach((obj) => {
            const acc_type = Client.getMT5AccountType(obj.group);
            accounts_info[acc_type].info = {
                display_login: MetaTraderConfig.getDisplayLogin(obj.login),
                login        : obj.login,
            };
            setAccountDetails(obj.login, acc_type, response);
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
                        [`${MetaTraderConfig.getCurrency(acc_type)} 10,000.00`, accounts_info[acc_type].info.display_login]
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
