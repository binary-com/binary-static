var APITokenWS = (function() {
    "use strict";

    var errorClass,
        hideClass,
        isValid,
        tableContainer,
        maxTokens;

    var flexTable;

    function hide(s) { return function() { $(s).addClass(hideClass); }; }
    function show(s) { return function() { $(s).removeClass(hideClass); }; }

    var hideForm  = hide('#token_form');
    var showForm  = show('#token_form');
    var hideTable = hide(tableContainer);

    var init = function() {
        errorClass  = 'errorfield';
        hideClass   = 'invisible';
        tableContainer = '#tokens_list';
        maxTokens = 30;

        showLoadingImage($(tableContainer));

        BinarySocket.send({"api_token": "1"});

        $('#btnCreate').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            createToken();
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

        console.log(newToken);
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

        flexTable = new FlexTableUI({
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
    var formValidate = function() {
        clearMessages();
        isValid = true;

        var nameID  = '#txtName';
        var newName = $(nameID).val().trim();

        var letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace;

        // Token Name
        if(!isRequiredError(nameID) && !isCountError(nameID, 2, 32)){
            if(!(/^\w+$/).test(newName)) {
                showError(nameID, Content.errorMessage('reg', [letters, numbers, '_']));
            }
        }

        var scopes = $('input:checkbox[name="scopes[]"]:checked').map(function () {
            return this.value;
        }).get();
        if (scopes.length === 0) {
            showError('#scopes', text.localize('Please select at least one scope.'));
        }

        return isValid ? newName : false;
    };

    var isRequiredError = function(fieldID) {
        if(!$(fieldID).val() || !(/.+/).test($(fieldID).val().trim())){
            showError(fieldID, Content.errorMessage('req'));
            return true;
        } else {
            return false;
        }
    };

    var isCountError = function(fieldID, min, max) {
        var fieldValue = $(fieldID).val().trim();
        if((fieldValue.length > 0 && fieldValue.length < min) || fieldValue.length > max) {
            showError(fieldID, Content.errorMessage('range', '(' + min + '-' + max + ')'));
            return true;
        } else {
            return false;
        }
    };

    // ---------------------------
    // ----- Actions Process -----
    // ---------------------------
    var createToken = function() {
        var is_valid = formValidate();
        if(is_valid !== false) {
            var newName = $('#txtName').val().trim();
            var scopes = $('input:checkbox[name="scopes[]"]:checked').map(function () {
                return this.value;
            }).get();

            BinarySocket.send({
                "api_token" : 1,
                "new_token" : newName,
                "new_token_scopes": scopes
            });
        }
    };

    var deleteToken = function(token) {
        if(token) {
            BinarySocket.send({
                "api_token"    : 1,
                "delete_token" : token
            });
        }
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    var showMessage = function(msg, isSuccess) {
        $('#token_message > p')
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg));
        $('#token_message').removeClass(hideClass);
    };

    var showFormMessage = function(msg, isSuccess) {
        var $elmID = $('#formMessage');
        $elmID
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg))
            .css('display', 'block')
            .delay(3000)
            .fadeOut(1000);
    };

    var showError = function(fieldID, errMsg) {
        $(fieldID).parent().append($('<p/>', {class: errorClass, text: errMsg}));
        isValid = false;
    };

    var clearMessages = function(fieldID) {
        $(fieldID ? fieldID : '#frmNewToken .' + errorClass).remove();
        $('#token_message').addClass(hideClass);
        $('#formMessage').html('');
    };


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
