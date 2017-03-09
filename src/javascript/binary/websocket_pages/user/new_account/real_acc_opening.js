const Client         = require('../../../base/client').Client;
const AccountOpening = require('../../../common_functions/account_opening');
const FormManager    = require('../../../common_functions/form_manager');

const RealAccOpening = (function() {
    const residenceID = '#residence';
    const formID = '#real-form';

    const onLoad = () => {
        if (AccountOpening.redirectCookie()) return;

        if (Client.get('residence')) {
            if (AccountOpening.redirectAccount()) return;
            AccountOpening.populateForm(formID, AccountOpening.commonValidations);
            $(formID).removeClass('invisible');
            bindValidation();
        } else {
            AccountOpening.getResidence();
            show_residence_form();
        }
    };

    const bindValidation = () => {
        FormManager.handleSubmit({
            form_selector       : formID,
            obj_request         : { new_account_real: 1 },
            fnc_response_handler: handleResponse,
        });
    };

    const handleResponse = response => (AccountOpening.handleNewAccount(response, response.msg_type));

    const show_residence_form = () => {
        const $residence = $(residenceID);
        $residence.insertAfter('#move-residence-here')
            .removeAttr('disabled');
        $('#residence-form').removeClass('invisible')
            .submit(function(evt) {
                evt.preventDefault();
                const residence_value = $residence.val();
                BinarySocket.send({ set_settings: 1, residence: residence_value })
                    .then((response) => {
                        if (!response.hasOwnProperty('error')) {
                            BinarySocket.send({ get_settings: 1 }, true).then((data) => {
                                if (data.get_settings.country_code) {
                                    if (AccountOpening.redirectAccount()) return;
                                    AccountOpening.populateForm(formID, AccountOpening.commonValidations);
                                    hide_residence_form();
                                }
                            });
                        }
                    });
            });
    };

    const hide_residence_form = () => {
        const $residence = $(residenceID);
        $('#residence-form').addClass('invisible');
        $residence.insertAfter('#move-residence-back');
        $residence.attr('disabled', 'disabled');
        $(formID).removeClass('invisible');
        bindValidation();
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = RealAccOpening;
