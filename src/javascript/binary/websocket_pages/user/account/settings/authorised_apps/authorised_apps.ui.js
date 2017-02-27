const showLoadingImage     = require('../../../../../base/utility').showLoadingImage;
const showLocalTimeOnHover = require('../../../../../base/clock').Clock.showLocalTimeOnHover;
const localize             = require('../../../../../base/localize').localize;
const Button      = require('../../../../../common_functions/attach_dom/button').Button;
const FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
const ApplicationsData = require('./authorised_apps.data');

const ApplicationsUI = (() => {
    'use strict';

    const container_selector = '#applications-ws-container';
    const messages = {
        no_apps       : 'You have not granted access to any applications.',
        revoke_confirm: 'Are you sure that you want to permanently revoke access to application',
        revoke_access : 'Revoke access',
    };
    let flex_table;

    const formatApp = (app) => {
        const last_used = app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : localize('Never');
        return [
            app.name,
            app.scopes.join(', '),
            last_used,
            '', // for the "Revoke App" button
        ];
    };

    const createRevokeButton = (container, app) => {
        const $button_span = Button.createBinaryStyledButton();
        const $button = $button_span.children('.button').first();
        $button.text(localize(messages.revoke_access));
        $button.on('click', function() {
            if (window.confirm(localize(messages.revoke_confirm) + ": '" + app.name + "'?")) {
                BinarySocket.send({ oauth_apps: 1, revoke_app: app.id }).then((response) => {
                    if (response.error) {
                        displayError(response.error.message);
                    } else {
                        update(response.oauth_apps.map(ApplicationsData.parse));
                    }
                });
                container.css({ opacity: 0.5 });
            }
        });
        return $button_span;
    };

    const createTable = (data) => {
        if (flex_table) {
            return flex_table.replace(data);
        }
        const headers = ['Name', 'Permissions', 'Last Used', 'Action'];
        const columns = ['name', 'permissions', 'last_used', 'action'];
        flex_table = new FlexTableUI({
            container: container_selector,
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

    const update = (apps) => {
        $('#loading').remove();
        createTable(apps);
        if (!apps.length) {
            flex_table.displayError(localize(messages.no_apps), 7);
        }
    };

    const displayError = (message) => {
        $(container_selector + ' .error-msg').text(message);
    };

    const init = () => {
        showLoadingImage($('<div/>', { id: 'loading' }).insertAfter('#applications-title'));
    };

    const clean = () => {
        $(container_selector + ' .error-msg').text('');
        flex_table.clear();
        flex_table = null;
    };

    return {
        init        : init,
        clean       : clean,
        update      : update,
        displayError: displayError,
    };
})();

module.exports = ApplicationsUI;
