const IPHistoryData = (function() {
    const parse_ua = function(user_agent) {
        // Table of UA-values (and precedences) from:
        //  https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        // Regexes stolen from:
        //  https://github.com/biggora/express-useragent/blob/master/lib/express-useragent.js
        const lookup = [
            { name: 'Edge',      regex: /Edge\/([\d\w\.\-]+)/i },
            { name: 'SeaMonkey', regex: /seamonkey\/([\d\w\.\-]+)/i },
            { name: 'Opera',     regex: /(?:opera|opr)\/([\d\w\.\-]+)/i },
            { name: 'Chromium',  regex: /(?:chromium|crios)\/([\d\w\.\-]+)/i },
            { name: 'Chrome',    regex: /chrome\/([\d\w\.\-]+)/i },
            { name: 'Safari',    regex: /version\/([\d\w\.\-]+)/i },
            { name: 'IE',        regex: /msie\s([\d\.]+[\d])/i },
            { name: 'IE',        regex: /trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i },
            { name: 'Firefox',   regex: /firefox\/([\d\w\.\-]+)/i },
        ];
        for (let i = 0; i < lookup.length; i++) {
            const info = lookup[i];
            const match = user_agent.match(info.regex);
            if (match !== null) {
                return {
                    name   : info.name,
                    version: match[1],
                };
            }
        }
        return null;
    };

    const parse = function(activity) {
        const environ    = activity.environment;
        const ip_addr    = environ.split(' ')[2].split('=')[1];
        const user_agent = environ.match('User_AGENT=(.+) LANG')[1];
        return {
            time   : activity.time,
            action : activity.action,
            success: activity.status === 1,
            browser: parse_ua(user_agent),
            ip_addr: ip_addr,
        };
    };

    return {
        parse         : parse,
        parseUserAgent: parse_ua,
    };
})();

module.exports = IPHistoryData;
