const AccountOpening    = require('../../../common_functions/account_opening');
const detect_hedging    = require('../../../common_functions/common_functions').detect_hedging;
const Validation        = require('../../../common_functions/form_validation');
const Client            = require('../../../base/client').Client;
const url_for           = require('../../../base/url').url_for;
const State             = require('../../../base/storage').State;
const getFormData       = require('../../../base/utility').getFormData;

const JapanAccOpening = (function() {
    const onLoad = function() {
        if (AccountOpening.redirectCookie()) return;
        if (Client.get('residence') !== 'jp') {
            window.location.href = url_for('trading');
            return;
        }
        State.set('is_japan_opening', 1);
        if (AccountOpening.redirectAccount()) return;
        AccountOpening.populateForm();
        const formID = '#japan-form';

        Validation.init(formID, [
            { selector: '#first_name',         validations: ['req', 'letter_symbol'] },
            { selector: '#last_name',          validations: ['req', 'letter_symbol'] },
            { selector: '#date_of_birth',      validations: ['req'] },
            { selector: '#address_line_1',     validations: ['req', 'general'] },
            { selector: '#address_line_2',     validations: ['general'] },
            { selector: '#address_city',       validations: ['req', 'letter_symbol'] },
            { selector: '#address_state',      validations: ['req'] },
            { selector: '#address_postcode',   validations: ['req', ['regular', { regex: /^\d{3}-\d{4}$/, message: 'Please follow the pattern 3 numbers, a dash, followed by 4 numbers.' }]] },
            { selector: '#phone',              validations: ['req', ['regular', { regex: /^\+?[0-9\s-]+$/, message: 'Only numbers, space, and hyphen are allowed.' }], ['min', { min: 6, max: 35 }]] },
            { selector: '#secret_answer',      validations: ['req', ['min', { min: 1, max: 50 }]] },
            { selector: '#daily_loss_limit',   validations: ['req', 'number'] },
            { selector: '#hedge_asset_amount', validations: ['req', 'number'] },
        ].concat(AccountOpening.selectCheckboxValidation(formID)));

        detect_hedging($('#trading_purpose'), $('.hedging-assets'));

        $(formID).submit(function(evt) {
            evt.preventDefault();
            if (Validation.validate(formID)) {
                BinarySocket.send(populateReq()).then((response) => {
                    if ('error' in response) {
                        AccountOpening.handleNewAccount(response, response.msg_type);
                    } else {
                        window.location.href = url_for('new_account/knowledge_testws');
                        $('#topbar-msg').children('a').addClass('invisible');
                    }
                });
            }
        });
    };

    const populateReq = () => {
        let req = {
            new_account_japan: 1,
            residence        : Client.get('residence'),
        };

        req = $.extend(req, getFormData());

        if ($('#trading_purpose').val() === 'Hedging') {
            req.hedge_asset = $('#hedge_asset').val();
            req.hedge_asset_amount = $('#hedge_asset_amount').val();
        }

        return req;
    };

    const onUnload = () => {
        State.set('is_japan_opening', 0);
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    JapanAccOpening: JapanAccOpening,
};
