var IPHistoryUI = (function(){
    "use strict";

    function parse_ua(user_agent) {
        var lookup = [
            {name: 'Chromium',  regex: 'Chromium/(.+)'},
            {name: 'Chrome',    regex: 'Chrome/(.+)'},
            {name: 'Seamonkey', regex: 'Seamonkey/(.+)'},
            {name: 'Firefox',   regex: 'Firefox/(.+)'},
            {name: 'Opera',     regex: 'OPR/(.+)'},
            {name: 'Opera',     regex: 'Opera/(.+)'},
            {name: 'Internet Explorer', regex: ';MSIE (.+);'},
        ];
        var len = lookup.length;
        var name = 'Unknown';
        var version = 'Unknown';
        while (len--) {
            var info = lookup[len];
            var match = user_agent.match(info.regex);
            if (match !== null) {
                name = info.name;
                version = match[1];
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
            text.localize("Date and Time"),
            text.localize("Action"),
            text.localize("Browser"),
            text.localize("IP Address"),
            text.localize("Status"),
        ];
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $table = Table.createFlexTable(data,metadata,header);
        return $table;
    }

    function updateTable(history){
        Table.appendTableBody(tableID, history, createRow);
        showLocalTimeOnHover('td.timestamp');
    }

    function createRow(data){
        var environ    = data['environment'];
        console.log(environ);
        var timestamp  = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        var ip_addr    = environ.split(' ')[2].split('=')[1];
        var user_agent = environ.match(new RegExp('User_AGENT=(.+) LANG'))[1];
        var browser    = parse_ua(user_agent);

        var status = data['status'] === 1 ? text.localize('Successful') : text.localize('Failed');
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
