var APITokenWS = (function() {
    "use strict";

    var columns,
        errorClass,
        hideClass,
        isValid,
        tableContainer,
        maxTokens;


    var init = function() {
        columns = ['Name', 'Token', 'Scopes', 'Last Used', 'Action'];
        errorClass  = 'errorfield';
        hideClass   = 'dynamic';
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

    var responseHandler = function(response) {
        if('error' in response) {
            showMessage(response.error.message, false);
            return false;
        }

        clearMessages();

        var rebuildTable = true;
        var api_token = response.api_token;
        var newToken  = '';

        if('new_token' in api_token) {
            if(api_token.new_token === 1) {
                showFormMessage(text.localize('New token created.'), true);
                $('#txtName').val('');
                newToken = response.echo_req.new_token;
            }
        }
        else if('delete_token' in api_token) {
            rebuildTable = false;
            var deletedToken = response.echo_req.delete_token;
            if(api_token.delete_token !== 1) {
                showError(deletedToken, text.localize('An error occured.'));
            }
            else {
                $('#' + deletedToken).parents('tr').removeClass('new').addClass('deleting').fadeOut(700, function(){
                    $(this).remove();
                    // Hide the table if there is no Token remained
                    if(api_token.tokens.length === 0) {
                        $(tableContainer).addClass(hideClass);
                    }
                });
            }
        }

        if(rebuildTable) {
            populateTokensList(api_token, newToken);
            showLocalTimeOnHover('td.last-used');
        }

        // Hide form if tokens count reached the maximum limit
        if(api_token.tokens.length >= maxTokens) {
            $('#token_form').addClass(hideClass);
            showMessage(text.localize('The maximum number of tokens ([_1]) has been reached.').replace('[_1]', maxTokens), false);
        }
        else {
            $('#token_form').removeClass(hideClass);
        }
    };

    // -----------------------
    // ----- Tokens List -----
    // -----------------------
    var populateTokensList = function(api_token, newTokenName) {
        var $tableContainer = $(tableContainer);
        if(api_token.tokens.length === 0) {
            $tableContainer.addClass(hideClass);
            return;
        }

        $tableContainer.removeClass(hideClass);
        showLoadingImage($(tableContainer));

        var tokens = api_token.tokens;
        var $tokensTable = createEmptyTable('tokens_table');

        for(var i = 0; i < tokens.length; i++) {
            var $tableRow = createTableRow(tokens[i]);
            if(newTokenName && tokens[i].display_name === newTokenName) {
                $tableRow.addClass('new');
            }
            $tokensTable.find('tbody').append($tableRow);
        }

        $tableContainer.empty().append($tokensTable);

        $('.btnDelete').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(window.confirm(
                text.localize('Are you sure that you want to permanently delete token') +
                ': "' + $(this).parents('tr').find('td.name').text() + '"?')) {
                    deleteToken($(this).attr('id'));
            }
        });
    };

    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    var createTableRow = function(token) {
        var lastUsed = (token.last_used ? token.last_used + ' GMT': text.localize('Never Used'));
        var scopes = token.scopes.map(function (v) {
            return v.capitalizeFirstLetter();
        });
        // sort with Read, Trade, Payments, Admin
        var scopes_i = {'Read': 0, 'Trade': 1, 'Payments': 2, 'Admin': 3};
        scopes.sort(function(a, b) {
            return scopes_i[a] > scopes_i[b];
        });
        var $tableRow = Table.createFlexTableRow(
            [
                token.display_name,
                token.token,
                scopes.join(', '),
                lastUsed,
                ''  // btnDelete
            ],
            columns,
            "data"
        );

        $tableRow.children('.action').html(
            $('<span/>', {class: 'button'})
                .append($('<button/>', {class: 'button btnDelete', text: text.localize('Delete'), id: token.token})
            )
        );

        return $tableRow;
    };

    var createEmptyTable = function(tableID) {
        var header = [];
        columns.map(function(col) {
            header.push(text.localize(col));
        });

        var metadata = {
            id: tableID,
            cols: columns
        };

        return Table.createFlexTable([], metadata, header);
    };

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
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "api_token") {
                            APITokenWS.responseHandler(response);
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            APITokenWS.init();
        }
    };
});
