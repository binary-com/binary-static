var APITokenWS = (function() {
    "use strict";

    var errorClass = 'errorfield';
    var hideClass  = 'invisible';
    var tableContainer = '#tokens_list';
    var maxTokens = 30;

    function hide(s) { return function() { $(s).addClass(hideClass); }; }
    function show(s) { return function() { $(s).removeClass(hideClass); }; }

    var hideForm  = hide('#token_form');
    var showForm  = show('#token_form');
    var hideTable = hide(tableContainer);
    var showTable = show(tableContainer);

    function init() {
        if (japanese_client()) {
            window.location.href = page.url.url_for('user/settingsws');
            return;
        }

        Content.populate();
        showLoadingImage($(tableContainer));
        LiveAPI.send({api_token: 1})
            .then(function(r) {
                eachResponse(r);
                populateTokensList(r.api_token.tokens);
            });

        bind_validation.simple($('#token_form')[0], {
            schema: getSchema(),
            stop: function(info) {
                ValidationUI.clear();
                displayErrors(info.errors);
            },
            submit: function(e, info) {
                e.preventDefault();
                e.stopPropagation();
                if (info.errors.length > 0) {
                    return;
                }
                createToken(info.values)
                    .then(function(r) {
                        eachResponse(r);
                        showSubmitSuccess('New token created.');
                        $('#txtName').val('');
                        populateTokensList(r.api_token.tokens, info.values.api_token);
                    });
            }
        });
    }

    function getSchema() {
        var V2 = ValidateV2;
        var letters = Content.localize().textLetters;
        var numbers = Content.localize().textNumbers;
        return {
            scopes: [
                function(v) {return dv.ok(v || []); },
                customError(V2.required, 'Please select at least one scope'),
            ],
            name:   [
                function(v) { return dv.ok(v.trim()); },
                V2.required,
                V2.lengthRange(2, 32),
                V2.regex(/^\w+$/, [letters, numbers, '_']),
            ],
        };
    }

    function eachResponse(response) {
        clearMessages();
        if (response.api_token.tokens.length >= maxTokens) {
            hideForm();
            showErrorMessage(text.localize('The maximum number of tokens ([_1]) has been reached.', [maxTokens]));
        } else {
            showForm();
        }
    }

    // -----------------------
    // ----- Tokens List -----
    // -----------------------
    function populateTokensList(tokens, newToken) {
        var $tableContainer = $(tableContainer);
        if (tokens.length === 0) {
            hideTable();
            return;
        }
        showTable();
        $tableContainer.empty();

        var headers = ['Name', 'Token', 'Scopes', 'Last Used', 'Action'];
        var columns = ['name', 'token', 'scopes', 'last-used', 'action'];
        new FlexTableUI({
            id:        'tokens_table',
            container: tableContainer,
            header:    headers.map(function(s) { return text.localize(s); }),
            cols:      columns,
            data:      tokens,
            formatter: formatToken,
            style: function($row, token) {
                if (token.display_name === newToken) {
                    $row.addClass('new');
                }
                createDeleteButton($row, token);
            }
        });
        showLocalTimeOnHover('td.last-used');
    }

    function createDeleteButton($row, token) {
        var message = text.localize('Are you sure that you want to permanently delete token');
        var $button = $('<button/>', {class: 'button btnDelete', text: text.localize('Delete')});
        $button.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!window.confirm(message + ': "' + token.display_name + '"?')) {
                return;
            }
            deleteToken(token.token).then(function(r) {
                eachResponse(r);
                $row.removeClass('new')
                    .addClass('deleting')
                    .fadeOut(700, function() {
                        $(this).remove();
                        populateTokensList(r.api_token.tokens);
                    });
            });
        });
        $row.children('.action').html(
            $('<span/>', {class: 'button'})
                .append($button)
        );
    }

    function capitalise(v) {
        return v.charAt(0).toUpperCase() + v.slice(1);
    }

    function formatToken(token) {
        var lastUsed = (token.last_used ? token.last_used + ' GMT': text.localize('Never Used'));
        var scopes = token.scopes.map(capitalise);
        return [
            token.display_name,
            token.token,
            scopes.join(', '),
            lastUsed,
            ''  // btnDelete
        ];
    }

    function displayErrors(errors) {
        errors.forEach(function(err) {
            var sel = err.ctx === 'name' ?
                '#txtName' :
                '#scopes';
            ValidationUI.draw(sel, err.err);
        });
    }

    function errorHandler(err) {
        showErrorMessage(err.message);
    }

    // ---------------------------
    // ----- Actions Process -----
    // ---------------------------
    function createToken(params) {
        return LiveAPI.send({
            api_token: 1,
            new_token: params.name,
            new_token_scopes: params.scopes,
        }).catch(errorHandler);
    }

    function deleteToken(token) {
        return LiveAPI.send({
            api_token:    1,
            delete_token: token,
        }).catch(errorHandler);
    }

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    function showErrorMessage(msg) {
        $('#token_message').removeClass(hideClass)
            .find('p')
            .attr('class', errorClass)
            .html(text.localize(msg));
    }

    function showSubmitSuccess(msg) {
        $('#formMessage')
            .attr('class', 'success-msg')
            .html('<ul class="checked"><li>' + text.localize(msg) + '</li></ul>')
            .css('display', 'block')
            .delay(3000)
            .fadeOut(1000);
    }

    function clearMessages() {
        $('#token_message').addClass(hideClass);
        $('#formMessage').html('');
    }

    return {
        init: init,
    };
}());
