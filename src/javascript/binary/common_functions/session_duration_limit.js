var SessionDurationLimit = (function() {
    'use strict';

    var warning;

    var init = function() {
        clearTimeout(window.TimeOut_SessionLimitWarning);
        clearTimeout(window.TimeOut_SessionLimitLogout);
        $('#session_limit').remove();

        warning = 10; // seconds before limit to display the warning message

        var limit    = page.client.get_storage_value('session_duration_limit') * 1,
            now      = parseInt(moment().valueOf() / 1000),
            start    = page.client.get_storage_value('session_start') * 1,
            remained = limit + start - now;
        if(remained < 0) remained = warning;

        window.TimeOut_SessionLimitWarning = setTimeout(displayWarning, (remained - warning) * 1000);
        window.TimeOut_SessionLimitLogout  = setTimeout(page.client.send_logout_request, remained * 1000);
    };

    var exclusionResponseHandler = function(response) {
        if (response.hasOwnProperty('error') || !response.hasOwnProperty('get_self_exclusion')) {
            return;
        }

        var limit = response.get_self_exclusion.session_duration_limit * 60;
        if(isNaN(limit) || limit <= 0) return;

        page.client.set_storage_value('session_duration_limit', limit);
        window.addEventListener('storage', init, false);

        init();
    };

    var realityStorageEventHandler = function(e) {
        if (e.key === 'client.session_start' || e.key === 'client.session_duration_limit') {
            init();
        }
    };

    var displayWarning = function() {
        $('body').append(
            $("<div id='session_limit' class='lightbox'><div><div><div class='limit_message'>" +
                text.localize('Your session duration limit will end in [_1] seconds.').replace('[_1]', warning) +
                "</div></div></div></div>")
        );
        $('#session_limit').click(function(){$(this).remove();});
    };

    return {
        exclusionResponseHandler: exclusionResponseHandler,
    };
}());
