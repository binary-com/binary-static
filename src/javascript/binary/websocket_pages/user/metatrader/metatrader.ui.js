const Client           = require('../../../base/client');
const showLoadingImage = require('../../../base/utility').showLoadingImage;
const formatMoney      = require('../../../common_functions/currency_to_symbol').formatMoney;
const Validation       = require('../../../common_functions/form_validation');
const MetaTraderConfig = require('./metatrader.config');

const MetaTraderUI = (() => {
    'use strict';

    let $container,
        $list_cont,
        $mt5_account,
        $list,
        $detail,
        $action,
        $templates,
        $form,
        $main_msg,
        submit;

    const types_info   = MetaTraderConfig.types_info;
    const actions_info = MetaTraderConfig.actions_info;
    const validations  = MetaTraderConfig.validations;

    const init = (submit_func) => {
        submit = submit_func;
        $container = $('#mt_account_management');
        $mt5_account = $container.find('#mt5_account');
        $list_cont   = $container.find('#accounts_list');
        $list        = $list_cont.find('> div');
        $detail      = $container.find('#account_detail');
        $action      = $container.find('#fst_action');
        $templates   = $container.find('#templates');
        $main_msg    = $container.find('#main_msg');
        $detail.find('[class*="act_"]').click(populateForm);

        populateAccountList();
    };

    const populateAccountList = () => {
        const $acc_name = $templates.find('> .acc-name');
        const no_real   = Client.get('is_virtual') && !Client.get('has_real');
        $container.find('#top_msg').setVisibility(no_real);
        Object.keys(types_info)
            .sort((a, b) => types_info[a].order > types_info[b].order)
            .forEach((acc_type, idx) => {
                if ($list.find(`#${acc_type}`).length === 0) {
                    const $acc_item = $acc_name.clone();
                    $acc_item.attr('value', acc_type);
                    if (no_real && /real/.test(acc_type)) {
                        $acc_item.addClass('disabled');
                    }
                    $list.append($acc_item);
                    if (idx % 2 === 1 && idx < Object.keys(types_info).length - 1) {
                        $list.append($('<div/>', { class: 'separator fill-bg-color' }));
                    }
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
        $list.off('click').on('click', '.acc-name', function() {
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
            $mt5_account.attr('value', acc_type).html(types_info[acc_type].title).removeClass('empty');
            $action.setVisibility(0);
            if (should_set_account) {
                setCurrentAccount(acc_type);
            }
        }
    };

    const updateAccount = (acc_type) => {
        updateListItem(acc_type);
        setCurrentAccount(acc_type);
    };

    const updateListItem = (acc_type) => {
        const $acc_item = $list.find(`[value=${acc_type}]`);
        $acc_item.find('.mt-type').text(`${types_info[acc_type].title}`);
        if (types_info[acc_type].account_info) {
            $acc_item.find('.mt-login').text(types_info[acc_type].account_info.login);
            $acc_item.find('.mt-balance').text(formatMoney('USD', +types_info[acc_type].account_info.balance));
            $acc_item.find('.mt-new').setVisibility(0);
        } else {
            $acc_item.find('.mt-new').setVisibility(1);
        }
    };

    const setCurrentAccount = (acc_type) => {
        if (acc_type !== Client.get('mt5_account')) return;

        $detail.find('#account_desc').html($templates.find(`.account-desc .${acc_type}`).clone());

        if (types_info[acc_type].account_info) {
            // Update account info
            $detail.find('.acc-info div[data]').map(function () {
                const key  = $(this).attr('data');
                const info = types_info[acc_type].account_info[key];
                $(this).text(
                    key === 'balance' ? formatMoney('USD', +info) :
                        key === 'leverage' ? `1:${info}` : info);
            });
            $detail.find('.act_deposit, .act_withdrawal').setVisibility(!types_info[acc_type].is_demo);
            $detail.find('.has-account').setVisibility(1);
            $detail.find('#account_desc .more').setVisibility(0);
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

    const defaultAction = acc_type => (
        types_info[acc_type].account_info ?
            (types_info[acc_type].is_demo ? 'password_change' : 'deposit') :
            'new_account'
    );

    const loadAction = (action, acc_type) => {
        $detail.find(`.acc-actions [class*=act_${action || defaultAction(acc_type)}]`).click();
    };

    const populateForm = (e) => {
        let $target = $(e.target);
        if ($target.prop('tagName').toLowerCase() !== 'a') {
            $target = $target.parents('a');
        }

        const acc_type = Client.get('mt5_account');
        const action = $target.attr('class').split(' ').find(c => /^act_/.test(c)).replace('act_', '');

        // set active, update title
        $detail.find('[class*="act_"]').removeClass('selected');
        $target.addClass('selected');
        $action.find('h3').text(actions_info[action].title);

        actions_info[action].prerequisites(acc_type).then((error_msg) => {
            if (error_msg) { // does not meet one of prerequisites
                displayMainMessage(error_msg);
                $action.find('#frm_action').empty().end().setVisibility(1);
                return;
            }

            if (!$action.find(`#frm_${action}`).length) {
                $main_msg.setVisibility(0);
            }

            // clone form, event listener
            $form = $templates.find(`#frm_${action}`).clone();
            const formValues = actions_info[action].formValues;
            if (formValues) formValues($form, acc_type, action);
            $form.find('#btn_submit').attr({ acc_type: acc_type, action: action }).on('click dblclick', submit);

            // append form
            $action.find('#frm_action').html($form).setVisibility(1).end()
                .setVisibility(1);
            // $.scrollTo($action, 500, { offset: -7 });
            Validation.init(`#frm_${action}`, validations[action]);
        });
    };

    const postValidate = (acc_type, action) => {
        const validate = actions_info[action].pre_submit;
        return validate ? validate($form, acc_type, displayFormMessage) : new Promise(resolve => resolve(true));
    };

    const hideFormMessage = () => {
        $form.find('#msg_form').html('').setVisibility(0);
    };

    const displayFormMessage = (message) => {
        $form.find('#msg_form').text(message).setVisibility(1);
    };

    const displayMainMessage = (message) => {
        $main_msg.html(message).setVisibility(1);
        $.scrollTo($action, 500, { offset: -80 });
    };

    const displayPageError = (message) => {
        $('#page_msg').html(message).setVisibility(1);
        $('#mt_loading').remove();
    };

    const disableButton = () => {
        const $btn = $form.find('button');
        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: 'invisible' });
            showLoadingImage($btn, 'white');
            $btn.append($btn_text);
        }
    };

    const enableButton = () => {
        const $btn = $form.find('button');
        if ($btn.length && $btn.find('.barspinner').length) {
            $btn.removeAttr('disabled').html($btn.find('span').text());
        }
    };

    return {
        init              : init,
        $form             : () => $form,
        loadAction        : loadAction,
        updateAccount     : updateAccount,
        postValidate      : postValidate,
        hideFormMessage   : hideFormMessage,
        displayFormMessage: displayFormMessage,
        displayMainMessage: displayMainMessage,
        displayPageError  : displayPageError,
        disableButton     : disableButton,
        enableButton      : enableButton,
    };
})();

module.exports = MetaTraderUI;
