var Contract      = require('./contract').Contract;
var Defaults      = require('./defaults').Contract;
var Contract_Beta = require('./beta/contract').Contract_Beta;

/*
 * function to set placeholder text based on current form, used for mobile menu
 */
function setFormPlaceholderContent(name) {
    'use strict';

    var formPlaceholder = document.getElementById('contract_form_nav_placeholder');
    if (formPlaceholder) {
        name = name || Defaults.get('formname');
        formPlaceholder.textContent = Contract.contractForms()[name];
    }
}

/*
 * function to set placeholder text based on current form, used for mobile menu
 */
function setFormPlaceholderContent_Beta(name) {
    'use strict';

    var formPlaceholder = document.getElementById('contract_form_nav_placeholder');
    if (formPlaceholder) {
        name = name || Defaults.get('formname');
        formPlaceholder.textContent = Contract_Beta.contractForms()[name];
    }
}

module.exports = {
    setFormPlaceholderContent     : setFormPlaceholderContent,
    setFormPlaceholderContent_Beta: setFormPlaceholderContent_Beta,
};
