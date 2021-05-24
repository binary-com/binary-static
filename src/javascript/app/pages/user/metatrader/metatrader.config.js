const BinaryPjax   = require('../../../base/binary_pjax');
const Client       = require('../../../base/client');
const Header       = require('../../../base/header');
const BinarySocket = require('../../../base/socket');
const Dialog       = require('../../../common/attach_dom/dialog');
const Currency     = require('../../../common/currency');
const Validation   = require('../../../common/form_validation');
const GTM          = require('../../../../_common/base/gtm');
const localize     = require('../../../../_common/localize').localize;
const State        = require('../../../../_common/storage').State;
const urlFor       = require('../../../../_common/url').urlFor;
const isBinaryApp  = require('../../../../config').isBinaryApp;

const MetaTraderConfig = (() => {
    const accounts_info = {};

    const getAccountsInfo = (key, accounts) => {
        const local_accounts_info = accounts || accounts_info;
        if (local_accounts_info[key]) return local_accounts_info[key];
        if (key && key.includes('synthetic')) return local_accounts_info[key.replace('synthetic', 'gaming')];
        return undefined;
    };

    let $messages;
    const needsRealMessage = () => $messages.find('#msg_switch').html();

    const newAccCheck = (acc_type, message_selector) => (
        new Promise((resolve) => {
            const $message = $messages.find('#msg_real_financial').clone();
            const is_virtual = Client.get('is_virtual');
            const is_demo = /^demo_/.test(acc_type);

            if (!Client.get('currency')) {
                resolve($messages.find('#msg_set_currency').html());
            } else if (is_demo) {
                resolve();
            } else if (is_virtual) { // virtual clients can only open demo MT accounts
                resolve(needsRealMessage());
            } else {
                BinarySocket.wait('get_settings').then(() => {
                    const showElementSetRedirect = (selector) => {
                        const $el = $message.find(selector);
                        $el.setVisibility(1);
                        const $link = $el.find('a');
                        $link.attr('href', `${$link.attr('href')}#mt5_redirect=${acc_type}`);
                    };
                    const resolveWithMessage = () => {
                        $message.find(message_selector).setVisibility(1);
                        resolve($message.html());
                    };

                    const sample_account = getSampleAccount(acc_type);

                    const has_financial_account = Client.hasAccountType('financial', 1);
                    const is_maltainvest        = sample_account.landing_company_short === 'maltainvest';
                    const is_financial          = sample_account.market_type === 'financial';
                    const is_demo_financial     = is_demo && is_financial;

                    if (is_maltainvest && (is_financial || is_demo_financial) && !has_financial_account) {
                        $message.find('.maltainvest').setVisibility(1);

                        resolveWithMessage();
                    }

                    const response_get_settings = State.getResponse('get_settings');
                    if (is_financial) {
                        if (sample_account.landing_company_short === 'svg') resolve();

                        let is_ok = true;
                        BinarySocket.wait('get_account_status', 'landing_company').then(async () => {
                            if (is_maltainvest && !has_financial_account) resolve();

                            const response_get_account_status = State.getResponse('get_account_status');
                            if (/financial_information_not_complete/.test(response_get_account_status.status)) {
                                showElementSetRedirect('.assessment');
                                is_ok = false;
                            } else if (/trading_experience_not_complete/.test(response_get_account_status.status)) {
                                showElementSetRedirect('.trading_experience');
                                is_ok = false;
                            }
                            if (+State.getResponse('landing_company.config.tax_details_required') === 1 && (!response_get_settings.tax_residence || !response_get_settings.tax_identification_number)) {
                                showElementSetRedirect('.tax');
                                is_ok = false;
                            }
                            if (!response_get_settings.citizen) {
                                showElementSetRedirect('.citizen');
                                is_ok = false;
                            }
                            if (!response_get_settings.account_opening_reason) {
                                showElementSetRedirect('.acc_opening_reason');
                                is_ok = false;
                            }
                            // UK Clients need to be authenticated first before they can proceed with account creation
                            if (is_ok && !isAuthenticated() && is_maltainvest && sample_account.sub_account_type === 'financial' && Client.get('residence') === 'gb') {
                                $('#view_1 .btn-next').addClass('button-disabled');
                                $('#authenticate_loading').setVisibility(1);
                                await setMaltaInvestIntention();
                                $('#authenticate_loading').setVisibility(0);
                                $message.find('.authenticate').setVisibility(1);
                                is_ok = false;
                            }
                            if (is_ok && !isAuthenticated() && sample_account.sub_account_type === 'financial_stp') {
                                // disable button must occur before loading
                                $('#view_1 .btn-next').addClass('button-disabled');
                                $('#authenticate_loading').setVisibility(1);
                                await setLabuanFinancialSTPIntention();
                                $('#authenticate_loading').setVisibility(0);
                                $message.find('.authenticate').setVisibility(1);
                                is_ok = false;
                            }

                            if (is_ok) resolve();
                            else resolveWithMessage();
                        });
                    } else if (sample_account.market_type === 'gaming' || sample_account.market_type === 'synthetic') {
                        let is_ok = true;
                        BinarySocket.wait('get_account_status', 'landing_company').then(async () => {
                            const response_get_account_status = State.getResponse('get_account_status');
                            if (/financial_assessment_not_complete/.test(response_get_account_status.status)) {
                                showElementSetRedirect('.assessment');
                                is_ok = false;
                            }

                            const should_have_malta = Client.getUpgradeInfo().can_upgrade_to.includes('malta');

                            if (is_ok && is_maltainvest && should_have_malta) {
                                $('#view_1 .btn-next').addClass('button-disabled');
                                $('#authenticate_loading').setVisibility(1);
                                $message.find('.malta').setVisibility(1);
                                await setMaltaIntention();
                                $('#authenticate_loading').setVisibility(0);
                                is_ok = false;
                                resolveWithMessage();
                            } else if (is_ok) {
                                resolve();
                            } else {
                                resolveWithMessage();
                            }
                        });
                    }
                });
            }
        })
    );

    const setLabuanFinancialSTPIntention = () => new Promise((resolve) => {
        const req = {
            account_type    : 'financial',
            dry_run         : 1,
            email           : Client.get('email'),
            leverage        : 100,
            mainPassword    : 'Test1234',
            mt5_account_type: 'financial_stp',
            mt5_new_account : 1,
            name            : 'test real labuan financial stp',
        };
        BinarySocket.send(req).then((dry_run_response) => {

            if (dry_run_response.error) {
                // update account status authentication info
                BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
                    resolve();
                });
            }
        });
    });

    const setMaltaIntention = () => new Promise((resolve) => {
        const req = {
            account_type    : 'gaming',
            dry_run         : 1,
            email           : Client.get('email'),
            leverage        : 100,
            mainPassword    : 'Test1234',
            mt5_account_type: 'financial',
            mt5_new_account : 1,
            name            : 'test real synthetic',
        };
        BinarySocket.send(req).then((dry_run_response) => {
            if (dry_run_response.error) {
                // update account status authentication info
                BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
                    resolve();
                });
            }
        });
    });
    const setMaltaInvestIntention = () => new Promise((resolve) => {
        const req = {
            account_type    : 'financial',
            dry_run         : 1,
            email           : Client.get('email'),
            leverage        : 100,
            mainPassword    : 'Test1234',
            mt5_account_type: 'financial',
            mt5_new_account : 1,
            name            : 'test real financial',
        };
        BinarySocket.send(req).then((dry_run_response) => {
            if (dry_run_response.error) {
                // update account status authentication info
                BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
                    resolve();
                });
            }
        });
    });

    const actions_info = {
        new_account: {
            title        : localize('Sign up'),
            login        : response => response.mt5_new_account.login,
            prerequisites: acc_type => (
                newAccCheck(acc_type, '#msg_metatrader_account')
            ),
            pre_submit: ($form, acc_type) => (
                new Promise((resolve) => {
                    const sample_account = getSampleAccount(acc_type);
                    const is_synthetic = sample_account.market_type === 'gaming' || sample_account.market_type === 'synthetic';
                    const is_demo = /^demo_/.test(acc_type);

                    if (is_synthetic && !is_demo && State.getResponse('landing_company.gaming_company.shortcode') === 'malta') {
                        Dialog.confirm({
                            id               : 'confirm_new_account',
                            localized_message: localize(['Trading contracts for difference (CFDs) on Synthetic Indices may not be suitable for everyone. Please ensure that you fully understand the risks involved, including the possibility of losing all the funds in your MT5 account. Gambling can be addictive – please play responsibly.', 'Do you wish to continue?']),
                        }).then((is_ok) => {
                            if (!is_ok) {
                                BinaryPjax.load(Client.defaultRedirectUrl());
                            }
                            resolve(is_ok);
                        });
                    } else if (!is_demo && Client.get('residence') === 'es') {
                        BinarySocket.send({ get_financial_assessment: 1 }).then((response) => {
                            const { cfd_score, trading_score } = response.get_financial_assessment;
                            const passed_financial_assessment = cfd_score === 4 || trading_score >= 8;
                            let message = [
                                localize('{SPAIN ONLY}You are about to purchase a product that is not simple and may be difficult to understand: Contracts for difference and forex. As a general rule, the CNMV considers that such products are not appropriate for retail clients, due to their complexity.'),
                                localize('{SPAIN ONLY}This is a product with leverage. You should be aware that losses may be higher than the amount initially paid to purchase the product.'),
                            ];
                            if (passed_financial_assessment) {
                                message.splice(1, 0, localize('{SPAIN ONLY}However, Binary Investments (Europe) Ltd has assessed your knowledge and experience and deems the product appropriate for you.'));
                            }
                            message = message.map(str => str.replace(/{SPAIN ONLY}/, '')); // remove '{SPAIN ONLY}' from english strings
                            Dialog.confirm({
                                id               : 'spain_cnmv_warning',
                                ok_text          : localize('Acknowledge'),
                                localized_message: message,
                            }).then((is_ok) => {
                                if (!is_ok) {
                                    BinaryPjax.load(Client.defaultRedirectUrl());
                                }
                                resolve(is_ok);
                            });
                        });
                    } else {
                        resolve(true);
                    }
                })
            ),
            onSuccess: (response) => {
                GTM.mt5NewAccount(response);

                BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
                    Header.displayAccountStatus();
                });

                $('#financial_authenticate_msg').setVisibility(isAuthenticationPromptNeeded());
            },
        },

        password_change: {
            title        : localize('Change Password'),
            success_msg  : response => localize('The investor password of account number [_1] has been changed.', [getDisplayLogin(response.echo_req.account_id)]),
            prerequisites: () => new Promise(resolve => resolve('')),
        },
        password_reset: {
            title: localize('Reset Password'),
        },
        verify_password_reset: {
            title               : localize('Verify Reset Password'),
            success_msg         : () => localize('Please check your email for further instructions.'),
            success_msg_selector: '#frm_verify_password_reset',
            onSuccess           : (response, $form) => {
                if (isBinaryApp()) {
                    $form.find('#frm_verify_password_reset').setVisibility(0);
                    const action      = 'verify_password_reset_token';
                    const reset_token = `#frm_${action}`;
                    $form.find(reset_token).setVisibility(1);
                    Validation.init(reset_token, validations()[action]);
                }
            },
        },
        verify_password_reset_token: {
            title    : localize('Verify Reset Password'),
            onSuccess: (response, $form) => {
                $form.find('#frm_verify_password_reset_token').setVisibility(0);
                const action         = 'password_reset';
                const password_reset = `#frm_${action}`;
                $form.find(password_reset).setVisibility(1);
                Validation.init(password_reset, validations()[action]);
            },
        },
        deposit: {
            title      : localize('Deposit'),
            success_msg: (response, acc_type) => localize('[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]', [
                Currency.formatMoney(State.getResponse('authorize.currency'), response.echo_req.amount),
                response.echo_req.from_binary,
                getAccountsInfo(acc_type).info.display_login,
                response.binary_transaction_id,
            ]),
            prerequisites: () => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else {
                    BinarySocket.wait('get_account_status').then((response_status) => {
                        if (!response_status.error && /cashier_locked/.test(response_status.get_account_status.status)) {
                            resolve(localize('Your cashier is locked.')); // Locked from BO
                        } else {
                            resolve();
                        }
                    });
                }
            }),
        },
        withdrawal: {
            title      : localize('Withdraw'),
            success_msg: (response, acc_type) => localize('[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]', [
                Currency.formatMoney(getCurrency(acc_type), response.echo_req.amount),
                getAccountsInfo(acc_type).info.display_login,
                response.echo_req.to_binary,
                response.binary_transaction_id,
            ]),
            prerequisites: acc_type => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else if (getAccountsInfo(acc_type).sub_account_type === 'financial' && getAccountsInfo(acc_type).landing_company_short !== 'svg') {
                    BinarySocket.wait('get_account_status').then(() => {
                        if (isAuthenticationPromptNeeded()) {
                            resolve($messages.find('#msg_authenticate').html());
                        }

                        resolve();
                    });
                } else {
                    resolve();
                }
            }),
        },
    };

    const fields = {
        new_account: {
            trading_password : { id: '#trading_password',     request_field: 'mainPassword' },
            ddl_trade_server : { id: '#ddl_trade_server', is_radio: true },
            chk_tnc          : { id: '#chk_tnc' },
            additional_fields: acc_type => {
                const sample_account = getSampleAccount(acc_type);
                const is_demo = /^demo_/.test(acc_type);
                const get_settings = State.getResponse('get_settings');
                const account_type = sample_account.market_type === 'synthetic' ? 'gaming' : sample_account.market_type;
                // First name is not set when user has no real account
                const name = get_settings.first_name && get_settings.last_name ? `${get_settings.first_name} ${get_settings.last_name}` : sample_account.title;
                return ({
                    name,
                    account_type: is_demo ? 'demo' : account_type,
                    email       : Client.get('email'),
                    leverage    : sample_account.leverage,
                    ...(!is_demo && hasMultipleTradeServers(acc_type, accounts_info) && {
                        server: $('#frm_new_account').find('#ddl_trade_server input[checked]').val(),
                    }),
                    ...(sample_account.market_type === 'financial' && {
                        mt5_account_type: sample_account.sub_account_type,
                    }),
                });
            },
        },
        password_change: {
            txt_old_password : { id: '#txt_old_password',  request_field: 'old_password' },
            txt_new_password : { id: '#txt_new_password',  request_field: 'new_password' },
            additional_fields:
                acc_type => ({
                    account_id: accounts_info[acc_type].info.login,
                    platform  : 'mt5',
                }),
        },
        password_reset: {
            txt_new_password : { id: '#txt_reset_new_password',  request_field: 'new_password' },
            additional_fields:
                (acc_type, token) => ({
                    account_id       : accounts_info[acc_type].info.login,
                    verification_code: token,
                    platform         : 'mt5',
                }),
        },
        verify_password_reset: {
            additional_fields:
                () => ({
                    verify_email: Client.get('email'),
                    type        : 'trading_platform_investor_password_reset',
                }),
        },
        verify_password_reset_token: {
            txt_verification_code: { id: '#txt_verification_code' },
        },
        deposit: {
            txt_amount       : { id: '#txt_amount_deposit', request_field: 'amount' },
            additional_fields:
                acc_type => ({
                    from_binary: Client.get('loginid'),
                    to_mt5     : getAccountsInfo(acc_type).info.login,
                }),
        },
        withdrawal: {
            txt_amount       : { id: '#txt_amount_withdrawal', request_field: 'amount' },
            additional_fields:
                acc_type => ({
                    from_mt5 : getAccountsInfo(acc_type).info.login,
                    to_binary: Client.get('loginid'),
                }),
        },
    };

    const validations = () => ({
        new_account: [
            { selector: fields.new_account.trading_password.id,     validations: [['req', { hide_asterisk: false }], 'password', 'compare_to_email'] },
            { selector: fields.new_account.ddl_trade_server.id,  validations: [['req', { hide_asterisk: true }]] },
        ],
        password_change: [
            { selector: fields.password_change.txt_old_password.id,    validations: [['req', { hide_asterisk: true }]] },
            { selector: fields.password_change.txt_new_password.id,    validations: [['req', { hide_asterisk: true }], 'password', ['not_equal', { to: fields.password_change.txt_old_password.id, name1: localize('Current password'), name2: localize('New password') }], 'compare_to_email'] },
        ],
        password_reset: [
            { selector: fields.password_reset.txt_new_password.id,    validations: [['req', { hide_asterisk: true }], 'password', 'compare_to_email'] },
        ],
        verify_password_reset_token: [
            { selector: fields.verify_password_reset_token.txt_verification_code.id, validations: [['req', { hide_asterisk: true }], 'token'], exclude_request: 1 },
        ],
        deposit: [
            {
                selector   : fields.deposit.txt_amount.id,
                validations: [
                    ['req', { hide_asterisk: true }],
                    // check if entered amount is less than the available balance
                    // e.g. transfer amount is 10 but client balance is 5
                    ['custom', {
                        func: () => {
                            const balance = Client.get('balance');

                            const is_balance_more_than_entered = +balance >= +$(fields.deposit.txt_amount.id).val();

                            return balance && is_balance_more_than_entered;
                        },
                        message: localize('You have insufficient funds in your Binary account, please <a href="[_1]">add funds</a>.', urlFor('cashier')),
                    }],
                    // check if balance is less than the minimum limit for transfer
                    // e.g. client balance could be 0.45 but min limit could be 1
                    ['custom', {
                        func: () => {
                            const balance         = Client.get('balance');
                            const min_req_balance = Currency.getTransferLimits(Client.get('currency'), 'min', 'mt5');

                            const is_balance_more_than_min_req = +balance >= +min_req_balance;

                            return balance && is_balance_more_than_min_req;
                        },
                        message: localize('Should be more than [_1]', Currency.getTransferLimits(Client.get('currency'), 'min', 'mt5')),
                    }],
                    // check if amount is between min and max
                    ['number', {
                        type: 'float',
                        min : () => Currency.getTransferLimits(Client.get('currency'), 'min', 'mt5'),
                        max : () => {
                            const mt5_limit = Currency.getTransferLimits(Client.get('currency'), 'max', 'mt5');
                            const balance   = Client.get('balance');

                            // if balance is 0, pass this validation so we can show insufficient funds in the next custom validation
                            return Math.min(mt5_limit, balance || mt5_limit).toFixed(Currency.getDecimalPlaces(Client.get('currency')));
                        },
                        decimals    : Currency.getDecimalPlaces(Client.get('currency')),
                        format_money: true,
                    }],
                ],
            },
        ],
        withdrawal: [
            {
                selector   : fields.withdrawal.txt_amount.id,
                validations: [
                    ['req', { hide_asterisk: true }],
                    // check if entered amount is less than the available balance
                    // e.g. transfer amount is 10 but client balance is 5
                    ['custom', {
                        func: () => {
                            const balance = getAccountsInfo(Client.get('mt5_account')).info.balance;
                            const is_balance_more_than_entered = +balance >= +$(fields.withdrawal.txt_amount.id).val();

                            return balance && is_balance_more_than_entered;
                        },
                        message: localize('You have insufficient funds in your MT5 account.'),
                    }],
                    // check if balance is less than the minimum limit for transfer
                    // e.g. client balance could be 0.45 but min limit could be 1
                    ['custom', {
                        func: () => {
                            const balance         = getAccountsInfo(Client.get('mt5_account')).info.balance;
                            const min_req_balance = Currency.getTransferLimits(getCurrency(Client.get('mt5_account')), 'min', 'mt5');

                            const is_balance_more_than_min_req = +balance >= +min_req_balance;

                            return balance && is_balance_more_than_min_req;
                        },
                        message: () => localize('Should be more than [_1]', Currency.getTransferLimits(getCurrency(Client.get('mt5_account')), 'min', 'mt5')),
                    }],
                    // check if amount is between min and max
                    ['number', {
                        type: 'float',
                        min : () => Currency.getTransferLimits(getCurrency(Client.get('mt5_account')), 'min', 'mt5'),
                        max : () => {
                            const mt5_limit = Currency.getTransferLimits(getCurrency(Client.get('mt5_account')), 'max', 'mt5');
                            const balance   = getAccountsInfo(Client.get('mt5_account')).info.balance;

                            // if balance is 0, pass this validation so we can show insufficient funds in the next custom validation
                            return Math.min(mt5_limit, balance || mt5_limit);
                        },
                        decimals    : 2,
                        format_money: true,
                    }],
                ],
            },
        ],
    });

    const hasAccount = acc_type => (getAccountsInfo(acc_type) || {}).info;

    const getCurrency = acc_type => getAccountsInfo(acc_type).info.currency;

    // if you have acc_type, use getAccountsInfo(acc_type).info.display_login
    // otherwise, use this function to format login into display login
    const getDisplayLogin = login => login.replace(/^MT[DR]?/i, '');

    const isAuthenticated = () =>
        State.getResponse('get_account_status').status.indexOf('authenticated') !== -1;

    const isAuthenticationPromptNeeded = () => {
        const authentication = State.getResponse('get_account_status.authentication');
        const { identity, needs_verification } = authentication;
        const is_need_verification = needs_verification.length;
        const has_been_authenticated = /^(rejected|expired|verified)$/.test(identity.status);

        if (has_been_authenticated) return false;

        return is_need_verification;
    };

    // remove server from acc_type for cases where we don't need it
    // e.g. during new account creation no server is set yet
    // due to ability for server names to have one or more underscores in the name
    // we can pass the number of underscores to remove it from acc_type
    // f.e. getCleanAccType('financial_ts01_02', 2) returns 'financial'
    const getCleanAccType = (acc_type, underscores) => {
        if (underscores > 1) {
            // eslint-disable-next-line no-param-reassign
            acc_type = getCleanAccType(acc_type, --underscores);
        }
        return /\d$/.test(acc_type) ? acc_type.substr(0, acc_type.lastIndexOf('_')) : acc_type;
    };

    // if no server exists yet, e.g. during new account creation
    // we want to get information like landing company etc which is shared
    // between all the servers, so we can disregard the server and return the first
    // accounts_info item that has the same market type and sub account type
    const getSampleAccount = (acc_type) => {
        if (acc_type in accounts_info) {
            return getAccountsInfo(acc_type);
        }
        const regex = new RegExp(getCleanAccType(acc_type));
        return getAccountsInfo(Object.keys(accounts_info).find(account => regex.test(account)));
    };

    const hasTradeServers = (acc_type) => {
        const is_real = acc_type.startsWith('real');
        const is_gaming = getAccountsInfo(acc_type).market_type === 'gaming' || getAccountsInfo(acc_type).market_type === 'synthetic';
        const is_clean_type = acc_type.endsWith('financial') || acc_type.endsWith('stp');
        if ((/unknown/.test(acc_type))) {
            return false;
        }
        return !(is_real && (is_gaming || is_clean_type));
    };

    const hasMultipleTradeServers = (acc_type, accounts) => {
        // we need to call getCleanAccType twice as the server names have underscore in it
        const clean_acc_type_a = getCleanAccType(acc_type, 2);
        return Object.keys(accounts).filter(acc_type_b => clean_acc_type_a ===
            getCleanAccType(acc_type_b, 2)).length > 1;
    };

    return {
        accounts_info,
        actions_info,
        fields,
        validations,
        needsRealMessage,
        hasAccount,
        hasTradeServers,
        hasMultipleTradeServers,
        getCleanAccType,
        getCurrency,
        getDisplayLogin,
        getSampleAccount,
        isAuthenticated,
        isAuthenticationPromptNeeded,
        setMessages   : ($msg) => { $messages = $msg; },
        getAllAccounts: () => (
            Object.keys(accounts_info)
                .filter(acc_type => hasAccount(acc_type))
                .sort(acc_type => (getAccountsInfo(acc_type).is_demo ? 1 : -1)) // real first
        ),
        getAccountsInfo,
    };
})();

module.exports = MetaTraderConfig;
