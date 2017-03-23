const BinaryPjax           = require('../../../../base/binary_pjax');
const showLocalTimeOnHover = require('../../../../base/clock').showLocalTimeOnHover;
const localize             = require('../../../../base/localize').localize;
const showLoadingImage     = require('../../../../base/utility').showLoadingImage;
const FlexTableUI          = require('../../../../common_functions/attach_dom/flextable').FlexTableUI;
const Content              = require('../../../../common_functions/content').Content;
const japanese_client      = require('../../../../common_functions/country_base').japanese_client;
const ValidateV2           = require('../../../../common_functions/validation_v2').ValidateV2;
const customError          = require('../../../../validator').customError;
const bind_validation      = require('../../../../validator').bind_validation;
const ValidationUI         = require('../../../../validator').ValidationUI;
const dv                   = require('../../../../../lib/validation');

const APITokenWS = (function() {
    'use strict';

    const errorClass = 'errorfield';
    const hideClass  = 'invisible';
    const tableContainer = '#tokens_list';
    const maxTokens = 30;

    const hide = function(s) { return function() { $(s).addClass(hideClass); }; };
    const show = function(s) { return function() { $(s).removeClass(hideClass); }; };

    const hideForm  = hide('#token_form');
    const showForm  = show('#token_form');
    const hideTable = hide(tableContainer);
    const showTable = show(tableContainer);

    const onLoad = function() {
        if (japanese_client()) {
            BinaryPjax.load('user/settingsws');
            return;
        }

        Content.populate();
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response.msg_type === 'api_token') {
                    responseHandler(response);
                }
            },
        });

        showLoadingImage($(tableContainer));
        BinarySocket.send({ api_token: 1 });
        bind_validation.simple($('#token_form')[0], {
            schema: getSchema(),
            stop  : function(info) {
                ValidationUI.clear();
                displayErrors(info.errors);
            },
            submit: function(e, info) {
                e.preventDefault();
                e.stopPropagation();
                if (info.errors.length > 0) {
                    return;
                }
                createToken(info.values);
            },
        });
    };

    const getSchema = function() {
        const V2 = ValidateV2;
        const letters = Content.localize().textLetters;
        const numbers = Content.localize().textNumbers;
        return {
            scopes: [
                function(v) { return dv.ok(v || []); },
                customError(V2.required, localize('Please select at least one scope')),
            ],
            name: [
                function(v) { return dv.ok(v.trim()); },
                V2.required,
                V2.lengthRange(2, 32),
                V2.regex(/^\w+$/, [letters, numbers, '_']),
            ],
        };
    };

    const responseHandler = function(response) {
        if ('error' in response) {
            showErrorMessage(response.error.message);
            return;
        }

        clearMessages();

        const api_token = response.api_token,
            tokens    = api_token.tokens;
        let newToken;

        if (tokens.length >= maxTokens) {
            hideForm();
            showErrorMessage(localize('The maximum number of tokens ([_1]) has been reached.', [maxTokens]));
        } else {
            showForm();
        }

        if ('new_token' in api_token) {
            showSubmitSuccess('New token created.');
            $('#txtName').val('');
            newToken = response.echo_req.new_token;
        } else if ('delete_token' in api_token) {
            const deleted = response.echo_req.delete_token;
            $('#' + deleted)
                .removeClass('new')
                .addClass('deleting')
                .fadeOut(700, function() {
                    $(this).remove();
                    populateTokensList(tokens);
                });
            return;
        }

        populateTokensList(tokens, newToken);
    };

    // -----------------------
    // ----- Tokens List -----
    // -----------------------
    const populateTokensList = function(tokens, newToken) {
        const $tableContainer = $(tableContainer);
        if (tokens.length === 0) {
            hideTable();
            return;
        }
        showTable();
        $tableContainer.empty();

        const headers = ['Name', 'Token', 'Scopes', 'Last Used', 'Action'];
        const columns = ['name', 'token', 'scopes', 'last-used', 'action'];
        new FlexTableUI({
            id       : 'tokens_table',
            container: tableContainer,
            header   : headers.map(function(s) { return localize(s); }),
            cols     : columns,
            data     : tokens,
            formatter: formatToken,
            style    : function($row, token) {
                if (token.display_name === newToken) {
                    $row.addClass('new');
                }
                $row.attr('id', token.token);
                createDeleteButton($row, token);
            },
        });
        showLocalTimeOnHover('td.last-used');
    };

    const createDeleteButton = function($row, token) {
        const message = localize('Are you sure that you want to permanently delete token');
        const $button = $('<button/>', { class: 'button btnDelete', text: localize('Delete') });
        $button.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!window.confirm(message + ': "' + token.display_name + '"?')) {
                return;
            }
            deleteToken(token.token);
        });
        $row.children('.action').html(
            $('<span/>', { class: 'button' })
                .append($button));
    };

    const capitalise = function(v) {
        return v.charAt(0).toUpperCase() + v.slice(1);
    };

    const formatToken = function(token) {
        const lastUsed = (token.last_used ? token.last_used + ' GMT' : localize('Never Used'));
        const scopes = token.scopes.map(capitalise);
        return [
            token.display_name,
            token.token,
            scopes.join(', '),
            lastUsed,
            '',  // btnDelete
        ];
    };

    const displayErrors = function(errors) {
        errors.forEach(function(err) {
            const sel = err.ctx === 'name' ?
                '#txtName' :
                '#scopes';
            ValidationUI.draw(sel, err.err);
        });
    };

    // ---------------------------
    // ----- Actions Process -----
    // ---------------------------
    const createToken = function(params) {
        BinarySocket.send({
            api_token       : 1,
            new_token       : params.name,
            new_token_scopes: params.scopes,
        });
    };

    const deleteToken = function(token) {
        BinarySocket.send({
            api_token   : 1,
            delete_token: token,
        });
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    const showErrorMessage = function(msg) {
        $('#token_message').removeClass(hideClass)
            .find('p')
            .attr('class', errorClass)
            .html(localize(msg));
    };

    const showSubmitSuccess = function(msg) {
        $('#formMessage')
            .attr('class', 'success-msg')
            .html('<ul class="checked"><li>' + localize(msg) + '</li></ul>')
            .css('display', 'block')
            .delay(3000)
            .fadeOut(1000);
    };

    const clearMessages = function() {
        $('#token_message').addClass(hideClass);
        $('#formMessage').html('');
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = APITokenWS;
