const Cookies = require('../../lib/js-cookie');

const email_rot13 = function(str) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        const c2 = c.charCodeAt(0) + 13;
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= c2 ? c2 : c2 - 26);
    });
};

// returns true if internet explorer browser
const isIE = function() {
    return /(msie|trident|edge)/i.test(window.navigator.userAgent) && !window.opera;
};

// hide and show hedging value if trading purpose is set to hedging
const detect_hedging = function($purpose, $hedging) {
    $purpose.change(function() {
        if ($purpose.val() === 'Hedging') {
            $hedging.removeClass('invisible');
        } else if ($hedging.is(':visible')) {
            $hedging.addClass('invisible');
        }
    });
};

const jqueryuiTabsToDropdown = function($container) {
    const $ddl = $('<select/>');
    $container.find('li a').each(function() {
        $ddl.append($('<option/>', { text: $(this).text(), value: $(this).attr('href') }));
    });
    $ddl.change(function() {
        $container.find('li a[href="' + $(this).val() + '"]').click();
    });
    return $ddl;
};

// use function to generate elements and append them
// element is select and element to append is option
const appendTextValueChild = function(element, text, value, disabled, el_class) {
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

const isValidDate = function(day, month, year) {
    // Assume not leap year by default (note zero index for Jan)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // If evenly divisible by 4 and not evenly divisible by 100,
    // or is evenly divisible by 400, then a leap year
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
        daysInMonth[1] = 29;
    }
    return day <= daysInMonth[--month];
};

/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
const isVisible = function(elem) {
    'use strict';

    return !(!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0));
};


/*
 * function to check if browser supports the type date/time
 * send a wrong val in case browser 'pretends' to support
 */
function checkInput(type, wrongVal) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('value', wrongVal);
    return (input.value !== wrongVal);
}

/*
 * function to check if new date is selected using native picker
 * if yes, update the data-value. if no, return false.
 */
function dateValueChanged(element, type) {
    if (element.getAttribute('data-value') === element.value) {
        return false;
    }
    if (element.getAttribute('type') === type) {
        element.setAttribute('data-value', element.value);
    }
    return true;
}

function selectorExists(element) {
    return (typeof (element) !== 'undefined' && element !== null);
}

function get_set_element_value(element, text, type) { // eslint-disable-line consistent-return
    if (selectorExists(element)) {
        if (typeof text === 'undefined') return element[type];
        // else
        element[type] = text;
    }
}

function elementTextContent(element, text) {
    return get_set_element_value(element, text, 'textContent');
}

function elementInnerHtml(element, text) {
    return get_set_element_value(element, text, 'innerHTML');
}

module.exports = {
    getLoginToken         : function() { return Cookies.get('login'); },
    email_rot13           : email_rot13,
    isIE                  : isIE,
    detect_hedging        : detect_hedging,
    jqueryuiTabsToDropdown: jqueryuiTabsToDropdown,
    appendTextValueChild  : appendTextValueChild,
    makeOption            : makeOption,
    isValidDate           : isValidDate,
    isVisible             : isVisible,
    checkInput            : checkInput,
    dateValueChanged      : dateValueChanged,
    selectorExists        : selectorExists,
    elementTextContent    : elementTextContent,
    elementInnerHtml      : elementInnerHtml,
};
