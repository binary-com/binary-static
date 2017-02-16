const Client         = require('../../../base/client').Client;
const getFormData    = require('../../../base/utility').getFormData;
const AccountOpening = require('../../../common_functions/account_opening');
const Validation     = require('../../../common_functions/form_validation');
const Cookies        = require('../../../../lib/js-cookie');

const RealAccOpening = (function() {
    const residenceID = '#residence';
    const formID = '#real-form';

    const onLoad = () => {
        if (AccountOpening.redirectCookie()) return;

        BinarySocket.wait('authorize').then(() => {
            if (Client.get('residence')) {
                if (AccountOpening.redirectAccount()) return;
                AccountOpening.populateForm(formID, getValidations);
                $(formID).removeClass('invisible');
                bindValidation();
            } else {
                AccountOpening.getResidence();
                show_residence_form();
            }
        });
    };

    const getValidations = () => (
        AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(formID))
    );

    const bindValidation = () => {
        $(formID).off('submit').on('submit', function(evt) {
            evt.preventDefault();
            if (Validation.validate(formID)) {
                BinarySocket.send(populateReq()).then((response) => {
                    AccountOpening.handleNewAccount(response, response.msg_type);
                });
            }
        });
    };

    const populateReq = () => {
        const req = $.extend({ new_account_real: 1 }, getFormData());
        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }
        return req;
    };

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
                                    AccountOpening.populateForm(formID, getValidations);
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

module.exports = {
    RealAccOpening: RealAccOpening,
};
