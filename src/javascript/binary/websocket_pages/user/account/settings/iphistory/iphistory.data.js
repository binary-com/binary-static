var IPHistoryData = (function() {
    function parse_ua(user_agent) {
        // Table of UA-values (and precedences) from:
        //  https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        // Regexes stolen from:
        //  https://github.com/biggora/express-useragent/blob/master/lib/express-useragent.js
        var lookup = [
            {name: 'Edge',      regex: /Edge\/([\d\w\.\-]+)/i},
            {name: 'SeaMonkey', regex: /seamonkey\/([\d\w\.\-]+)/i},
            {name: 'Opera',     regex: /(?:opera|opr)\/([\d\w\.\-]+)/i},
            {name: 'Chromium',  regex: /(?:chromium|crios)\/([\d\w\.\-]+)/i},
            {name: 'Chrome',    regex: /chrome\/([\d\w\.\-]+)/i},
            {name: 'Safari',    regex: /version\/([\d\w\.\-]+)/i},
            {name: 'IE',        regex: /msie\s([\d\.]+[\d])/i},
            {name: 'IE',        regex: /trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i},
            {name: 'Firefox',   regex: /firefox\/([\d\w\.\-]+)/i},
        ];
        for (var i = 0; i < lookup.length; i++) {
            var info = lookup[i];
            var match = user_agent.match(info.regex);
            if (match !== null) {
                return {
                    name: info.name,
                    version: match[1],
                };
            }
        }
        return null;
    }

    function parse(activity) {
        var environ    = activity.environment;
        var ip_addr    = environ.split(' ')[2].split('=')[1];
        var user_agent = environ.match('User_AGENT=(.+) LANG')[1];
        var browser    = parse_ua(user_agent);
        return {
            time:    activity.time,
            action:  activity.action,
            success: activity.status === 1,
            browser: parse_ua(user_agent),
            ip_addr: ip_addr,
        };
    }

    var external = {
        parse: parse,
        parseUserAgent: parse_ua,
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }

    return external;
})();
