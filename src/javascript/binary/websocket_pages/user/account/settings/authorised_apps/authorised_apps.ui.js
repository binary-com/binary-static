const ApplicationsData     = require('./authorised_apps.data');
const BinarySocket         = require('../../../../socket');
const showLocalTimeOnHover = require('../../../../../base/clock').showLocalTimeOnHover;
const localize             = require('../../../../../base/localize').localize;
const showLoadingImage     = require('../../../../../base/utility').showLoadingImage;
const State                = require('../../../../../base/storage').State;
const FlexTableUI          = require('../../../../../common_functions/attach_dom/flextable');
const toTitleCase          = require('../../../../../common_functions/string_util').toTitleCase;

const ApplicationsUI = (() => {
    let can_revoke = false;

    const container_selector = '#applications-container';
    const messages = {
        no_apps       : 'You have not granted access to any applications.',
        revoke_confirm: 'Are you sure that you want to permanently revoke access to application',
        revoke_access : 'Revoke access',
    };

    const formatApp = (app) => {
        const last_used = app.last_used ? app.last_used.format('YYYY-MM-DD HH:mm:ss') : localize('Never');
        const scopes = app.scopes.map(scope => localize(toTitleCase(scope))).join(', ');
        const data = [app.name, scopes, last_used];
        if (can_revoke) {
            data.push(''); // for the "Revoke App" button
        }
        return data;
    };

    const createRevokeButton = (container, app) => {
        const $button = $('<button/>', { class: 'button', text: localize(messages.revoke_access) });
        $button.on('click', () => {
            if (window.confirm(`${localize(messages.revoke_confirm)}: '${app.name}'?`)) {
                BinarySocket.send({ revoke_oauth_app: app.id }).then((response) => {
                    if (response.error) {
                        displayError(response.error.message);
                    } else {
                        BinarySocket.send({ oauth_apps: 1 }).then((res) => {
                            if (res.oauth_apps) {
                                update(res.oauth_apps.map(ApplicationsData.parse));
                            }
                        });
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
        const headers = ['Name', 'Permissions', 'Last Used'];
        can_revoke = /admin/.test((State.getResponse('authorize') || {}).scopes);
        if (can_revoke) {
            headers.push('Action');
        }
        FlexTableUI.init({
            container: container_selector,
            header   : headers.map(localize),
            id       : 'applications-table',
            cols     : headers.map(title => title.toLowerCase().replace(/\s/g, '-')),
            data,
            style    : ($row, app) => {
                if (can_revoke) {
                    $row.children('.action').first().append(createRevokeButton($row, app));
                }
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
        init,
        clean,
        update,
        displayError,
    };
})();

module.exports = ApplicationsUI;
