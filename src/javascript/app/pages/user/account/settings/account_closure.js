const BinarySocket     = require('../../../../base/socket');
const Validation       = require('../../../../common/form_validation');
const getElementById   = require('../../../../../_common/common_functions').getElementById;
const localize         = require('../../../../../_common/localize').localize;
const showLoadingImage = require('../../../../../_common/utility').showLoadingImage;

const AccountClosure = (() => {
    const form_selector = '#frm_closure';

    const onLoad = () => {
        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            submitForm();
        });
        getElementById('closure_description').setVisibility(1);
        getElementById('frm_closure').setVisibility(1);
    };

    const submitForm = () => {
        const $btn_submit = $(`${form_selector} #btn_submit`);
        const $reason_select = $('#reason');
        $btn_submit.attr('disabled', 'disabled');
        showLoadingImage(getElementById('msg_form'));

        if (Validation.validate(form_selector)) {
            let has_changed = false;
            const data  = { account_closure: 1 };
            const value = $reason_select.val();
            const id    = $reason_select.attr('id');

            if ($reason_select.val()) has_changed = true;
            if (!has_changed) {
                showFormMessage(localize('You did not change anything.'), false);
                setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
                return;
            }
            if (value.length) {
                data[id] = value;
            }

            BinarySocket.send(data).then((response) => {
                $btn_submit.removeAttr('disabled');
                if (response.error) {
                    showFormMessage(localize('Sorry, an error occurred while processing your request.'), false);
                } else {
                    showFormMessage(localize('Your changes have been updated successfully.'), true);
                    $('#closure_loading').remove();
                }
            });
        } else {
            setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
        }
    };

    const showFormMessage = (localized_msg, is_success) => {
        if (is_success) {
            $.scrollTo($('h1#heading'), 500, { offset: -10 });
            $(form_selector).setVisibility(0);
            $('#msg_main').setVisibility(1);
        } else {
            $('#msg_form')
                .attr('class', is_success ? 'success-msg' : 'errorfield')
                .html(is_success ? $('<ul/>', { class: 'checked', style: 'display: inline-block;' }).append($('<li/>', { text: localized_msg })) : localized_msg)
                .css('display', 'block')
                .delay(5000)
                .fadeOut(1000);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = AccountClosure;
