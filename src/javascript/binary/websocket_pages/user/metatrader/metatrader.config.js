const BinarySocket  = require('../../socket');
const Client        = require('../../../base/client');
const localize      = require('../../../base/localize').localize;
const urlFor        = require('../../../base/url').urlFor;
const isEmptyObject = require('../../../base/utility').isEmptyObject;
const formatMoney   = require('../../../common_functions/currency_to_symbol').formatMoney;

const MetaTraderConfig = (() => {
    'use strict';

    const currency = 'USD';

    const types_info = {
        demo            : { account_type: 'demo',      mt5_account_type: '',         title: localize('Demo'),            max_leverage: 1000, is_demo: true },
        vanuatu_cent    : { account_type: 'financial', mt5_account_type: 'cent',     title: localize('Real Cent'),       max_leverage: 1000 },
        vanuatu_standard: { account_type: 'financial', mt5_account_type: 'standard', title: localize('Real Standard'),   max_leverage: 300 },
        vanuatu_stp     : { account_type: 'financial', mt5_account_type: 'stp',      title: localize('Real STP'),        max_leverage: 100 },
        costarica       : { account_type: 'gaming',    mt5_account_type: '',         title: localize('Real Volatility'), max_leverage: 100 },
    };

    const needsRealMessage = () => $(`#msg_${Client.get('has_real') ? 'switch' : 'upgrade'}`).html();

    const actions_info = {
        new_account: {
            title      : localize('Create Account'),
            success_msg: (response) => {
                let acc_type = response.mt5_new_account.account_type;
                switch (acc_type) {
                    case 'financial': acc_type = `vanuatu_${response.mt5_new_account.mt5_account_type}`; break;
                    case 'gaming'   : acc_type = 'costarica'; break;
                    // no default
                }
                return localize('Congratulations! Your [_1] Account has been created.', [types_info[acc_type].title]);
            },
            login        : response => response.mt5_new_account.login,
            prerequisites: acc_type => (
                new Promise((resolve) => {
                    if (types_info[acc_type].is_demo) {
                        resolve();
                    } else if (Client.get('is_virtual')) {
                        resolve(needsRealMessage());
                    } else if (types_info[acc_type].account_type === 'financial') {
                        BinarySocket.send({ get_financial_assessment: 1 }).then((response_financial) => {
                            resolve(isEmptyObject(response_financial.get_financial_assessment) ?
                                $('#msg_assessment').find('a').attr('onclick', `localStorage.setItem('financial_assessment_redirect', '${urlFor('user/metatrader')}')`).end()
                                    .html() : '');
                        });
                    } else {
                        resolve();
                    }
                })
            ),
            formValues: ($form, acc_type, action) => {
                // Account type, Sub account type
                $form.find(fields[action].lbl_account_type.id).text(types_info[acc_type].title);
                // Email
                $form.find(fields[action].lbl_email.id).text(fields[action].additional_fields(acc_type).email);
                // Max leverage
                $form.find(`${fields[action].ddl_leverage.id} option`).each(function() {
                    if (+$(this).val() > types_info[acc_type].max_leverage) {
                        $(this).remove();
                    }
                });
            },
        },
        password_change: {
            title        : localize('Change Password'),
            success_msg  : response => localize('The main password of account number [_1] has been changed.', [response.echo_req.login]),
            prerequisites: () => new Promise(resolve => resolve('')),
            formValues   : ($form, acc_type, action) => {
                // Login ID
                $form.find(fields[action].lbl_login.id).text(fields[action].additional_fields(acc_type).login);
            },
        },
        deposit: {
            title      : localize('Deposit'),
            success_msg: response => localize('[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]', [
                formatMoney(currency, response.echo_req.amount),
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
                            resolve();
                        }
                    });
                }
            }),
            formValues: ($form, acc_type, action) => {
                // From, To
                $form.find(fields[action].lbl_from.id).text(fields[action].additional_fields(acc_type).from_binary);
                $form.find(fields[action].lbl_to.id).text(fields[action].additional_fields(acc_type).to_mt5);
            },
        },
        withdrawal: {
            title      : localize('Withdraw'),
            success_msg: response => localize('[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]', [
                formatMoney(currency, response.echo_req.amount),
                response.echo_req.from_mt5,
                response.echo_req.to_binary,
                response.binary_transaction_id,
            ]),
            prerequisites: acc_type => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else if (types_info[acc_type].account_type === 'financial') {
                    BinarySocket.send({ get_account_status: 1 }).then((response_status) => {
                        resolve($.inArray('authenticated', response_status.get_account_status.status) === -1 ?
                            $('#msg_authenticate').find('.show_for_mt5').setVisibility(1).end()
                                .html() : '');
                    });
                } else {
                    resolve();
                }
            }),
            pre_submit: ($form, acc_type, displayFormMessage) => (
                BinarySocket.send({
                    mt5_password_check: 1,
                    login             : types_info[acc_type].account_info.login,
                    password          : $form.find(fields.withdrawal.txt_main_pass.id).val(),
                }).then((response) => {
                    if (+response.mt5_password_check === 1) {
                        return true;
                    } else if (response.error) {
                        displayFormMessage(response.error.message);
                    }
                    return false;
                })
            ),
            formValues: ($form, acc_type, action) => {
                // From, To
                $form.find(fields[action].lbl_from.id).text(fields[action].additional_fields(acc_type).from_mt5);
                $form.find(fields[action].lbl_to.id).text(fields[action].additional_fields(acc_type).to_binary);
            },
        },
    };

    const fields = {
        new_account: {
            lbl_account_type : { id: '#lbl_account_type' },
            lbl_email        : { id: '#lbl_email' },
            txt_name         : { id: '#txt_name',          request_field: 'name' },
            ddl_leverage     : { id: '#ddl_leverage',      request_field: 'leverage' },
            txt_main_pass    : { id: '#txt_main_pass',     request_field: 'mainPassword' },
            txt_re_main_pass : { id: '#txt_re_main_pass' },
            txt_investor_pass: { id: '#txt_investor_pass', request_field: 'investPassword' },
            chk_tnc          : { id: '#chk_tnc' },
            additional_fields:
                acc_type => ($.extend(
                    {
                        account_type: types_info[acc_type].account_type,
                        email       : Client.get('email'),
                    },
                    types_info[acc_type].mt5_account_type ? {
                        mt5_account_type: types_info[acc_type].mt5_account_type,
                    } : {})),
        },
        password_change: {
            lbl_login          : { id: '#lbl_login' },
            txt_old_password   : { id: '#txt_old_password', request_field: 'old_password' },
            txt_new_password   : { id: '#txt_new_password', request_field: 'new_password' },
            txt_re_new_password: { id: '#txt_re_new_password' },
            additional_fields  :
                acc_type => ({
                    login: types_info[acc_type].account_info.login,
                }),
        },
        deposit: {
            lbl_from         : { id: '#lbl_from' },
            lbl_to           : { id: '#lbl_to' },
            txt_amount       : { id: '#txt_amount', request_field: 'amount' },
            additional_fields:
                acc_type => ({
                    from_binary: Client.get('loginid'),
                    to_mt5     : types_info[acc_type].account_info.login,
                }),
        },
        withdrawal: {
            lbl_from         : { id: '#lbl_from' },
            lbl_to           : { id: '#lbl_to' },
            txt_amount       : { id: '#txt_amount', request_field: 'amount' },
            txt_main_pass    : { id: '#txt_main_pass' },
            additional_fields:
                acc_type => ({
                    from_mt5 : types_info[acc_type].account_info.login,
                    to_binary: Client.get('loginid'),
                }),
        },
    };

    const validations = {
        new_account: [
            { selector: fields.new_account.txt_name.id,          validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]] },
            { selector: fields.new_account.txt_main_pass.id,     validations: ['req', 'password'] },
            { selector: fields.new_account.txt_re_main_pass.id,  validations: ['req', ['compare', { to: fields.new_account.txt_main_pass.id }]] },
            { selector: fields.new_account.txt_investor_pass.id, validations: ['req', 'password', ['not_equal', { to: fields.new_account.txt_main_pass.id, name1: 'Main password', name2: 'Investor password' }]] },
            { selector: fields.new_account.ddl_leverage.id,      validations: ['req'] },
            { selector: fields.new_account.chk_tnc.id,           validations: [['req', { message: 'Please accept the terms and conditions.' }]] },
        ],
        password_change: [
            { selector: fields.password_change.txt_old_password.id,    validations: ['req'] },
            { selector: fields.password_change.txt_new_password.id,    validations: ['req', 'password', ['not_equal', { to: fields.password_change.txt_old_password.id, name1: 'Current password', name2: 'New password' }]], re_check_field: fields.password_change.txt_re_new_password.id },
            { selector: fields.password_change.txt_re_new_password.id, validations: ['req', ['compare', { to: fields.password_change.txt_new_password.id }]] },
        ],
        deposit: [
            { selector: fields.deposit.txt_amount.id, validations: ['req', ['number', { type: 'float', min: 1, max: 20000 }]] },
        ],
        withdrawal: [
            { selector: fields.withdrawal.txt_main_pass.id, validations: ['req'] },
            { selector: fields.withdrawal.txt_amount.id,    validations: ['req', ['number', { type: 'float', min: 1, max: 20000 }]] },
        ],
    };

    return {
        types_info  : types_info,
        actions_info: actions_info,
        fields      : fields,
        validations : validations,
    };
})();

module.exports = MetaTraderConfig;
