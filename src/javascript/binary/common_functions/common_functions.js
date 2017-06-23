const Cookies = require('../../lib/js-cookie');

// show hedging value if trading purpose is set to hedging else hide it
const detectHedging = ($purpose, $hedging) => {
    $purpose.change(() => {
        $hedging.setVisibility($purpose.val() === 'Hedging');
    });
};

const jqueryuiTabsToDropdown = ($container) => {
    const $ddl = $('<select/>');
    $container.find('li a').each(function() {
        $ddl.append($('<option/>', { text: $(this).text(), value: $(this).attr('href') }));
    });
    $ddl.change(function() {
        $container.find(`li a[href="${$(this).val()}"]`).click();
    });
    return $ddl;
};

const makeOption = (options) => {
    const option_el = document.createElement('option');
    option_el.text = options.text;
    // setting null value helps with detecting required error
    // on 'Please select' options
    // that have no value of their own
    option_el.value = options.value || '';
    if (options.is_disabled && options.is_disabled.toLowerCase() === 'disabled') {
        option_el.setAttribute('disabled', 'disabled');
    }
    if (options.class) {
        option_el.className = options.class;
    }
    if (options.is_selected) {
        option_el.setAttribute('selected', 'selected');
    }
    return option_el;
};

/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
const isVisible = elem => !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));

/*
 * function to check if browser supports the type date/time
 * send a wrong val in case browser 'pretends' to support
 */
const checkInput = (type, wrong_val) => {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('value', wrong_val);
    return (input.value !== wrong_val);
};

/*
 * function to check if new date is selected using native picker
 * if yes, update the data-value. if no, return false.
 */
const dateValueChanged = (element, type) => {
    if (element.getAttribute('data-value') === element.value) {
        return false;
    }
    if (element.getAttribute('type') === type) {
        element.setAttribute('data-value', element.value);
    }
    return true;
};

const selectorExists = element => (typeof (element) !== 'undefined' && element !== null);

const getSetElementValue = (element, text, type) => { // eslint-disable-line consistent-return
    if (selectorExists(element)) {
        if (typeof text === 'undefined') return element[type];
        // else
        element[type] = text;
    }
};

module.exports = {
    getLoginToken         : () => Cookies.get('login'),
    detectHedging         : detectHedging,
    jqueryuiTabsToDropdown: jqueryuiTabsToDropdown,
    makeOption            : makeOption,
    isVisible             : isVisible,
    checkInput            : checkInput,
    dateValueChanged      : dateValueChanged,
    selectorExists        : selectorExists,
    elementTextContent    : (element, text) => getSetElementValue(element, text, 'textContent'),
    elementInnerHtml      : (element, text) => getSetElementValue(element, text, 'innerHTML'),
};
