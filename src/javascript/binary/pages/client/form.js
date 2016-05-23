var ClientForm = function(init_params) {
    this.valid_loginids =  new RegExp("^(" + init_params['valid_loginids'] + ")[0-9]+$", "i");
};

ClientForm.prototype = {
    is_loginid_valid: function(login_id) {
        if (login_id.length > 0) {
            login_id = login_id.toUpperCase();
            return this.valid_loginids.test(login_id);
        }

        return true;
    }
};
