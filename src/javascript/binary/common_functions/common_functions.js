var Cookies = require('../../lib/js-cookie');

var email_rot13 = function(str) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        var c2 = c.charCodeAt(0) + 13;
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= c2 ? c2 : c2 - 26);
    });
};

// returns true if internet explorer browser
var isIE = function() {
    return /(msie|trident|edge)/i.test(window.navigator.userAgent) && !window.opera;
};

// hide and show hedging value if trading purpose is set to hedging
var detect_hedging = function($purpose, $hedging) {
    $purpose.change(function() {
        if ($purpose.val() === 'Hedging') {
            $hedging.removeClass('invisible');
        } else if ($hedging.is(':visible')) {
            $hedging.addClass('invisible');
        }
    });
};

var jqueryuiTabsToDropdown = function($container) {
    var $ddl = $('<select/>');
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
var appendTextValueChild = function(element, text, value, disabled, el_class) {
    var option = document.createElement('option');
    option.text = text;
    if (value) {
        option.value = value;
    }
    if (disabled === 'disabled') {
        option.setAttribute('disabled', 'disabled');
    }
    if (el_class) {
        option.className = el_class;
    }
    element.appendChild(option);
};

var isValidDate = function(day, month, year) {
    // Assume not leap year by default (note zero index for Jan)
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
var isVisible = function(elem) {
    'use strict';

    if (!elem || (elem.offsetWidth === 0 && elem.offsetHeight === 0)) {
        return false;
    }

    return true;
};

module.exports = {
    getLoginToken         : function() { return Cookies.get('login'); },
    email_rot13           : email_rot13,
    isIE                  : isIE,
    detect_hedging        : detect_hedging,
    jqueryuiTabsToDropdown: jqueryuiTabsToDropdown,
    appendTextValueChild  : appendTextValueChild,
    isValidDate           : isValidDate,
    isVisible             : isVisible,
};
