var moment = require('moment');

var SessionDurationLimit = (function() {
    'use strict';

    var warning;

    var init = function() {
        clearTimeout(window.TimeOut_SessionLimitWarningBefore);
        clearTimeout(window.TimeOut_SessionLimitWarning);
        clearTimeout(window.TimeOut_SessionLimitLogout);
        $('#session_limit').remove();

        warning = 10 * 1000; // milliseconds before limit to display the warning message

        var limit     = page.client.get_storage_value('session_duration_limit') * 1,
            now       = moment().unix(),
            start     = page.client.get_storage_value('session_start') * 1,
            remained  = ((limit + start) - now) * 1000,
            mathLimit = Math.pow(2, 31) - 1;
        if (remained < 0) remained = warning;
        // limit of setTimeout is this number
        if (remained > mathLimit) {
            remained %= mathLimit;
            window.TimeOut_SessionLimitWarningBefore = setTimeout(init, remained);
        } else {
            setTimeOut();
        }

        function setTimeOut() {
            window.TimeOut_SessionLimitWarning = setTimeout(displayWarning, remained - warning);
            window.TimeOut_SessionLimitLogout  = setTimeout(page.client.send_logout_request, remained);
        }
    };

    var exclusionResponseHandler = function(response) {
        if (response.hasOwnProperty('error') || !response.hasOwnProperty('get_self_exclusion')) {
            return;
        }

        var limit = response.get_self_exclusion.session_duration_limit * 60;
        if (isNaN(limit) || limit <= 0) return;

        page.client.set_storage_value('session_duration_limit', limit);
        window.addEventListener('storage', init, false);

        init();
    };

    /* var realityStorageEventHandler = function(e) {
     if (e.key === 'client.session_start' || e.key === 'client.session_duration_limit') {
     init();
     }
     };*/

    var displayWarning = function() {
        $('body').append(
            $("<div id='session_limit' class='lightbox'><div><div><div class='limit_message'>" +
                page.text.localize('Your session duration limit will end in [_1] seconds.', [warning]) +
                '</div></div></div></div>'),
        );
        $('#session_limit').click(function() { $(this).remove(); });
    };

    return {
        exclusionResponseHandler: exclusionResponseHandler,
    };
})();

module.exports = {
    SessionDurationLimit: SessionDurationLimit,
};
