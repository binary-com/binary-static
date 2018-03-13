const MetaTraderConfig = require('./metatrader.config');
const Client           = require('../../../base/client');
const formatMoney      = require('../../../common/currency').formatMoney;
const Validation       = require('../../../common/form_validation');
const localize         = require('../../../../_common/localize').localize;
const urlForStatic     = require('../../../../_common/url').urlForStatic;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;
const template         = require('../../../../_common/utility').template;

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
        validations,
        submit;

    const accounts_info = MetaTraderConfig.accounts_info;
    const actions_info  = MetaTraderConfig.actions_info;

    const init = (submit_func) => {
        submit       = submit_func;
        $container   = $('#mt_account_management');
        $mt5_account = $container.find('#mt5_account');
        $list_cont   = $container.find('#accounts_list');
        $list        = $list_cont.find('> div.list');
        $detail      = $container.find('#account_details');
        $action      = $container.find('#fst_action');
        $templates   = $container.find('#templates').remove();
        $main_msg    = $container.find('#main_msg');
        $container.find('[class*="act_"]').click(populateForm);

        MetaTraderConfig.setMessages($templates.find('#messages'));

        validations = MetaTraderConfig.validations();

        populateAccountTypes();
        populateAccountList();
    };

    const populateAccountList = () => {
        const $acc_name = $templates.find('> .acc-name');
        let acc_group_demo_set = false;
        let acc_group_real_set = false;
        Object.keys(accounts_info)
            .sort((a, b) => accounts_info[a].account_type > accounts_info[b].account_type ? 1 : -1)
            .forEach((acc_type) => {
                if ($list.find(`[value="${acc_type}"]`).length === 0) {
                    if (/^demo/.test(acc_type)) {
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

    const updateAccount = (acc_type) => {
        updateListItem(acc_type);
        setCurrentAccount(acc_type);
    };

    const setMTAccountText = () => {
        const acc_type = $mt5_account.attr('value');
        if (acc_type) {
            const login = getPropertyValue(accounts_info[acc_type], ['info', 'login']);
            const title = `${accounts_info[acc_type].title}${ login ? ` (${login})` : '' }`;
            if (!new RegExp(title).test($mt5_account.text())) {
                $mt5_account.html(title);
            }
        }
    };

    const updateListItem = (acc_type) => {
        const $acc_item = $list.find(`[value="${acc_type}"]`);
        $acc_item.find('.mt-type').text(accounts_info[acc_type].title.replace(/(demo|real)\s/i, ''));
        if (accounts_info[acc_type].info) {
            setMTAccountText();
            $acc_item.find('.mt-login').text(`(${accounts_info[acc_type].info.login})`);
            $acc_item.setVisibility(1);
            if (/demo/.test(accounts_info[acc_type].account_type)) {
                $list.find('#acc_group_demo').setVisibility(1);
            } else {
                $list.find('#acc_group_real').setVisibility(1);
            }
            if (acc_type === Client.get('mt5_account')) {
                const mt_balance = formatMoney(MetaTraderConfig.getCurrency(acc_type),
                    +accounts_info[acc_type].info.balance);
                $acc_item.find('.mt-balance').html(mt_balance);
                $action.find('.mt5-balance').html(mt_balance);
            }
            if (Object.keys(accounts_info).every(type => accounts_info[type].info)) {
                $container.find('.act_new_account').remove();
            }
        } else {
            $acc_item.setVisibility(0);
        }
    };

    const displayAccountDescription = (acc_type) => {
        $container.find('#account_desc').html($templates.find(`.account-desc .${acc_type}`).clone());
    };

    const setCurrentAccount = (acc_type) => {
        if (Client.get('mt5_account') && Client.get('mt5_account') !== acc_type) return;

        displayAccountDescription(acc_type);

        if (accounts_info[acc_type].info) {
            // Update account info
            $detail.find('.acc-info div[data]').map(function () {
                const key     = $(this).attr('data');
                const info    = accounts_info[acc_type].info[key];
                const mapping = {
                    balance : () => (isNaN(info) ? '' : formatMoney(MetaTraderConfig.getCurrency(acc_type), +info)),
                    leverage: () => `1:${info}`,
                    login   : () => (`${info} (${localize(/demo/.test(accounts_info[acc_type].account_type) ? 'Demo Account' : 'Real-Money Account')})`),
                };
                $(this).html(typeof mapping[key] === 'function' ? mapping[key]() : info);
            });
            // $container.find('.act_cashier').setVisibility(!types_info[acc_type].is_demo);
            $container.find('.has-account').setVisibility(1);
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
        if (accounts_info[acc_type].info) {
            type = accounts_info[acc_type].is_demo ? 'password_change' : 'cashier';
        }
        return type;
    };

    const loadAction = (action, acc_type) => {
        $container.find(`[class*=act_${action || defaultAction(acc_type)}]`).click();
    };

    const populateForm = (e) => {
        let $target = $(e.target);
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

            if (action === 'password_change') {
                $form.find('label[for*="_password"]').append(` (${localize('for MT5 Account')} ${accounts_info[acc_type].info.login})`);
            }

            $form.find('button[type="submit"]').each(function() { // cashier has two different actions
                const this_action = $(this).attr('action');
                actions_info[this_action].$form = $(this).parents('form');
                $(this).attr({ acc_type }).on('click dblclick', submit);
                Validation.init(`#frm_${this_action}`, validations[this_action]);
            });

            handleNewAccountUI(action, acc_type, $target);
        };

        if (action === 'new_account') {
            cloneForm();
            return;
        }

        if (!actions_info[action]) { // Manage Fund
            cloneForm();
            $form.find('.binary-account').text(`${localize('[_1] Account [_2]', ['Binary', Client.get('loginid')])}`);
            $form.find('.binary-balance').html(`${formatMoney(Client.get('currency'), Client.get('balance'))}`);
            $form.find('.mt5-account').text(`${localize('[_1] Account [_2]', [accounts_info[acc_type].title, accounts_info[acc_type].info.login])}`);
            $form.find('.mt5-balance').html(`${formatMoney(MetaTraderConfig.getCurrency(acc_type), accounts_info[acc_type].info.balance)}`);
            $form.find('label[for^="txt_amount_"]').append(` ${MetaTraderConfig.getCurrency(acc_type)}`);
            ['deposit', 'withdrawal'].forEach((act) => {
                actions_info[act].prerequisites(acc_type).then((error_msg) => {
                    if (error_msg) {
                        $container.find(`#frm_${act} .form`).replaceWith($('<p/>', { class: 'unavailable' }));
                        displayMessage(`#frm_${act} .unavailable`, error_msg, true);
                    }
                });
            });

            if (!accounts_info[acc_type].is_demo) {
                let msg = '';
                if (Client.get('is_virtual')) {
                    msg = MetaTraderConfig.needsRealMessage();
                } else if (Client.get('currency') !== MetaTraderConfig.getCurrency(acc_type)) {
                    msg = template($templates.find('#msg_currency_not_match').text(), [MetaTraderConfig.getCurrency(acc_type)]);
                }
                if (msg) {
                    displayMainMessage(msg, false);
                    $action.find('#frm_cashier').setVisibility(0);
                }
            }
            return;
        }

        actions_info[action].prerequisites(acc_type).then((error_msg) => {
            if (error_msg) { // does not meet one of prerequisites
                displayMainMessage(error_msg);
                $action.find('#frm_action').empty().end().setVisibility(1);
                return;
            }

            if (!$action.find(`#frm_${action}`).length) {
                $main_msg.setVisibility(0);
            }

            cloneForm();
        });
    };

    // -----------------------
    // ----- New Account -----
    // -----------------------
    const handleNewAccountUI = (action, acc_type, $target) => {
        const is_new_account = action === 'new_account';
        const $acc_actions = $container.find('.acc-actions');
        $acc_actions.find('.new-account').setVisibility(is_new_account);
        $acc_actions.find('.has-account').setVisibility(!is_new_account);
        $detail.setVisibility(!is_new_account);

        if (!is_new_account) {
            // set active tab
            $detail.setVisibility(1);
            $container.find('[class*="act_"]').removeClass('selected');
            $target.addClass('selected');
            return;
        }

        // is_new_account
        newAccountSetTitle();
        displayAccountDescription(action);
        $form = actions_info[action].$form;
        if (Object.keys(accounts_info).every(a_type => !accounts_info[a_type].info)) {
            $form.find('#view_1 #btn_cancel').addClass('invisible');
        }

        // Navigation buttons: cancel, next, back
        $form.find('#btn_cancel').click(() => {
            loadAction(null, acc_type);
            displayAccountDescription(accounts_info[acc_type].info ? acc_type : 'new_account');
            $.scrollTo($('h1'), 300, { offset: -10 });
        });
        const displayStep = (step) => {
            $form.find('#mv_new_account div[id^="view_"]').setVisibility(0);
            $form.find(`#view_${step}`).setVisibility(1);
            $form.find('#view_2').find('.error-msg, .days_to_crack').setVisibility(0);
            $form.find('input').val('');
        };
        $form.find('#btn_next').click(function() {
            if (!$(this).hasClass('button-disabled')) {
                $form.find('#view_2 #btn_submit_new_account').attr('acc_type', newAccountGetType());
                displayStep(2);
                $form.find('#txt_name').val(accounts_info[newAccountGetType()].short_title);
                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            }
        });
        $form.find('#btn_back').click(() => { displayStep(1); });

        // Account type selection
        $form.find('.mt5_type_box').click(selectAccountTypeUI);
    };

    const newAccountSetTitle = (acc_type) => {
        $container.find('.acc-actions .new-account span').text(template($templates.find('#title_new_account').text(), [acc_type ? accounts_info[acc_type].title : '']));
    };

    const newAccountGetType = () => `${$form.find('.step-1 .selected').attr('data-acc-type')}_${$form.find('.step-2 .selected').attr('data-acc-type')}`;

    const selectAccountTypeUI = (e) => {
        const action = 'new_account';
        const box_class = 'mt5_type_box';
        let $item = $(e.target);
        if (!$item.hasClass(box_class)) {
            $item = $item.parents(`.${box_class}`);
        }
        if (/\b(disabled|selected|existed)\b/.test($item.attr('class'))) return;
        $item.parents('.type-group').find(`.${box_class}.selected`).removeClass('selected');
        $item.addClass('selected');
        const selected_acc_type = $item.attr('data-acc-type');
        if (/(demo|real)/.test(selected_acc_type)) {
            newAccountSetTitle();
            displayAccountDescription(action);
            updateAccountTypesUI(selected_acc_type);
            $form.find('#view_1 #btn_next').addClass('button-disabled');
            $form.find('#view_1 .step-2').setVisibility(1);
            displayMessage('#new_account_msg', (selected_acc_type === 'real' && Client.get('is_virtual')) ? MetaTraderConfig.needsRealMessage() : '', true);
        } else {
            const new_acc_type = newAccountGetType();
            newAccountSetTitle(new_acc_type);
            displayAccountDescription(new_acc_type);
            actions_info[action].prerequisites(new_acc_type).then((error_msg) => {
                displayMessage('#new_account_msg', error_msg || '');
                $form.find('#view_1 #btn_next')[error_msg ? 'addClass' : 'removeClass']('button-disabled');
                $form.find('#view_1 #btn_cancel').removeClass('invisible');
            });
        }
    };

    const updateAccountTypesUI = (type) => {
        Object.keys(accounts_info)
            .filter(acc_type => acc_type.indexOf(type) === 0)
            .forEach((acc_type) => {
                let class_name = (type === 'real' && Client.get('is_virtual')) ? 'disabled' : '';
                if (accounts_info[acc_type].info) {
                    class_name = 'existed';
                }
                $form.find(`.step-2 #${acc_type.replace(type, 'rbtn')}`)
                    .removeClass('existed disabled selected')
                    .addClass(class_name);
            });
    };

    const populateAccountTypes = () => {
        const $acc_template = $templates.find('#rbtn_template').parent().remove();
        const $parent       = $templates.find('#view_1 .step-2 .type-group');
        if (!$acc_template.length || !$parent.length) return;

        let count = 0;
        Object.keys(accounts_info)
            .filter(acc_type => !accounts_info[acc_type].is_demo)
            .forEach((acc_type) => {
                count++;
                const $acc  = $acc_template.clone();
                const type  = acc_type.split('_').slice(1).join('_');
                const title = accounts_info[acc_type].short_title;
                $acc.find('.mt5_type_box').attr({ id: `rbtn_${type}`, 'data-acc-type': type })
                    .find('img').attr('src', urlForStatic(`/images/pages/metatrader/icons/acc_${title.toLowerCase().replace(/\s/g, '_')}.svg`));
                $acc.find('p').text(title);
                $parent.append($acc);
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

    const disableButton = (action) => {
        const $btn = actions_info[action].$form.find('button');
        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: 'invisible' });
            showLoadingImage($btn[0], 'white');
            $btn.append($btn_text);
        }
    };

    const enableButton = (action) => {
        const $btn = actions_info[action].$form.find('button');
        if ($btn.length && $btn.find('.barspinner').length) {
            $btn.removeAttr('disabled').html($btn.find('span').text());
        }
    };

    return {
        init,
        setAccountType,
        loadAction,
        updateAccount,
        postValidate,
        removeUrlHash,
        hideFormMessage,
        displayFormMessage,
        displayMainMessage,
        displayPageError,
        disableButton,
        enableButton,

        $form: () => $form,
    };
})();

module.exports = MetaTraderUI;
