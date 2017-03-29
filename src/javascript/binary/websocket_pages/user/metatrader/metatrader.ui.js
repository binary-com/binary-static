const showLoadingImage = require('../../../base/utility').showLoadingImage;
const formatMoney      = require('../../../common_functions/currency_to_symbol').formatMoney;
const Validation       = require('../../../common_functions/form_validation');
const MetaTraderConfig = require('./metatrader.config');

const MetaTraderUI = (function() {
    'use strict';

    let $container,
        $list,
        $action,
        $templates,
        $form,
        $main_msg,
        submit;

    const hidden_class  = 'invisible';

    const types_info   = MetaTraderConfig.types_info;
    const actions_info = MetaTraderConfig.actions_info;
    const validations  = MetaTraderConfig.validations;

    const init = (submit_func) => {
        submit = submit_func;
        $container = $('#mt_account_management');
        $list      = $container.find('#accounts_list');
        $action    = $container.find('#fst_action');
        $templates = $container.find('#templates');
        $main_msg  = $container.find('#main_msg');
        $container.find('#mt_loading').remove();

        populateAccountList();
    };

    const populateAccountList = () => {
        const $acc_box = $templates.find('> .acc-box');
        Object.keys(types_info).forEach(function(acc_type) {
            if ($list.find(`#${acc_type}`).length === 0 && (types_info[acc_type].is_enabled || types_info[acc_type].is_demo)) {
                const $acc_item = $acc_box.clone();

                // set values
                $acc_item.attr('id', acc_type);
                $acc_item.find('.title').text(types_info[acc_type].title);

                // exceptions for demo account
                if (types_info[acc_type].is_demo) {
                    $acc_item.find('.act_deposit, .act_withdrawal').remove();
                }
                $list.append($acc_item);
            }
        });
        $list.find('[class*="act_"]').click(populateForm);
        $action.find('.close').click(() => { closeForm(true); });
    };

    const displayLoadingAccount = (acc_type) => {
        const $acc_item = $list.find(`#${acc_type}`);
        $acc_item.find('> div > div[class!="title"]').addClass(hidden_class);
        $acc_item.find('.loading').removeClass(hidden_class);
    };

    const updateAccount = (acc_type) => {
        const $acc_item = $list.find(`#${acc_type}`);
        $acc_item.find('.loading').addClass(hidden_class);
        if (types_info[acc_type].account_info) {
            // Update account info
            $acc_item.find('.acc-info div[data]').map(function () {
                const key  = $(this).attr('data');
                const info = types_info[acc_type].account_info[key];
                $(this).text(
                    key === 'balance' ? formatMoney('USD', +info) :
                    key === 'leverage' ? `1:${info}` : info);
            });
            $acc_item.find('.has-account').removeClass(hidden_class);
        } else {
            $acc_item.find('.no-account').removeClass(hidden_class)
                .find('.info').html($templates.find(`#${acc_type}`));
        }
    };

    const populateForm = (e) => {
        closeForm();
        let $target = $(e.target);
        if ($target.prop('tagName').toLowerCase() === 'img') {
            $target = $target.parents('a');
        }
        const acc_type = $target.parents('.acc-box').attr('id');
        const action = $target.attr('class').match(/act_(.*)/)[1];

        // set active
        $list.find(`.acc-box[id!="${acc_type}"] > div`).removeClass('active');
        $list.find(`#${acc_type} > div`).addClass('active');

        actions_info[action].prerequisites(acc_type).then((error_msg) => {
            if (error_msg) { // does not meet one of prerequisites
                displayMainMessage(error_msg);
                return;
            }

            // clone form, event listener
            $form = $templates.find(`#frm_${action}`).clone();
            const formValues = actions_info[action].formValues;
            if (formValues) formValues($form, acc_type, action);
            $form.find('#btn_submit').attr({ acc_type: acc_type, action: action }).on('click dblclick', submit);

            // update legend, append form
            $action.find('legend').text(`${types_info[acc_type].title}: ${actions_info[action].title}`).end()
                .find('#frm_action')
                .html($form)
                .end()
                .removeClass(hidden_class);
            $.scrollTo($action, 500, { offset: -7 });
            Validation.init(`#frm_${action}`, validations[action]);
        });
    };

    const closeForm = (should_scroll) => {
        if ($form && $form.length) {
            $form.find('#btn_submit').off('click dblclick', submit);
            $form.empty();
            $form = undefined;
            $action.addClass(hidden_class);
            $list.find('.acc-box > div').removeClass('active');
            if (should_scroll) {
                $.scrollTo($list, 500, { offset: -10 });
            }
        }
        $main_msg.empty().addClass(hidden_class);
    };

    const postValidate = (acc_type, action) => {
        const validate = actions_info[action].pre_submit;
        return validate ? validate($form, acc_type, displayFormMessage) : new Promise(resolve => resolve(true));
    };

    const hideFormMessage = () => {
        $form.find('#msg_form').html('').addClass(hidden_class);
    };

    const displayFormMessage = (message) => {
        $form.find('#msg_form').text(message).removeClass(hidden_class);
    };

    const displayMainMessage = (message) => {
        $main_msg.html(message).removeClass(hidden_class);
        $.scrollTo($main_msg, 500, { offset: -10 });
    };

    const displayPageError = (message) => {
        $('#mt_account_management').find('#page_msg').html(message).removeClass(hidden_class)
            .end()
            .find('#mt_loading')
            .remove();
    };

    const disableButton = () => {
        const $btn = $form.find('button');
        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: hidden_class });
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
        init                 : init,
        $form                : () => $form,
        displayLoadingAccount: displayLoadingAccount,
        updateAccount        : updateAccount,
        closeForm            : closeForm,
        postValidate         : postValidate,
        hideFormMessage      : hideFormMessage,
        displayFormMessage   : displayFormMessage,
        displayMainMessage   : displayMainMessage,
        displayPageError     : displayPageError,
        disableButton        : disableButton,
        enableButton         : enableButton,
    };
})();

module.exports = MetaTraderUI;
