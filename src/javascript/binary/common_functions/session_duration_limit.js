const moment   = require('moment');
const localize = require('../base/localize').localize;
const Client   = require('../base/client');

const SessionDurationLimit = (function() {
    'use strict';

    let warning;

    const init = function() {
        clearTimeout(window.TimeOut_SessionLimitWarningBefore);
        clearTimeout(window.TimeOut_SessionLimitWarning);
        clearTimeout(window.TimeOut_SessionLimitLogout);
        $('#session_limit').remove();

        warning = 10 * 1000; // milliseconds before limit to display the warning message

        const limit     = Client.get('session_duration_limit') * 1,
            now       = moment().unix(),
            start     = Client.get('session_start') * 1,
            mathLimit = Math.pow(2, 31) - 1;
        let remained  = ((limit + start) - now) * 1000;
        if (remained < 0) remained = warning;

        const setTimeOut = function() {
            window.TimeOut_SessionLimitWarning = setTimeout(displayWarning, remained - warning);
            window.TimeOut_SessionLimitLogout  = setTimeout(Client.sendLogoutRequest, remained);
        };

        // limit of setTimeout is this number
        if (remained > mathLimit) {
            remained %= mathLimit;
            window.TimeOut_SessionLimitWarningBefore = setTimeout(init, remained);
        } else {
            setTimeOut();
        }
    };

    const exclusionResponseHandler = function(response) {
        if (response.hasOwnProperty('error') || !response.hasOwnProperty('get_self_exclusion')) {
            return;
        }

        const limit = response.get_self_exclusion.session_duration_limit * 60;
        if (isNaN(limit) || limit <= 0) return;

        Client.set('session_duration_limit', limit);
        window.addEventListener('storage', init, false);

        init();
    };

    /* const realityStorageEventHandler = function(e) {
     if (e.key === 'client.session_start' || e.key === 'client.session_duration_limit') {
     init();
     }
     };*/

    const displayWarning = function() {
        $('body').append(
            $("<div id='session_limit' class='lightbox'><div><div><div class='limit_message'>" +
                localize('Your session duration limit will end in [_1] seconds.', [warning / 1000]) +
                '</div></div></div></div>'));
        $('#session_limit').click(function() { $(this).remove(); });
    };

    return {
        exclusionResponseHandler: exclusionResponseHandler,
    };
})();

module.exports = {
    SessionDurationLimit: SessionDurationLimit,
};
