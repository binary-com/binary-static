const showLoadingImage     = require('../../../../../base/utility').showLoadingImage;
const showLocalTimeOnHover = require('../../../../../base/clock').Clock.showLocalTimeOnHover;
const localize             = require('../../../../../base/localize').localize;
const Button      = require('../../../../../common_functions/attach_dom/button').Button;
const FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
const ConnectionsData = require('./connections.data').ConnectionsData;

const ConnectionsUI = (function() {
    'use strict';

    const containerSelector = '#connections-ws-container';
    const messages = {
        no_apps       : 'You do not have any connection.'
    };
    let flexTable;

    const formatApp = function(app) {
        const last_used = app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : localize('Never');
        return [
            app.name,
            app.scopes.join(', '),
            last_used,
            '', // for the "Del Connection" button
        ];
    };

    const createDelButton = function(container, app) {
        const $buttonSpan = Button.createBinaryStyledButton();
        const $button = $buttonSpan.children('.button').first();
        $button.text('Delete Connection');
        $button.on('click', function() {
            if (window.confirm("Confirm: '" + app.name + "'?")) {
                ConnectionsData.del(app.provider);
                container.css({ opacity: 0.5 });
            }
        });
        return $buttonSpan;
    };

    const createTable = function(data) {
        if (flexTable) {
            return flexTable.replace(data);
        }
        const headers = ['Name', 'Permissions', 'Last Used', 'Action'];
        const columns = ['name', 'permissions', 'last_used', 'action'];
        flexTable = new FlexTableUI({
            container: containerSelector,
            header   : headers.map(function(s) { return localize(s); }),
            id       : 'connections-table',
            cols     : columns,
            data     : data,
            style    : function($row, app) {
                $row.children('.action').first()
                    .append(createDelButton($row, app));
            },
            formatter: formatApp,
        });
        return showLocalTimeOnHover('td.last_used');
    };

    const update = function(apps) {
        $('#loading').remove();
        createTable(apps);
        if (!apps.length) {
            flexTable.displayError(localize(messages.no_apps), 7);
        }
    };

    const displayError = function(message) {
        $(containerSelector + ' .error-msg').text(message);
    };

    const init = function() {
        showLoadingImage($('<div/>', { id: 'loading' }).insertAfter('#connections-title'));
        const $title = $('#connections-title').children().first();
        const $desc  = $('#description');
        $title.text(localize($title.text()));
        $desc.text(localize($desc.text()));
    };

    const clean = function() {
        $(containerSelector + ' .error-msg').text('');
        flexTable.clear();
        flexTable = null;
    };

    return {
        init        : init,
        clean       : clean,
        update      : update,
        displayError: displayError,
    };
})();

module.exports = {
    ConnectionsUI: ConnectionsUI,
};
