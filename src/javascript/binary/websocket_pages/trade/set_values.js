import Contract_Beta from './beta/contract';
import Contract from './contract';
import Defaults from './defaults';

/*
 * set placeholder text based on current form, used for mobile menu
 */
const setFormPlaceholderContent = (name) => {
    'use strict';

    const form_placeholder = document.getElementById('contract_form_nav_placeholder');
    if (form_placeholder) {
        name = name || Defaults.get('formname');
        form_placeholder.textContent = Contract.contractForms()[name];
    }
};

/*
 * set placeholder text based on current form, used for mobile menu
 */
const setFormPlaceholderContent_Beta = (name) => {
    'use strict';

    const form_placeholder = document.getElementById('contract_form_nav_placeholder');
    if (form_placeholder) {
        name = name || Defaults.get('formname');
        form_placeholder.textContent = Contract_Beta.contractForms()[name];
    }
};

module.exports = {
    setFormPlaceholderContent     : setFormPlaceholderContent,
    setFormPlaceholderContent_Beta: setFormPlaceholderContent_Beta,
};
