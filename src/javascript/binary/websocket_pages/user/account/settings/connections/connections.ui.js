const ConnectionsData  = require('./connections.data').ConnectionsData;
const showLoadingImage = require('../../../../../base/utility').showLoadingImage;
const localize         = require('../../../../../base/localize').localize;
const Button           = require('../../../../../common_functions/attach_dom/button').Button;
const FlexTableUI      = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
const Table            = require('../../../../../common_functions/attach_dom/table').Table;
const loadJS           = require('../../../../../../lib/loadJS').loadJS;

const ConnectionsUI = (function() {
    'use strict';

    const containerSelector = '#connections-ws-container';
    const messages = {
        no_connect_list: localize('You do not have any connections.'),
    };
    let flexTable;

    const formatConnect = function(connect) {
        return [
            connect,
            '', // for the "Del Connection" button
        ];
    };

    const createDelButton = function(container, connect) {
        const $buttonSpan = Button.createBinaryStyledButton();
        const $button = $buttonSpan.children('.button').first();
        $button.text('Delete Connection');
        $button.on('click', function() {
            if (window.confirm(localize('Are you sure that you want to permanently revoke connection to') + ": '" + connect + "'?")) {
                ConnectionsData.del(connect);
                container.css({ opacity: 0.5 });
            }
        });
        return $buttonSpan;
    };

    const createTable = function(data) {
        const table_id = 'connections-table';
        createConnectionsIframe(data);
        if (!data) {
            Table.clearTableBody(table_id);
            return;
        }
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].charAt(0).toUpperCase() + data[i].slice(1);
        }
        if (flexTable) {
            flexTable.replace(data);
            return;
        }
        const headers = ['Provider', 'Action'];
        const columns = ['provider', 'action'];
        flexTable = new FlexTableUI({
            container: containerSelector,
            header   : headers.map(function(s) { return localize(s); }),
            id       : table_id,
            cols     : columns,
            data     : data,
            style    : function($row, connect) {
                $row.children('.action').first()
                    .append(createDelButton($row, connect));
            },
            formatter: formatConnect,
        });
    };

    const update = function(connect_list) {
        $('#loading').remove();
        createTable(connect_list);
        if (!connect_list.length) {
            flexTable.displayError(localize(messages.no_connect_list), 7);
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

    const createConnectionsIframe = (data) => {
        if ($('#oa_social_login_container').children().length > 0) return;

        // we may add more providers (facebook, twitter) in the future
        const list_of_providers = ['google'];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const index = list_of_providers.indexOf(data[i]);
                if (index > -1) {
                    list_of_providers.splice(index, 1);
                }
            }
        }

        if (!list_of_providers.length) return;

        loadJS('//binary.api.oneall.com/socialize/library.js');

        const your_callback_script = 'https://www.binaryqa16.com/oauth2/oneall/redirect?dir=' + encodeURIComponent(window.location.href);
        /* Embeds the buttons into the container oa_social_login_container */
        window._oneall = window._oneall || [];
        window._oneall.push(
            ['social_login', 'set_providers',    list_of_providers],
            ['social_login', 'set_callback_uri', your_callback_script],
            ['social_login', 'do_render_ui',     'oa_social_login_container']);
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
