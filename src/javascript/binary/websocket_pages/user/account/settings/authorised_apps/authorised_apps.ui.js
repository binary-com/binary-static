const ApplicationsData     = require('./authorised_apps.data');
const BinarySocket         = require('../../../../socket');
const showLocalTimeOnHover = require('../../../../../base/clock').showLocalTimeOnHover;
const localize             = require('../../../../../base/localize').localize;
const showLoadingImage     = require('../../../../../base/utility').showLoadingImage;
const FlexTableUI          = require('../../../../../common_functions/attach_dom/flextable');
const toTitleCase          = require('../../../../../common_functions/string_util').toTitleCase;

const ApplicationsUI = (() => {
    'use strict';

    const container_selector = '#applications-container';
    const messages = {
        no_apps       : 'You have not granted access to any applications.',
        revoke_confirm: 'Are you sure that you want to permanently revoke access to application',
        revoke_access : 'Revoke access',
    };

    const formatApp = (app) => {
        const last_used = app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : localize('Never');
        const scopes = app.scopes.map(scope => localize(toTitleCase(scope))).join(', ');
        return [
            app.name,
            scopes,
            last_used,
            '', // for the "Revoke App" button
        ];
    };

    const createRevokeButton = (container, app) => {
        const $button = $('<button/>', { class: 'button', text: localize(messages.revoke_access) });
        $button.on('click', () => {
            if (window.confirm(`${localize(messages.revoke_confirm)}: '${app.name}'?`)) {
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
        return $button;
    };

    const createTable = (data) => {
        if ($('#applications-table').length) {
            return FlexTableUI.replace(data);
        }
        const headers = ['Name', 'Permissions', 'Last Used', 'Action'];
        const columns = ['name', 'permissions', 'last_used', 'action'];
        FlexTableUI.init({
            container: container_selector,
            header   : headers.map(s => localize(s)),
            id       : 'applications-table',
            cols     : columns,
            data     : data,
            style    : ($row, app) => {
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
            FlexTableUI.displayError(localize(messages.no_apps), 7);
        }
    };

    const displayError = (message) => {
        $(container_selector).find('.error-msg').text(message);
    };

    const init = () => {
        showLoadingImage($('<div/>', { id: 'loading' }).insertAfter('#applications-title'));
    };

    const clean = () => {
        $(container_selector).find('.error-msg').text('');
        FlexTableUI.clear();
    };

    return {
        init        : init,
        clean       : clean,
        update      : update,
        displayError: displayError,
    };
})();

module.exports = ApplicationsUI;
