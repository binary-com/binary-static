var ApplicationsUI = (function(){
    "use strict";
    var tableID = "applications-table",
        columns = ["name","permissions","last_used","action"];
    
    function createEmptyTable(){
        var header = [
                text.localize("Name"),
                text.localize("Permissions"),
                text.localize("Last Used"),
                text.localize("Action")
            ];
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $table = Table.createFlexTable(data,metadata,header);
        return $table;
    }
    
    function createTable(app){
        Table.clearTableBody(tableID);
        Table.appendTableBody(tableID, app, createRow);
        showLocalTimeOnHover('td.last_used');
    }
    
    function createRow(data){
        var name = data.name,
            permissions = data.scopes.join(", "),
            last_used = data.last_used ? moment.utc(data.last_used).format("YYYY-MM-DD HH:mm:ss") : text.localize("Never"),
            action = '';
        var $row = Table.createFlexTableRow([name,permissions,last_used,action], columns,"data");
        var $viewButtonSpan = Button.createBinaryStyledButton();
        var $viewButton = $viewButtonSpan.children(".button").first();
        $viewButton.text(text.localize("Revoke access"));
        $viewButton.on("click",function(){
            ApplicationsData.revokeApplication(data.app_id);
            $row.css({ opacity: 0.5 });
        });
        $row.children(".action").first().append($viewButtonSpan);
        return $row[0];
    }
    
    function clearTableContent(){
        Table.clearTableBody(tableID);
        $("#" + tableID +">tfoot").hide();
    }
    
    return{
        createEmptyTable: createEmptyTable,
        createTable: createTable,
        clearTableContent: clearTableContent
    };
    
}());
