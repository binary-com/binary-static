const BinaryPjax   = require('../../../base/binary_pjax');
const Client       = require('../../../base/client');
const BinarySocket = require('../../../base/socket');
const Dialog       = require('../../../common/attach_dom/dialog');
const Currency     = require('../../../common/currency');
const GTM          = require('../../../../_common/base/gtm');
const localize     = require('../../../../_common/localize').localize;
const State        = require('../../../../_common/storage').State;
const urlFor       = require('../../../../_common/url').urlFor;

const MetaTraderConfig = (() => {
    const mt_companies = {
        financial: {
            standard: { mt5_account_type: 'standard',      max_leverage: 1000, title: 'Standard' },
            advanced: { mt5_account_type: 'advanced',      max_leverage: 300,  title: 'Advanced' },
            mamm    : { mt5_account_type: 'mamm_advanced', max_leverage: 300,  title: 'MAM Advanced', is_real_only: 1 },
        },
        gaming: {
            volatility: { mt5_account_type: '',     max_leverage: 500, title: 'Volatility Indices' },
            mamm      : { mt5_account_type: 'mamm', max_leverage: 500, title: 'MAM Volatility Indices', is_real_only: 1 },
        },
    };

    const accounts_info = {};

    let $messages;
    const needsRealMessage = () => $messages.find(`#msg_${Client.hasAccountType('real') ? 'switch' : 'upgrade'}`).html();

    // currency equivalent to 1 USD
    const getMinMT5TransferValue = (currency) => (
        (+State.getResponse(`exchange_rates.rates.${currency}`) || 1).toFixed(Currency.getDecimalPlaces(currency))
    );

    // currency equivalent to 20000 USD
    const getMaxMT5TransferValue = (currency) => (
        (+getMinMT5TransferValue(currency) * 20000).toFixed(Currency.getDecimalPlaces(currency))
    );

    const newAccCheck = (acc_type, message_selector) => (
        new Promise((resolve) => {
            if (accounts_info[acc_type].is_demo) {
                resolve();
            } else if (Client.get('is_virtual')) {
                resolve(needsRealMessage());
            } else if (accounts_info[acc_type].account_type === 'financial') {
                BinarySocket.wait('get_account_status').then((response_get_account_status) => {
                    const $message = $messages.find('#msg_real_financial').clone();
                    let is_ok = true;
                    if (/(financial_assessment|trading_experience)_not_complete/.test(response_get_account_status.get_account_status.status)) {
                        $message.find('.assessment').setVisibility(1).find('a').attr('onclick', `localStorage.setItem('financial_assessment_redirect', '${urlFor('user/metatrader')}#${acc_type}')`);
                        is_ok = false;
                    }
                    if (response_get_account_status.get_account_status.prompt_client_to_authenticate) {
                        $message.find('.authenticate').setVisibility(1);
                        is_ok = false;
                    }
                    if (is_ok) {
                        resolve();
                    } else {
                        $message.find(message_selector).setVisibility(1);
                        resolve($message.html());
                    }
                });
            } else {
                resolve();
            }
        })
    );

    const actions_info = {
        new_account: {
            title        : localize('Sign up'),
            login        : response => response.mt5_new_account.login,
            prerequisites: acc_type => (
                newAccCheck(acc_type, '#msg_metatrader_account')
            ),
            pre_submit: ($form, acc_type) => (
                new Promise((resolve) => {
                    if (!accounts_info[acc_type].is_demo && State.getResponse('landing_company.gaming_company.shortcode') === 'malta') {
                        Dialog.confirm({
                            id     : 'confirm_new_account',
                            message: ['Trading Contracts for Difference (CFDs) on Volatility Indices may not be suitable for everyone. Please ensure that you fully understand the risks involved, including the possibility of losing all the funds in your MT5 account. Gambling can be addictive – please play responsibly.', 'Do you wish to continue?'],
                        }).then((is_ok) => {
                            if (!is_ok) {
                                BinaryPjax.load(Client.defaultRedirectUrl());
                            }
                            resolve(is_ok);
                        });
                    } else {
                        resolve(true);
                    }
                })
            ),
            onSuccess: (response) => {
                GTM.mt5NewAccount(response);
            },
        },
        new_account_mam: {
            title        : localize('Sign up'),
            login        : response => response.mt5_new_account.login,
            prerequisites: acc_type => (
                newAccCheck(acc_type, '#msg_mam_account')
            ),
            onSuccess: (response) => {
                GTM.mt5NewAccount(response);
            },
        },
        password_change: {
            title        : localize('Change Password'),
            success_msg  : response => localize('The [_1] password of account number [_2] has been changed.', [response.echo_req.password_type, response.echo_req.login]),
            prerequisites: () => new Promise(resolve => resolve('')),
        },
        password_reset: {
            title: localize('Reset Password'),
        },
        verify_password_reset: {
            title               : localize('Verify Reset Password'),
            success_msg         : () => localize('Please check your email for further instructions.'),
            success_msg_selector: '#frm_verify_password_reset',
        },
        revoke_mam: {
            title        : localize('Revoke MAM'),
            success_msg  : () => localize('Manager successfully revoked'),
            prerequisites: () => new Promise(resolve => resolve('')),
        },
        deposit: {
            title      : localize('Deposit'),
            success_msg: response => localize('[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]', [
                Currency.formatMoney(State.getResponse('authorize.currency'), response.echo_req.amount),
                response.echo_req.from_binary,
                response.echo_req.to_mt5,
                response.binary_transaction_id,
            ]),
            prerequisites: () => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else {
                    BinarySocket.send({ cashier_password: 1 }).then((response) => {
                        if (!response.error && response.cashier_password === 1) {
                            resolve(localize('Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.', [
                                urlFor('user/security/cashier_passwordws')]));
                        } else {
                            BinarySocket.send({ get_account_status: 1 }).then((response_status) => {
                                if (!response_status.error && /cashier_locked/.test(response_status.get_account_status.status)) {
                                    resolve(localize('Your cashier is locked.')); // Locked from BO
                                } else {
                                    const limit = State.getResponse('get_limits.remainder');
                                    if (typeof limit !== 'undefined' && +limit < getMinMT5TransferValue(Client.get('currency'))) {
                                        resolve(localize('You have reached the limit.'));
                                    } else {
                                        resolve();
                                    }
                                }
                            });
                        }
                    });
                }
            }),
        },
        withdrawal: {
            title      : localize('Withdraw'),
            success_msg: (response, acc_type) => localize('[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]', [
                Currency.formatMoney(getCurrency(acc_type), response.echo_req.amount),
                response.echo_req.from_mt5,
                response.echo_req.to_binary,
                response.binary_transaction_id,
            ]),
            prerequisites: acc_type => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else if (accounts_info[acc_type].account_type === 'financial') {
                    BinarySocket.send({ get_account_status: 1 }).then((response_status) => {
                        resolve(!/authenticated/.test(response_status.get_account_status.status) ?
                            $messages.find('#msg_authenticate').html() : '');
                    });
                } else {
                    resolve();
                }
            }),
            pre_submit: ($form, acc_type, displayFormMessage) => (
                BinarySocket.send({
                    mt5_password_check: 1,
                    login             : accounts_info[acc_type].info.login,
                    password          : $form.find(fields.withdrawal.txt_main_pass.id).val(),
                }).then((response) => {
                    if (+response.mt5_password_check === 1) {
                        return true;
                    } else if (response.error) {
                        displayFormMessage(response.error.message, 'withdrawal');
                    }
                    return false;
                })
            ),
        },
    };

    const fields = {
        new_account: {
            txt_name         : { id: '#txt_name',          request_field: 'name' },
            txt_main_pass    : { id: '#txt_main_pass',     request_field: 'mainPassword' },
            txt_re_main_pass : { id: '#txt_re_main_pass' },
            txt_investor_pass: { id: '#txt_investor_pass', request_field: 'investPassword' },
            chk_tnc          : { id: '#chk_tnc' },
            additional_fields:
                acc_type => ($.extend(
                    {
                        account_type: accounts_info[acc_type].account_type,
                        email       : Client.get('email'),
                        leverage    : accounts_info[acc_type].max_leverage,
                    },
                    accounts_info[acc_type].mt5_account_type ? {
                        mt5_account_type: accounts_info[acc_type].mt5_account_type,
                    } : {})),
        },
        new_account_mam: {
            txt_name         : { id: '#txt_mam_name',          request_field: 'name' },
            txt_manager_id   : { id: '#txt_manager_id',        request_field: 'manager_id' },
            txt_main_pass    : { id: '#txt_mam_main_pass',     request_field: 'mainPassword' },
            txt_re_main_pass : { id: '#txt_mam_re_main_pass' },
            txt_investor_pass: { id: '#txt_mam_investor_pass', request_field: 'investPassword' },
            chk_tnc          : { id: '#chk_tnc' },
            additional_fields:
                acc_type => (
                    {
                        account_type    : accounts_info[acc_type].account_type,
                        email           : Client.get('email'),
                        leverage        : accounts_info[acc_type].max_leverage,
                        mt5_account_type: accounts_info[acc_type].mt5_account_type.replace(/mamm(_)*/, '') || 'standard', // for gaming just send standard to distinguish
                    }
                ),
        },
        password_change: {
            ddl_password_type  : { id: '#ddl_password_type', request_field: 'password_type' },
            txt_old_password   : { id: '#txt_old_password',  request_field: 'old_password' },
            txt_new_password   : { id: '#txt_new_password',  request_field: 'new_password' },
            txt_re_new_password: { id: '#txt_re_new_password' },
            additional_fields  :
                acc_type => ({
                    login: accounts_info[acc_type].info.login,
                }),
        },
        password_reset: {
            ddl_password_type  : { id: '#ddl_reset_password_type', request_field: 'password_type' },
            txt_new_password   : { id: '#txt_reset_new_password',  request_field: 'new_password' },
            txt_re_new_password: { id: '#txt_reset_re_new_password' },
            additional_fields  :
                (acc_type, token) => ({
                    login            : accounts_info[acc_type].info.login,
                    verification_code: token,
                }),
        },
        verify_password_reset: {
            additional_fields:
                () => ({
                    verify_email: Client.get('email'),
                    type        : 'mt5_password_reset',
                }),
        },
        revoke_mam: {
            additional_fields:
                acc_type => ({
                    mt5_mamm: 1,
                    login   : accounts_info[acc_type].info.login,
                    action  : 'revoke',
                }),
        },
        deposit: {
            txt_amount       : { id: '#txt_amount_deposit', request_field: 'amount' },
            additional_fields:
                acc_type => ({
                    from_binary: Client.get('loginid'),
                    to_mt5     : accounts_info[acc_type].info.login,
                }),
        },
        withdrawal: {
            txt_amount       : { id: '#txt_amount_withdrawal', request_field: 'amount' },
            txt_main_pass    : { id: '#txt_main_pass_wd' },
            additional_fields:
                acc_type => ({
                    from_mt5 : accounts_info[acc_type].info.login,
                    to_binary: Client.get('loginid'),
                }),
        },
    };

    const validations = () => ({
        new_account: [
            { selector: fields.new_account.txt_name.id,          validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]] },
            { selector: fields.new_account.txt_main_pass.id,     validations: ['req', ['password', 'mt']] },
            { selector: fields.new_account.txt_re_main_pass.id,  validations: ['req', ['compare', { to: fields.new_account.txt_main_pass.id }]] },
            { selector: fields.new_account.txt_investor_pass.id, validations: ['req', ['password', 'mt'], ['not_equal', { to: fields.new_account.txt_main_pass.id, name1: 'Main password', name2: 'Investor password' }]] },
        ],
        new_account_mam: [
            { selector: fields.new_account_mam.txt_name.id,          validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]] },
            { selector: fields.new_account_mam.txt_manager_id.id,    validations: ['req', ['length', { min: 0, max: 15 }]] },
            { selector: fields.new_account_mam.txt_main_pass.id,     validations: ['req', ['password', 'mt']] },
            { selector: fields.new_account_mam.txt_re_main_pass.id,  validations: ['req', ['compare', { to: fields.new_account_mam.txt_main_pass.id }]] },
            { selector: fields.new_account_mam.txt_investor_pass.id, validations: ['req', ['password', 'mt'], ['not_equal', { to: fields.new_account_mam.txt_main_pass.id, name1: 'Main password', name2: 'Investor password' }]] },
            { selector: fields.new_account_mam.chk_tnc.id,           validations: ['req'] },
        ],
        password_change: [
            { selector: fields.password_change.ddl_password_type.id,   validations: ['req'] },
            { selector: fields.password_change.txt_old_password.id,    validations: ['req'] },
            { selector: fields.password_change.txt_new_password.id,    validations: ['req', ['password', 'mt'], ['not_equal', { to: fields.password_change.txt_old_password.id, name1: 'Current password', name2: 'New password' }]], re_check_field: fields.password_change.txt_re_new_password.id },
            { selector: fields.password_change.txt_re_new_password.id, validations: ['req', ['compare', { to: fields.password_change.txt_new_password.id }]] },
        ],
        password_reset: [
            { selector: fields.password_reset.ddl_password_type.id,   validations: ['req'] },
            { selector: fields.password_reset.txt_new_password.id,    validations: ['req', ['password', 'mt']], re_check_field: fields.password_reset.txt_re_new_password.id },
            { selector: fields.password_reset.txt_re_new_password.id, validations: ['req', ['compare', { to: fields.password_reset.txt_new_password.id }]] },
        ],
        deposit: [
            { selector: fields.deposit.txt_amount.id, validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', min: () => getMinMT5TransferValue(Client.get('currency')), max: Math.min(State.getResponse('get_limits.remainder') || getMaxMT5TransferValue(Client.get('currency')), getMaxMT5TransferValue(Client.get('currency'))).toFixed(Currency.getDecimalPlaces(Client.get('currency'))), decimals: Currency.getDecimalPlaces(Client.get('currency')) }], ['custom', { func: () => (Client.get('balance') && (+Client.get('balance') >= +$(fields.deposit.txt_amount.id).val())), message: localize('You have insufficient funds in your Binary account, please <a href="[_1]">add funds</a>.', [urlFor('cashier')]) }]] },
        ],
        withdrawal: [
            { selector: fields.withdrawal.txt_main_pass.id, validations: [['req', { hide_asterisk: true }]] },
            { selector: fields.withdrawal.txt_amount.id,    validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', min: () => getMinMT5TransferValue(getCurrency(Client.get('mt5_account'))), max: () => getMaxMT5TransferValue(getCurrency(Client.get('mt5_account'))), decimals: 2 }]] },
        ],
    });

    const hasAccount = acc_type => (accounts_info[acc_type] || {}).info;

    const getCurrency = acc_type => accounts_info[acc_type].info.currency;

    return {
        mt_companies,
        accounts_info,
        actions_info,
        fields,
        validations,
        needsRealMessage,
        hasAccount,
        getCurrency,
        setMessages   : ($msg) => { $messages = $msg; },
        getAllAccounts: () => (
            Object.keys(accounts_info)
                .filter(acc_type => hasAccount(acc_type))
                .sort(acc_type => (accounts_info[acc_type].is_demo ? 1 : -1)) // real first
        ),
    };
})();

module.exports = MetaTraderConfig;
