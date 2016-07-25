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

    var init = function() {
        showLoadingImage($(tableContainer));

        BinarySocket.send({api_token: 1});
        $('#btnCreate').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var params = getFormParams();
            if (!params) {
                return;
            }
            createToken(params);
        });
    };

    function responseHandler(response) {
        if ('error' in response) {
            showMessage(response.error.message, false);
            return false;
        }

        clearMessages();

        var api_token = response.api_token;
        var tokens    = api_token.tokens;
        var newToken  = '';
        var rebuild   = true;

        if ('new_token' in api_token) {
            showFormMessage(text.localize('New token created.'), true);
            $('#txtName').val('');
            newToken = response.echo_req.new_token;
        } else if ('delete_token' in api_token) {
            rebuild = false;
            var deleted = response.echo_req.delete_token;
            $('#' + deleted)
                .removeClass('new')
                .addClass('deleting')
                .fadeOut(700, function() {
                    $(this).remove();
                    if (tokens.length === 0) {
                        hideTable();
                    }
                });
        }

        if (rebuild) {
            populateTokensList(tokens, newToken);
        }

        // Hide form if tokens count reached the maximum limit
        if (api_token.tokens.length >= maxTokens) {
            hideForm();
            showMessage(text.localize('The maximum number of tokens ([_1]) has been reached.').replace('[_1]', maxTokens), false);
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
            style: function($row, datum) {
                if (datum.display_name === newToken) {
                    $row.addClass('new');
                }
                $row.attr('id', datum.token);
                createDeleteButton($row, datum);
            }
        });
        showLocalTimeOnHover('td.last-used');
    }

    function createDeleteButton($row, datum) {
        var message = text.localize('Are you sure that you want to permanently delete token');
        var $button = $('<button/>', {class: 'button btnDelete', text: text.localize('Delete')});
        $button.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!window.confirm(message + ': "' + datum.display_name + '"?')) {
                return;
            }
            deleteToken(datum.token);
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

    // ---------------------------
    // ----- Form Validation -----
    // ---------------------------
    function getFormParams() {
        clearMessages();
        var nameID  = '#txtName';
        var name = $(nameID).val().trim();

        function err(a, b) {
            return Content.errorMessage(a, b);
        }

        var letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace;

        var error = (
            (!name               && err('req')) ||
            (!checkBounds(name)  && err('range', template('([_1]-[_2])', [2, 32]))) ||
            (!/^\w+$/.test(name) && err('reg', [letters, numbers, '_'])) ||
            null
        );

        if (error) {
            showError(nameID, error);
            return null;
        }

        var scopes = $('input:checkbox[name="scopes[]"]:checked')
            .map(function() { return this.value; })
            .get();
        if (scopes.length === 0) {
            showError('#scopes', 'Please select at least one scope.');
            return null;
        }

        return {name: name, scopes: scopes};
    }

    function checkBounds(string) {
        return (string.length >= 2) && (string.length <= 32);
    }

    // ---------------------------
    // ----- Actions Process -----
    // ---------------------------
    function createToken(params) {
        BinarySocket.send({
            api_token: 1,
            new_token: params.name,
            new_token_scopes: params.scopes,
        });
    }

    function deleteToken(token) {
        BinarySocket.send({
            api_token:    1,
            delete_token: token,
        });
    }

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    function showMessage(msg, isSuccess) {
        msg = text.localize(msg);
        $('#token_message').removeClass(hideClass)
            .find('p')
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + msg + '</li></ul>' : msg);
    }

    function showFormMessage(msg, isSuccess) {
        msg = text.localize(msg);
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + msg + '</li></ul>' : msg)
            .css('display', 'block')
            .delay(3000)
            .fadeOut(1000);
    }

    function showError(fieldID, err) {
        $(fieldID).parent()
            .append($('<p/>', {class: errorClass, text: text.localize(err)}));
    }

    function clearMessages() {
        $('#frmNewToken .' + errorClass).remove();
        $('#token_message').addClass(hideClass);
        $('#formMessage').html('');
    }


    return {
        init: init,
        responseHandler: responseHandler
    };
}());



pjax_config_page_require_auth("api_tokenws", function() {
    return {
        onLoad: function() {
            if (japanese_client()) {
                window.location.href = page.url.url_for('user/settingsws');
            }

            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response.msg_type === "api_token") {
                        APITokenWS.responseHandler(response);
                    }
                }
            });

            Content.populate();
            APITokenWS.init();
        }
    };
});
