const Cookies = require('../../lib/js-cookie');

const emailRot13 = str => (
    str.replace(/[a-zA-Z]/g, (c) => {
        const c2 = c.charCodeAt(0) + 13;
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= c2 ? c2 : c2 - 26);
    })
);

// hide and show hedging value if trading purpose is set to hedging
const detectHedging = ($purpose, $hedging) => {
    $purpose.change(() => {
        if ($purpose.val() === 'Hedging') {
            $hedging.removeClass('invisible');
        } else {
            $hedging.addClass('invisible');
        }
    });
};

const jqueryuiTabsToDropdown = ($container) => {
    const $ddl = $('<select/>');
    $container.find('li a').each(function() {
        $ddl.append($('<option/>', { text: $(this).text(), value: $(this).attr('href') }));
    });
    $ddl.change(function() {
        $container.find('li a[href="' + $(this).val() + '"]').click();
    });
    return $ddl;
};

// generate elements and append them
// element is select and element to append is option
const appendTextValueChild = (element, text, value, disabled, el_class) => {
    if (element && !element.nodeName) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        } else {
            element = undefined;
        }
    }
    if (!element) return;
    element.appendChild(makeOption(text, value, disabled, el_class));
};

const makeOption = (text, value, disabled, el_class) => {
    const option = document.createElement('option');
    option.text = text;
    // setting null value helps with detecting required error
    // on 'Please select' options
    // that have no value of their own
    option.value = value || '';
    if (disabled && disabled.toLowerCase() === 'disabled') {
        option.setAttribute('disabled', 'disabled');
    }
    if (el_class) {
        option.className = el_class;
    }
    return option;
};

/*
 * check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
const isVisible = elem => !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));

/*
 * check if browser supports the type date/time
 * send a wrong val in case browser 'pretends' to support
 */
const checkInput = (type, wrongVal) => {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('value', wrongVal);
    return (input.value !== wrongVal);
};

/*
 * check if new date is selected using native picker
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
    emailRot13            : emailRot13,
    detectHedging         : detectHedging,
    jqueryuiTabsToDropdown: jqueryuiTabsToDropdown,
    appendTextValueChild  : appendTextValueChild,
    makeOption            : makeOption,
    isVisible             : isVisible,
    checkInput            : checkInput,
    dateValueChanged      : dateValueChanged,
    selectorExists        : selectorExists,
    elementTextContent    : (element, text) => getSetElementValue(element, text, 'textContent'),
    elementInnerHtml      : (element, text) => getSetElementValue(element, text, 'innerHTML'),
};
