/*
 * This contains common functions we need for processing the response
 */

/*
 * function to create list elements `<li>` and append to element with id `id`
 */
function displayListElements(id, elements, selected) {
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
}

/*
 * function to display contract form
 *
 * We need this separate function because the contract obect has key value pair
 * whereas markets is just an array
 */
function displayContractForms(id, elements, selected) {
    'use strict';
    var target = document.getElementById(id),
        fragment = document.createDocumentFragment(),
        len = elements.length;

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (elements) {
        var keys = Object.keys(elements).sort(compareContractCategory);
        keys.forEach(function (key) {
            if (elements.hasOwnProperty(key)) {
                var li = document.createElement('li'),
                    content = document.createTextNode(elements[key]);
                li.setAttribute('id', key.toLowerCase());
                if (selected && selected === key) {
                    li.setAttribute('class', 'active');
                }
                li.appendChild(content);
                fragment.appendChild(li);
            }
        });

        if (target) {
            target.appendChild(fragment);
        }
    }
}


/*
 * function to create `option` and append to select box with id `id`
 */
function displayOptions(id, elements, selected) {
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
}

/*
 * function to display underlyings
 *
 * we need different function for this because we need to add submarket
 * name as classname to underlyings option
 */
function displayUnderlyings(selected) {
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
}

/*
 * This maps the form name and barrierCategory we display on
 * trading form to the actual we send it to backend
 * for e.g risefall is mapped to callput with barrierCategory euro_atm
 */
function getFormNameBarrierCategory(displayFormName) {
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
}

/*
 * This maps the contract type to where we display on trading form
 * and as there is no mapping on server side so need to create it
 * on front end
 *
 * for example we display CALL on top and PUT to bottom
 */
function contractTypeDisplayMapping(type) {
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
}


/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
function isVisible(elem) {
    'use strict';
    if (elem.offsetWidth === 0 && elem.offsetHeight === 0) {
        return false;
    } else {
        return true;
    }
}

/*
 * function to hide and display the loading icon for price container
 */
function hidePriceLoadingIcon() {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'none';
    }
}

function showPriceLoadingIcon() {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'block';
    }
}

/*
 * function to hide contract confirmation overlay container
 */
function hideOverlayContainer() {
    'use strict';
    var elm = document.getElementById('contract_confirmation_container');
    if (elm) {
        elm.style.display = 'none';
    }
}

/*
 * function to assign sorting to market list
 */
function compareMarkets(a, b) {
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
}

/*
 * function to assign sorting to contract category
 */
function compareContractCategory(a, b) {
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
}

/*
 * function to get cookie javascript way (use if you don't want to use jquery)
 */
function getCookieItem(sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

/*
 * Display price/spot movement variation to depict price moved up or down
 */
function displayPriceMovement(element, oldValue, currentValue) {
    element.classList.remove('price_moved_down');
    element.classList.remove('price_moved_up');
    if (parseFloat(currentValue) > parseFloat(oldValue)) {
        element.classList.remove('price_moved_down');
        element.classList.add('price_moved_up');
    } else if (parseFloat(currentValue) < parseFloat(oldValue)) {
        element.classList.remove('price_moved_up');
        element.classList.add('price_moved_down');
    }
}

/*
 * function to toggle active class of menu
 */
function toggleActiveNavMenuElement(nav, eventElement) {
    var liElements = nav.getElementsByTagName("li");
    var classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (var i = 0, len = liElements.length; i < len; i++){
            liElements[i].classList.remove('active');
        }
        classes.add('active');
    }
}

/*
 * function to set placeholder text based on current market, used for mobile menu
 */
function setMarketPlaceholderContent(name) {
    var marketPlaceholder = document.getElementById('market_nav_placeholder');
    if (marketPlaceholder) {
        marketPlaceholder.textContent = name || sessionStorage.getItem('market');
    }
}

/*
 * function to set placeholder text based on current form, used for mobile menu
 */
function setFormPlaceholderContent(name) {
    var formPlaceholder = document.getElementById('contract_form_nav_placeholder');
    if (formPlaceholder) {
        formPlaceholder.textContent = name || sessionStorage.getItem('formname');
    }
}

/*
 * function to display the profit and return of bet under each trade container
 */
function displayCommentPrice(id, currency, type, payout) {
    'use strict';

    var div = document.getElementById(id);

    while (div && div.firstChild) {
        div.removeChild(div.firstChild);
    }

    if (div && type && payout) {
        var profit = payout - type,
            return_percent = (profit/type)*100,
            comment = document.createTextNode(Content.localize().textNetProfit + ': ' + currency + ' ' + profit.toFixed(2) + ' | ' + Content.localize().textReturn + ' ' + return_percent.toFixed(0) + '%');

        if (isNaN(profit) || isNaN(return_percent)) {
            div.style.display = 'none';
        } else {
            div.style.display = 'block';
            div.appendChild(comment);
        }
    }
}

/*
 * function to filter out allowed markets from all markets
 */
function getAllowedMarkets(marketArray) {
    'use strict';
    if (marketArray && getCookieItem('loginid')) {
        var allowedMarkets = getCookieItem('allowed_markets');
        if (allowedMarkets) {
            return marketArray.filter(function (element) {
                var re = new RegExp(element, 'i');
                return re.test(allowedMarkets);
            });
        }
    }
    return marketArray;
}

/*
 * This function loops through the available contracts and markets
 * that are not supposed to be shown are replaced
 *
 * this is TEMPORARY, it will be removed when we fix backend
 */
function getAllowedContractCategory(contracts) {
    'use strict';
    var obj = {};
    for(var key in contracts) {
        if (contracts.hasOwnProperty(key)) {
            if (!(/digits/i.test(contracts[key])) && !(/spreads/i.test(contracts[key]))) {
                obj[key] = contracts[key];
            }
        }
    }
    return obj;
}

/*
 * This function is used in case where we have input and we don't want to fire
 * event on every change while user is typing for example in case of amount if
 * we want to change 10 to 1000 i.e. two zeros so two input events will be fired
 * normally, this function delay the event based on delay specified in milliseconds
 *
 * Reference
 * http://davidwalsh.name/javascript-debounce-function
 */
function debounce(func, wait, immediate) {
    var timeout;
    var delay = wait || 500;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
        if (callNow) func.apply(context, args);
    };
}

/*
 * function to check if selected market is allowed for current user
 */
function getDefaultMarket() {
   var mkt = sessionStorage.getItem('market') || 'forex';
   if (getCookieItem('loginid')) {
       var allowedMarkets = getCookieItem('allowed_markets');
       var re = new RegExp(mkt, 'i');
       if (!re.test(allowedMarkets)) {
           var arr = allowedMarkets.replace(/\"/g, "");
           arr = arr.split(",");
           arr.sort(compareMarkets);
           return arr[0];
       }
   }
   return mkt;
}

/*
 * this is invoked when submit button is clicked and prevents reloading of page
 */
function addEventListenerForm(){
    document.getElementById('websocket_form').addEventListener("submit", function(evt){
        evt.preventDefault();
        return false;
    }, false);
}

/*
 * this creates a button, clicks it, and destroys it to invoke the listener
 */
function submitForm(form) {
    var button = form.ownerDocument.createElement('input');
    button.style.display = 'none';
    button.type = 'submit';
    form.appendChild(button).click();
    form.removeChild(button);
}
