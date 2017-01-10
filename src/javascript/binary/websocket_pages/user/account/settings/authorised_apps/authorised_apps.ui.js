const showLoadingImage     = require('../../../../../base/utility').showLoadingImage;
const showLocalTimeOnHover = require('../../../../../base/clock').Clock.showLocalTimeOnHover;
const localize             = require('../../../../../base/localize').localize;
const Button      = require('../../../../../common_functions/attach_dom/button').Button;
const FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
const ApplicationsData = require('./authorised_apps.data').ApplicationsData;

const ApplicationsUI = (function() {
    'use strict';

    const containerSelector = '#applications-ws-container';
    const messages = {
        no_apps       : 'You have not granted access to any applications.',
        revoke_confirm: 'Are you sure that you want to permanently revoke access to application',
        revoke_access : 'Revoke access',
    };
    let flexTable;

    const formatApp = function(app) {
        const last_used = app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : localize('Never');
        return [
            app.name,
            app.scopes.join(', '),
            last_used,
            '', // for the "Revoke App" button
        ];
    };

    const createRevokeButton = function(container, app) {
        const $buttonSpan = Button.createBinaryStyledButton();
        const $button = $buttonSpan.children('.button').first();
        $button.text(localize(messages.revoke_access));
        $button.on('click', function() {
            if (window.confirm(localize(messages.revoke_confirm) + ": '" + app.name + "'?")) {
                ApplicationsData.revoke(app.id);
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
        showLoadingImage($('<div/>', { id: 'loading' }).insertAfter('#applications-title'));
        const $title = $('#applications-title').children().first();
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
    ApplicationsUI: ApplicationsUI,
};
