const MetaTraderConfig = require('./metatrader.config');
const MetaTraderUI     = require('./metatrader.ui');
const Client           = require('../../../base/client');
const BinarySocket     = require('../../../base/socket');
const Validation       = require('../../../common/form_validation');
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const toTitleCase      = require('../../../../_common/string_util').toTitleCase;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;

const MetaTrader = (() => {
    const mt_companies  = MetaTraderConfig.mt_companies;
    const accounts_info = MetaTraderConfig.accounts_info;
    const actions_info  = MetaTraderConfig.actions_info;
    const fields        = MetaTraderConfig.fields;

    const mt_company = {};

    const onLoad = () => {
        BinarySocket.wait('landing_company', 'get_account_status').then(() => {
            if (isEligible()) {
                if (Client.get('is_virtual')) {
                    getAllAccountsInfo();
                } else {
                    BinarySocket.send({ get_limits: 1 }).then(getAllAccountsInfo);
                }
            } else if (State.getResponse('landing_company.gaming_company.shortcode') === 'malta') {
                // TODO: remove this elseif when we enable mt account opening for malta
                // show specific message to clients from malta landing company as long as there is no mt_company for them
                MetaTraderUI.displayPageError(localize('Our MT5 service is currently unavailable to EU residents due to pending regulatory approval.'));
            } else {
                MetaTraderUI.displayPageError(localize('Sorry, this feature is not available in your jurisdiction.'));
            }
        });
    };

    const isEligible = () => {
        let has_mt_company = false;
        Object.keys(mt_companies).forEach((company) => {
            mt_company[company] = State.getResponse(`landing_company.mt_${company}_company.shortcode`);
            if (mt_company[company]) {
                has_mt_company = true;
                addAccount(company);
            }
        });
        return has_mt_company;
    };

    const addAccount = (company) => {
        ['demo', 'real'].forEach((type) => {
            Object.keys(mt_companies[company]).forEach((acc_type) => {
                const company_info     = mt_companies[company][acc_type];
                const mt5_account_type = company_info.mt5_account_type;
                const title            = localize(`${toTitleCase(type)} ${company_info.title}`);
                const is_demo          = type === 'demo';

                accounts_info[`${type}_${mt_company[company]}${mt5_account_type ? `_${mt5_account_type}` : ''}`] = {
                    title,
                    is_demo,
                    mt5_account_type,
                    account_type: is_demo ? 'demo' : company,
                    max_leverage: company_info.max_leverage,
                    short_title : company_info.title,
                };
            });
        });
    };

    const getAllAccountsInfo = () => {
        MetaTraderUI.init(submit);
        BinarySocket.send({ mt5_login_list: 1 }).then((response) => {
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
                accounts_info[acc_type].info = { login: obj.login };
                getAccountDetails(obj.login, acc_type);
            });

            Client.set('mt5_account', getDefaultAccount());

            // Update types with no account
            Object.keys(accounts_info)
                .filter(acc_type => !hasAccount(acc_type))
                .forEach((acc_type) => { MetaTraderUI.updateAccount(acc_type); });
        });
    };

    const getDefaultAccount = () => {
        let default_account = '';
        if (hasAccount(location.hash.substring(1))) {
            default_account = location.hash.substring(1);
            MetaTraderUI.removeUrlHash();
        } else if (hasAccount(Client.get('mt5_account'))) {
            default_account = Client.get('mt5_account');
        } else {
            default_account = Object.keys(accounts_info)
                .filter(acc_type => hasAccount(acc_type))
                .sort(acc_type => (accounts_info[acc_type].is_demo ? 1 : -1))[0] || ''; // real first
        }
        return default_account;
    };

    const hasAccount = acc_type => (accounts_info[acc_type] || {}).info;

    const getAccountDetails = (login, acc_type) => {
        BinarySocket.send({
            mt5_get_settings: 1,
            login,
        }).then((response) => {
            if (response.mt5_get_settings) {
                accounts_info[acc_type].info = response.mt5_get_settings;
                MetaTraderUI.updateAccount(acc_type);
            }
        });
    };

    const makeRequestObject = (acc_type, action) => {
        const req = {};

        Object.keys(fields[action]).forEach((field) => {
            const field_obj = fields[action][field];
            if (field_obj.request_field) {
                req[field_obj.request_field] = MetaTraderUI.$form().find(field_obj.id).val();
            }
        });

        // set main command
        req[`mt5_${action}`] = 1;

        // add additional fields
        $.extend(req, fields[action].additional_fields(acc_type));

        return req;
    };

    const submit = (e) => {
        e.preventDefault();
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

                const req = makeRequestObject(acc_type, action);
                BinarySocket.send(req).then((response) => {
                    if (response.error) {
                        MetaTraderUI.displayFormMessage(response.error.message, action);
                    } else {
                        const login = actions_info[action].login ?
                            actions_info[action].login(response) : accounts_info[acc_type].info.login;
                        if (!accounts_info[acc_type].info) {
                            accounts_info[acc_type].info = { login, currency: getPropertyValue(response, ['mt5_new_account', 'currency']) };
                            MetaTraderUI.setAccountType(acc_type, true);
                            BinarySocket.send({ mt5_login_list: 1 });
                        }
                        MetaTraderUI.loadAction(null, acc_type);
                        getAccountDetails(login, acc_type);
                        if (typeof actions_info[action].success_msg === 'function') {
                            MetaTraderUI.displayMainMessage(actions_info[action].success_msg(response));
                        }
                        if (typeof actions_info[action].onSuccess === 'function') {
                            actions_info[action].onSuccess(response, acc_type);
                        }
                    }
                    MetaTraderUI.enableButton(action);
                });
            });
        }
    };

    return {
        onLoad,
        isEligible,
    };
})();

module.exports = MetaTrader;
