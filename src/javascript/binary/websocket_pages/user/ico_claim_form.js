const BinarySocket     = require('../socket');
const loadPreviousUrl  = require('../../base/binary_pjax').loadPreviousUrl;
const Client           = require('../../base/client');
const State            = require('../../base/storage').State;
const getDecimalPlaces = require('../../common_functions/currency').getDecimalPlaces;
const toTitleCase      = require('../../common_functions/string_util').toTitleCase;

const ICOClaimForm = (() => {
    const onLoad = () => {
        const currency = Client.get('currency');
        // Get ICO status.
        const ico_req = {
            ico_status: 1,
            currency,
        };
        BinarySocket.send(ico_req);

        BinarySocket.wait('get_settings', 'ico_status').then(() => {
            const first_name     = toTitleCase(State.getResponse('get_settings.first_name'));
            const last_name      = toTitleCase(State.getResponse('get_settings.last_name'));
            const full_name      = `${first_name} ${last_name}`;
            const decimal_places = getDecimalPlaces(currency);
            const final_price    = (State.getResponse('ico_status.final_price')).toFixed(decimal_places);
            const date_today     = window.time.format('DD MMM YYYY');
            const tokens         = State.get('ico_token_count');
            // Set input values for form.
            $('.claimer_name').val(full_name);
            $('#final_price').val(final_price);
            $('#date_today').val(date_today);
            $('#token_count').val(tokens);

            // Add event listeners
            $('.button')
                .off('click')
                .on('click', () => {
                    // Make some api call?
                });
            $('#cancel')
                .off('click')
                .on('click', () => {
                    loadPreviousUrl();
                });
        });
    };

    const onUnload = () => {
        // Remove event listeners
        $('#cancel').off('click');
        $('.button').off('click');
    };

    return {
        onLoad,
        onUnload,
    };

})();

module.exports = ICOClaimForm;
