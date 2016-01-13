var ClientForm = function(init_params) {
    this.valid_loginids = new RegExp(init_params['valid_loginids']);
};

ClientForm.prototype = {
    validate_post_code: function() {
        var residence = $( 'select[name=residence]').val();
        var postcode = $( 'input[name=AddressPostcode]').val();
        if (residence == 'gb' && !postcode.length) {
            return false;
        }
        return true;
    },
    validate_DOB: function() {
        var dd = $( 'select#dobdd').val();
        var mm = $( 'select#dobmm').val();
        mm = parseInt(mm) - 1;
        var yy = $( 'select#dobyy').val();

        var dob = new Date(yy, mm, dd);
        if (dob.getDate() != dd || dob.getMonth() != mm || dob.getFullYear() != yy) {
            return false;
        } else {
            return true;
        }
    },
    compare_new_password: function(new_password1, new_password2) {
        if (new_password1.length > 0 && new_password2.length > 0)
            {
                if (new_password1 != new_password2) {
                    return false;
                }
            }
            return true;
    },
    is_allowed_opening_account_country: function(selected_country) {
        var error_residence = clearInputErrorField('errorresidence');
        var c_config = page.settings.get('countries_list')[selected_country];
        if (c_config['gaming_company'] == 'none' && c_config['financial_company'] == 'none') {
            error_residence.innerHTML = text.localize('We are not accepting accounts from residents of this country at the present time.');
            return false;
        }

        error_residence.innerHTML = '';
        return true;
    },
    tnc_accepted: function (bValid) {
            var input_tnc = document.getElementById('tnc');
            var error_tnc = clearInputErrorField('errortnc');
            if (input_tnc && error_tnc) {
                    if (input_tnc.checked === false)
                    {
                            error_tnc.innerHTML = text.localize('You must accept the terms and conditions to open an account.');
                            return false;
                    }
            }
            return true;
    },
    check_ip: function(IPSecurity)
    {
            var regexp_IPSecurity = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
            var ipArray = IPSecurity.match(regexp_IPSecurity);
            if (ipArray) {
                    for (i = 0; i < ipArray.length; i++) {
                            if (ipArray[i] > 255) {
                                    return false;
                            }
                    }
            }
            return true;
    },
    fixLoginID: function() {
        var loginid = $('#LoginForm_loginID');
        var loginid_value = loginid.val();

        loginid_value = loginid_value.toUpperCase();
        loginid_value = loginid_value.replace(/\\s/g,'');

        loginid.val(loginid_value);
    },
    is_loginid_valid: function(login_id) {
        if (login_id.length > 0) {
            login_id = login_id.toUpperCase();
            return this.valid_loginids.test(login_id);
        }

        return true;
    },
    set_idd_for_residence: function(residence) {
        var tel = $('#Tel');
        if (!tel.val() || tel.val().length < 6) {
            var idd_code = idd_codes[residence];
            tel.val(idd_code ? '+' + idd_code : '');
        }
    },
    on_residence_change: function() {
        var that = this;
        $('#residence').on('change', function() {
            that.set_idd_for_residence($(this).val());
            var address_state = $('#AddressState');
            var current_state = address_state.length > 0 ? address_state.val() : '';

            var postcodeLabel = $('label[for=AddressPostcode]');
            if ($(this).val() == 'gb') {
                postcodeLabel.prepend('<em class="required_asterisk">* </em>');
            } else {
                postcodeLabel.find('em').remove();
            }

            if(that.is_allowed_opening_account_country($(this).val())) {
                $.ajax({
                    crossDomain:true,
                    url: page.url.url_for('states_list'),
                    data: {"c":$('#residence').get(0).value,"l": page.language()},
                    async: true,
                    dataType: "html"
                }).done(function(response) {
                    $('#AddressState').html(response);
                    that.hide_state_list_if_empty(current_state);
                });
            } else {
                $("#AddressState").parents(".row").first().hide(); //Hide States list.
            }
        });
    },
    hide_state_list_if_empty: function(current_state) {
        var addr_state = $("#AddressState");
        if (addr_state.children().size() > 2) {
            addr_state.parents(".row").first().show();
            addr_state.val(current_state);
        } else {
            addr_state.parents(".row").first().hide();
        }
    },
    set_virtual_email_id: function(email) {
        $('#Email').val(email);
        $('#Email').disableSelection();
    }
};
