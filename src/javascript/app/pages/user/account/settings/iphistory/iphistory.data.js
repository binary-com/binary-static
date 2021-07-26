const IPHistoryData = (() => {
    const parseUA = (user_agent) => {
        // Table of UA-values (and precedences) from:
        //  https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        // Regexes stolen from:
        //  https://github.com/biggora/express-useragent/blob/master/lib/express-useragent.js
        const lookup = [
            { name: 'Edge',       regex: /(?:edge|edga|edgios|edg)\/([\d\w.-]+)/i },
            { name: 'SeaMonkey',  regex: /seamonkey\/([\d\w.-]+)/i },
            { name: 'Opera',      regex: /(?:opera|opr)\/([\d\w.-]+)/i },
            { name: 'Chromium',   regex: /(?:chromium|crios)\/([\d\w.-]+)/i },
            { name: 'Chrome',     regex: /chrome\/([\d\w.-]+)/i },
            { name: 'Safari',     regex: /version\/([\d\w.-]+)/i },
            { name: 'IE',         regex: /msie\s([\d.]+[\d])/i },
            { name: 'IE',         regex: /trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i },
            { name: 'Firefox',    regex: /firefox\/([\d\w.-]+)/i },
            { name: 'Binary app', regex: /binary\.com V([\d.]+)/i },
            { name: 'iPhone', regex: /\b(iPhone\d*)\b.*(DP2P)\b/ig },
            { name: 'Android', regex: /\b(Android\d*)\b.*(DP2P)\b/ig },
            { name: 'Dart', regex: /dart\/([\d\w.-]+)/i },
        ];
        for (let i = 0; i < lookup.length; i++) {
            const info  = lookup[i];
            let match = user_agent.match(info.regex);
            if (match !== null) {
                let app;
                if (['Android', 'iPhone'].includes(info.name)) {
                    match = user_agent.match(/(:?DP2P\/([\d\w.-]+))/ig)[0].split('/');
                    app = match[0];
                }
                return {
                    name   : info.name,
                    version: match[1],
                    ...app && { app },
                };
            }
        }
        return null;
    };

    const parse = (activity) => ({
        time   : activity.time,
        action : activity.action,
        success: activity.status === 1,
        browser: parseUA(activity.environment.match('User_AGENT=(.+) LANG')[1]),
        ip_addr: activity.environment.split(' ')[2].split('=')[1],
    });

    return {
        parse,
        parseUserAgent: parseUA,
    };
})();

module.exports = IPHistoryData;
