var ApplicationsUI = (function(){
    'use strict';
    var tableID  = 'applications-table';
    var selector = '#' + tableID;
    var containerSelector = '#applications-ws-container';
    var columns  = ['name','permissions','last_used','action'];
    var messages = {
        no_apps: 'You have not granted access to any applications.',
        revoke_confirm: 'Are you sure that you want to permanently revoke access to application',
        revoke_access: 'Revoke access',
    };

    function createEmptyTable() {
        var header = [
                'Name',
                'Permissions',
                'Last Used',
                'Action',
            ].map(text.localize);
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $table = Table.createFlexTable(data,metadata,header);
        $table.appendTo(containerSelector);
        return $table;
    }

    function update(apps) {
        createEmptyTable();
        $('#loading').remove();
        if (!apps.length) {
            $(selector + ' tbody')
                .append($('<tr/>', {class: 'flex-tr'})
                    .append($('<td/>', {colspan: 7})
                        .append($('<p/>', {class: 'notice-msg center-text', text: text.localize(messages.no_apps)})
                        )
                    )
                );
            return;
        }
        Table.clearTableBody(tableID);
        Table.appendTableBody(tableID, apps, createRow);
        showLocalTimeOnHover('td.last_used');
    }

    function createRevokeButton(container, app) {
        var $buttonSpan = Button.createBinaryStyledButton();
        var $button = $buttonSpan.children('.button').first();
        $button.text(text.localize(messages.revoke_access));
        $button.on('click', function() {
            if (window.confirm(text.localize(messages.revoke_confirm) + ": '" + app.name + "'?")) {
                Applications.revokeApplication(app.id);
                container.css({ opacity: 0.5 });
            }
        });
        return $buttonSpan;
    }

    function createRow(app) {
        var row = [
            app.name,
            app.scopes.join(', '),
            app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : text.localize('Never'),
            '',
        ];
        var $row = Table.createFlexTableRow(row, columns, 'data');
        $row.children('.action').first().append(createRevokeButton($row, app));
        return $row[0];
    }

    function displayError(message) {
        $(containerSelector + ' .error-msg').text(message);
    }

    function init() {
        showLoadingImage($('<div/>', {id: 'loading'}).insertAfter('#applications-title'));
        var $title = $('#applications-title').children().first();
        var $desc  = $('#description');
        $title.text(text.localize($title.text()));
        $desc.text(text.localize($desc.text()));
    }

    function clean() {
        Table.clearTableBody(tableID);
    }

    return {
        init: init,
        clean: clean,
        update: update,
        displayError: displayError
    };
}());
