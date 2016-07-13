var IPHistoryUI = (function(){
    "use strict";

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
        var name = 'Unknown';
        var version = 'Unknown';
        for (var i = 0; i < lookup.length; i++) {
            var info = lookup[i];
            var match = user_agent.match(info.regex);
            if (match !== null) {
                name = info.name;
                version = match[1];
                break;
            }
        }
        return {
            name: name,
            version: version,
        };
    }

    var tableID = "login-history-table",
        columns = ["timestamp","action","browser","ip","status"];

    function createEmptyTable(){
        var header = [
            "Date and Time",
            "Action",
            "Browser",
            "IP Address",
            "Status",
        ].map(text.localize);
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $table = Table.createFlexTable(data, metadata, header);
        return $table;
    }

    function updateTable(history){
        Table.appendTableBody(tableID, history, createRow);
        showLocalTimeOnHover('td.timestamp');
    }

    function createRow(data){
        var environ    = data.environment;
        var timestamp  = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        var ip_addr    = environ.split(' ')[2].split('=')[1];
        var user_agent = environ.match('User_AGENT=(.+) LANG')[1];
        var browser    = parse_ua(user_agent);

        var status = text.localize(data.status === 1 ? 'Successful' : 'Failed');
        var browserString = browser.name + " v" + browser.version;
        var $row = Table.createFlexTableRow([timestamp, data['action'], browserString, ip_addr, status], columns, "data");
        $row.children(".timestamp").addClass('pre');
        return $row[0];
    }

    function clearTableContent(){
        Table.clearTableBody(tableID);
        $("#" + tableID +">tfoot").hide();
    }

    return{
        createEmptyTable: createEmptyTable,
        updateTable: updateTable,
        clearTableContent: clearTableContent
    };
}());
