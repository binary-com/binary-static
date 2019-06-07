const BinarySocket = require('../../../../base/socket');
const localize     = require('../../../../../_common/localize').localize;
const Url          = require('../../../../../_common/url');

const AccountClosure = (() => {
    const form_selector = '#form_closure';
    let $textField;
    
    const onLoad = () => {
        $textField = $('#other-reason');

        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            submitForm();
        });
        $('#closure-container').setVisibility(1);
        $textField.on('keyup', () => $textField.removeClass('error-field'));
    };

    const submitForm = () => {
        const $btn_submit = $(`${form_selector} #btn_submit`);
        const reason = getReason();
        if (reason) {
            $('#closure_loading').setVisibility(1);
            $btn_submit.attr('disabled', true);

            const data  = { account_closure: 1, reason };
            BinarySocket.send(data).then((response) => {
                if (response.error) {
                    showFormMessage(localize('Sorry, an error occurred while processing your request.'), false);
                    $btn_submit.attr('disabled', false);
                } else {
                    $('#closure_loading').setVisibility(0);
                    $('#closure-container').setVisibility(0);
                    $('#msg_main').setVisibility(1);

                    setTimeout(() => window.location.href = Url.urlFor('home'), 10000);
                }
            });
        } else {
            setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
        }
    };

    const showFormMessage = (localized_msg) => {
        $.scrollTo($('#reason'), 500, { offset: -20 });
        $('#msg_form')
            .attr('class', 'errorfield')
            .html(localized_msg)
            .css('display', 'block')
            .delay(5000)
            .fadeOut(500);
    };

    const getReason = () => {
        const value      = $('input[type=radio]:checked').val();
        const id         = $('input[type=radio]:checked').attr('id');
        const radioText  = $(`label[for=${id}]`).text();
        const textInput  = $textField.val();
        if (value){
            if (value === 'other') {
                if (!textInput) {
                    $textField.addClass('error-field');
                    showFormMessage(localize('Please specify your reason.'));
                    return false;
                } else if (textInput.length > 3 && textInput.length < 50) return textInput;
                showFormMessage(localize('Maximum length: 50 characters'));
                return false;
            }
            return radioText;
        }
        showFormMessage(localize('Please select a reason.'));
        return false;
    };

    return {
        onLoad,
    };
})();

module.exports = AccountClosure;
