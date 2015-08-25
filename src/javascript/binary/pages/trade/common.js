/*
 * This contains common functions we need for processing the respinse
 */

/*
 * function to create list elements `<li>` and append to element with id `id`
 */
var displayListElements = function (id, elements, selected) {
    'use strict';
    var target = document.getElementById(id),
        fragment = document.createDocumentFragment(),
        len = elements.length;

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    elements.forEach(function (element) {
        var li = document.createElement('li'),
            content = document.createTextNode(element);
        li.setAttribute('id', element.toLowerCase());
        if (selected && selected === element.toLowerCase()) {
            li.setAttribute('class', 'active');
        }
        li.appendChild(content);
        fragment.appendChild(li);
    });
    if (target) {
        target.appendChild(fragment);
    }
};

/*
 * function to create `option` and append to select box with id `id`
 */
var displayOptions = function (id, elements, selected) {
    'use strict';
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in elements) {
        if (elements.hasOwnProperty(key)){
            var option = document.createElement('option'), content = document.createTextNode(elements[key]);
            option.setAttribute('value', key);
            if (selected && selected === key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
    }
    if (target) {
        target.appendChild(fragment);
    }
};

/*
 * function to display underlyings
 *
 * we need different function for this because we need to add submarket
 * name as classname to underlyings option
 */
var displayUnderlyings = function (selected) {
    'use strict';
    var target= document.getElementById('underlying'),
        fragment =  document.createDocumentFragment(),
        elements = Offerings.underlyings();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in elements) {
        if (elements.hasOwnProperty(key)){
            var option = document.createElement('option'), content = document.createTextNode(elements[key].display);
            option.setAttribute('value', key);
            option.setAttribute('class', elements[key].classname);
            if (selected && selected === key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
    }
    if (target) {
        target.appendChild(fragment);
    }
};

/*
 * This maps the form name and barrierCategory we display on
 * trading form to the actual we send it to backend
 * for e.g risefall is mapped to callput with barrierCategory euro_atm
 */
var getFormNameBarrierCategory = function (displayFormName) {
    'use strict';
    var obj = {};
    if (displayFormName) {
        if(displayFormName === 'risefall') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_atm';
        } else if (displayFormName === 'higherlower') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_non_atm';
        } else if (displayFormName === 'callput'){
            obj['formName'] = displayFormName;
            obj['barrierCategory'] = 'euro_atm';
        } else {
            obj['formName'] = displayFormName;
            obj['barrierCategory'] = '';
        }
    } else {
        obj['formName'] = 'callput';
        obj['barrierCategory'] = 'euro_atm';
    }
    return obj;
};

/*
 * This maps the contract type to where we display on trading form
 * and as there is no mapping on server side so need to create it
 * on front end
 *
 * for example we display CALL on top and PUT to bottom
 */
var contractTypeDisplayMapping = function (type) {
    'use strict';
    var obj = {
        CALL: "top",
        PUT: "bottom",
        ASIANU: "top",
        ASIAND: "bottom",
        DIGITMATCH: "top",
        DIGITDIFF: "bottom",
        EXPIRYRANGE: "top",
        EXPIRYMISS: "bottom",
        RANGE: "top",
        UPORDOWN: "bottom",
        ONETOUCH: "top",
        NOTOUCH: "bottom",
        SPREADU: "top",
        SPREADD: "bottom"
    };

    return type ? obj[type] : 'top';
};


/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
var isVisible = function (elem) {
    'use strict';
    if (elem.offsetWidth === 0 && elem.offsetHeight === 0) {
        return false;
    } else {
        return true;
    }
};

/*
 * function to hide and display the loading icon for price container
 */
var hidePriceLoadingIcon = function () {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'none';
    }
};

var showPriceLoadingIcon = function () {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'block';
    }
};

/*
 * function to hide contract confirmation overlay container
 */
var hideOverlayContainer = function () {
    'use strict';
    var elm = document.getElementById('contract_confirmation_container');
    if (elm) {
        elm.style.display = 'none';
    }
};

/*
 * function to assign sorting to market list
 */
var compareMarkets = function (a, b) {
    var sortedMarkets = {
        'forex': 0,
        'indices': 1,
        'stocks': 2,
        'commodities': 3,
        'random': 4
    };

    if (sortedMarkets[a.toLowerCase()] < sortedMarkets[b.toLowerCase()]) {
        return -1;
    }
    if (sortedMarkets[a.toLowerCase()] > sortedMarkets[b.toLowerCase()]) {
        return 1;
    }
    return 0;
};

/*
 * function to assign sorting to contract category
 */
var compareContractCategory = function (a, b) {
    var sortedContractCategory = {
        'risefall': 0,
        'higherlower': 1,
        'touchnotouch': 2,
        'endsinout': 3,
        'staysinout': 4,
        'asian': 5,
        'digits': 6,
        'spreads': 7
    };

    if (sortedContractCategory[a.toLowerCase()] < sortedContractCategory[b.toLowerCase()]) {
        return -1;
    }
    if (sortedContractCategory[a.toLowerCase()] > sortedContractCategory[b.toLowerCase()]) {
        return 1;
    }
    return 0;
};

/*
 * function to get cookie javascript way (use if you don't want to use jquery)
 */
var getCookieItem = function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
};

/*
 * Display price/spot movement variation to depict price moved up or down
 */
var displayPriceMovement = function (element, oldValue, currentValue) {
    element.classList.remove('price_moved_down');
    element.classList.remove('price_moved_up');
    if (parseFloat(currentValue) > parseFloat(oldValue)) {
        element.classList.remove('price_moved_down');
        element.classList.add('price_moved_up');
    } else if (parseFloat(currentValue) < parseFloat(oldValue)) {
        element.classList.remove('price_moved_up');
        element.classList.add('price_moved_down');
    }
};

/*
 * function to toggle active class of menu
 */
var toggleMobileNavMenu = function (nav, eventElement) {
    var liElements = nav.getElementsByTagName("li");
    var classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (var i = 0, len = liElements.length; i < len; i++){
            liElements[i].classList.remove('active');
        }
        classes.add('active');
    }
};

/*
 * function to set placeholder text based on current market, used for mobile menu
 */
var setMarketPlaceholderContent = function (name) {
    var marketPlaceholder = document.getElementById('market_nav_placeholder');
    if (marketPlaceholder) {
        marketPlaceholder.textContent = name || sessionStorage.getItem('market');
    }
};

/*
 * function to set placeholder text based on current form, used for mobile menu
 */
var setFormPlaceholderContent = function (name) {
    var formPlaceholder = document.getElementById('contract_form_nav_placeholder');
    if (formPlaceholder) {
        formPlaceholder.textContent = name || sessionStorage.getItem('formname');
    }
};
