var IPHistoryUI = (function(){
    "use strict";

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
    }

    function createRow(data){
        var userAgent = data['environment'];
        var history = userAgent.split(' ');
        var timestamp = history[0];
        var ip = history[2].split('=')[1];
        var browser = "Unknown",
            ver = "Unknown",
            verOffset = 0;
        if (/(msie|trident)/i.test(userAgent)){
            browser = "Internet Explorer";
            verOffset = /(msie)/i.test(userAgent) ? userAgent.indexOf("MSIE") : verOffset;
            verOffset = /(trident)/i.test(userAgent) ? userAgent.indexOf("Trident") : verOffset;
            ver = userAgent.substring(verOffset+13).split(" ")[0].split(":")[1].split(")")[0];
        } else if ((verOffset = userAgent.indexOf("Edge")) != -1) {
            browser = "Edge";
            ver = userAgent.substring(verOffset).split("/")[1].split(" ")[0];
        } else if ((verOffset = userAgent.indexOf("OPR")) != -1){
            browser = "Opera";
            ver = userAgent.substring(verOffset+4).split(" ")[0];
        } else if ((verOffset = userAgent.indexOf("Chrome")) != -1){
            browser = "Chrome";
            ver = userAgent.substring(verOffset+7).split(" ")[0];
        } else if ((verOffset = userAgent.indexOf("Safari")) != -1){
            browser = "Safari";
            ver = userAgent.substring(verOffset+7).split(" ")[0];
        } else if ((verOffset = userAgent.indexOf("Firefox")) != -1){
            browser = "Firefox";
            ver = userAgent.substring(verOffset+8).split(" ")[0];
        }
        var status = data['status'] === 1 ? text.localize('Successful') : text.localize('Failed');
        var browserString = browser + " v" + ver;
        var $row = Table.createFlexTableRow([timestamp, data['action'], browserString, ip, status], columns, "data");
        $row.children(".timestamp").first().append('<br>' + history[1]);
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
