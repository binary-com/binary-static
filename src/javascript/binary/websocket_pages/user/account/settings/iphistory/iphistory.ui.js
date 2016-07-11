var IPHistoryUI = (function(){
    "use strict";

    function parse_ua(user_agent) {
        // Table of UA-values (and precedences) from:
        //  https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        var vn = '([0-9\.]+)';
        var lookup = [
            {name: 'Chromium',  regex: 'Chromium/' + vn},
            {name: 'Chrome',    regex: 'Chrome/' + vn},
            {name: 'Seamonkey', regex: 'Seamonkey/' + vn},
            {name: 'Firefox',   regex: 'Firefox/' + vn},
            {name: 'Opera',     regex: 'OPR/' + vn},
            {name: 'Opera',     regex: 'Opera/' + vn},
            {name: 'Safari',    regex: 'Version/' + vn},
            {name: 'Internet Explorer', regex: ';MSIE '+ vn +';'},
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
