var showLoadingImage = require('../../../../../base/utility').showLoadingImage;
var showLocalTimeOnHover = require('../../../../../base/utility').showLocalTimeOnHover;
var Button = require('../../../../../common_functions/attach_dom/button').Button;
var FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
var ApplicationsData = require('./authorised_apps.data').ApplicationsData;

var ApplicationsUI = (function() {
    'use strict';

    var containerSelector = '#applications-ws-container';
    var messages = {
        no_apps       : 'You have not granted access to any applications.',
        revoke_confirm: 'Are you sure that you want to permanently revoke access to application',
        revoke_access : 'Revoke access',
    };
    var flexTable;

    function createTable(data) {
        if (flexTable) {
            return flexTable.replace(data);
        }
        var headers = ['Name', 'Permissions', 'Last Used', 'Action'];
        var columns = ['name', 'permissions', 'last_used', 'action'];
        flexTable = new FlexTableUI({
            container: containerSelector,
            header   : headers.map(function(s) { return page.text.localize(s); }),
            id       : 'applications-table',
            cols     : columns,
            data     : data,
            style    : function($row, app) {
                $row.children('.action').first()
                    .append(createRevokeButton($row, app));
            },
            formatter: formatApp,
        });
        return showLocalTimeOnHover('td.last_used');
    }

    function formatApp(app) {
        var last_used = app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : page.text.localize('Never');
        return [
            app.name,
            app.scopes.join(', '),
            last_used,
            '', // for the "Revoke App" button
        ];
    }

    function update(apps) {
        $('#loading').remove();
        createTable(apps);
        if (!apps.length) {
            flexTable.displayError(page.text.localize(messages.no_apps), 7);
        }
    }

    function createRevokeButton(container, app) {
        var $buttonSpan = Button.createBinaryStyledButton();
        var $button = $buttonSpan.children('.button').first();
        $button.text(page.text.localize(messages.revoke_access));
        $button.on('click', function() {
            if (window.confirm(page.text.localize(messages.revoke_confirm) + ": '" + app.name + "'?")) {
                ApplicationsData.revoke(app.id);
                container.css({ opacity: 0.5 });
            }
        });
        return $buttonSpan;
    }

    function displayError(message) {
        $(containerSelector + ' .error-msg').text(message);
    }

    function init() {
        showLoadingImage($('<div/>', { id: 'loading' }).insertAfter('#applications-title'));
        var $title = $('#applications-title').children().first();
        var $desc  = $('#description');
        $title.text(page.text.localize($title.text()));
        $desc.text(page.text.localize($desc.text()));
    }

    function clean() {
        $(containerSelector + ' .error-msg').text('');
        flexTable.clear();
        flexTable = null;
    }

    return {
        init        : init,
        clean       : clean,
        update      : update,
        displayError: displayError,
    };
})();

module.exports = {
    ApplicationsUI: ApplicationsUI,
};
