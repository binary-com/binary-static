/*
 * This contains common functions we need for processing the response
 */

 Element.prototype.hide = function(){
     this.style.display = 'none';
 };

 Element.prototype.show = function(){
     this.style.display = '';
 };

/*
 * function to display contract form as element of ul
 */
 function displayContractForms(id, elements, selected) {
     'use strict';
     if (!id || !elements || !selected) return;
     var target = document.getElementById(id),
         fragment = document.createDocumentFragment(),
         len = elements.length;

     target.innerHTML = '';

     if (elements) {
         var tree = getContractCategoryTree(elements);
         for(var i=0;i<tree.length;i++){
             var el1 = tree[i];
             var li = document.createElement('li');

             li.classList.add('tm-li');
             if(i===0){
                 li.classList.add('first');
             }
             else if(i===tree.length-1){
                 li.classList.add('last');
             }

             if(typeof el1 === 'object'){
                 var fragment2 = document.createDocumentFragment();
                 var flag = 0;
                 var first = '';
                 for(var j=0; j<el1[1].length; j++){
                     var el2 = el1[1][j];
                     var li2 = document.createElement('li'),
                         a2 = document.createElement('a'),
                         content2 = document.createTextNode(elements[el2]);
                     li2.classList.add('tm-li-2');

                     if(j===0){
                        first = el2.toLowerCase();
                        li2.classList.add('first');
                     }
                     else if(j===el1[1].length-1){
                         li2.classList.add('last');
                     }

                     var span_class = '';
                     if (selected && selected === el2.toLowerCase()) {
                         li2.classList.add('active');
                         a2.classList.add('a-active');
                         flag = 1;
                     }

                     a2.classList.add('tm-a-2');
                     a2.appendChild(content2);
                     a2.setAttribute('menuitem',el2.toLowerCase());
                     a2.setAttribute('id', el2.toLowerCase());

                     li2.appendChild(a2);

                     fragment2.appendChild(li2);
                 }
                 if(fragment2.hasChildNodes()){
                     var ul = document.createElement('ul'),
                         a = document.createElement('a'),
                         content = document.createTextNode(elements[el1[0]]);

                     a.appendChild(content);
                     a.setAttribute('class', 'tm-a');
                     a.setAttribute('menuitem',first);
                     ul.appendChild(fragment2);
                     ul.setAttribute('class', 'tm-ul-2');
                     ul.setAttribute('id', el1[0]+'-submenu');

                     if(flag){
                        li.classList.add('active');
                     }

                     li.appendChild(a);
                     li.appendChild(ul);
                 }
             }
             else{
                 var content3 = document.createTextNode(elements[el1]),
                     a3 = document.createElement('a');

                 if (selected && selected === el1.toLowerCase()) {
                     a3.classList.add('a-active');
                     li.classList.add('active');
                 }
                 a3.appendChild(content3);
                 a3.classList.add('tm-a');
                 a3.setAttribute('menuitem',el1);
                 a3.setAttribute('id', el1.toLowerCase());
                 li.appendChild(a3);
             }
             fragment.appendChild(li);
         }
         if (target) {
             target.appendChild(fragment);
             var list = target.getElementsByClassName('tm-li');
             for(var k=0; k < list.length; k++){
                 var li4 = list[k];
                 li4.addEventListener("mouseover", function(){
                     this.classList.add('hover');
                 });
                 li4.addEventListener("mouseout", function(){
                     this.classList.remove('hover');
                 });
             }
         }
     }
 }


 function displayMarkets(id, elements, selected) {
     'use strict';
     var target= document.getElementById(id),
         fragment =  document.createDocumentFragment();

     while (target && target.firstChild) {
         target.removeChild(target.firstChild);
     }

     var keys1 = Object.keys(elements).sort(marketSort);
     for (var i=0; i<keys1.length; i++) {
         var key = keys1[i];
         var option = document.createElement('option'), content = document.createTextNode(elements[key].name);
         option.setAttribute('value', key);
         if (selected && selected === key) {
             option.setAttribute('selected', 'selected');
         }
         option.appendChild(content);
         fragment.appendChild(option);

         if(elements[key].submarkets && objectNotEmpty(elements[key].submarkets)){
            var keys2 = Object.keys(elements[key].submarkets).sort(marketSort);
            for (var j=0; j<keys2.length; j++) {
                var key2 = keys2[j];
                option = document.createElement('option');
                option.setAttribute('value', key2);
                if (selected && selected === key2) {
                    option.setAttribute('selected', 'selected');
                }
                option.textContent = '\xA0\xA0\xA0\xA0'+elements[key].submarkets[key2].name;
                fragment.appendChild(option);
            }
         }
     }
     if (target) {
         target.appendChild(fragment);

         if(target.selectedIndex < 0) {
            target.selectedIndex = 0;
         }
         var current = target.options[target.selectedIndex];
         if(selected !== current.value) {
            Defaults.set('market', current.value);
         }

         if(current.disabled) { // there is no open market
            document.getElementById('markets_closed_msg').classList.remove('hidden');
            document.getElementById('trading_init_progress').style.display = 'none';
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
 * we need separate function for this as sorting is different and later
 * we may add submarket to it
 */
function displayUnderlyings(id, elements, selected) {
    'use strict';
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (elements) {
        var keys = Object.keys(elements).sort(function(a, b) {
            return elements[a]['display'].localeCompare(elements[b]['display']);
        });
        var submarkets = {};
        for(var i=0; i<keys.length; i++){
            if(!submarkets.hasOwnProperty(elements[keys[i]].submarket)){
                submarkets[elements[keys[i]].submarket] = [];
            }
            submarkets[elements[keys[i]].submarket].push(keys[i]);
        }
        var keys2 = Object.keys(submarkets).sort(marketSort);
        for(var j=0; j<keys2.length; j++){
            for(var k=0; k<submarkets[keys2[j]].length; k++){
                var key = submarkets[keys2[j]][k];
                var option = document.createElement('option'), content = document.createTextNode(text.localize(elements[key]['display']));
                option.setAttribute('value', key);
                if (selected && selected === key) {
                    option.setAttribute('selected', 'selected');
                }
                option.appendChild(content);
                fragment.appendChild(option);
            }
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
        } else if (displayFormName === 'overunder' || displayFormName === 'evenodd' || displayFormName === 'matchdiff'){
            obj['formName'] = 'digits';
            obj['barrierCategory'] = '';
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
        CALLE: "top",
        PUTE: "bottom",
        ASIANU: "top",
        ASIAND: "bottom",
        DIGITMATCH: "top",
        DIGITDIFF: "bottom",
        DIGITEVEN: "top",
        DIGITODD: "bottom",
        DIGITOVER: "top",
        DIGITUNDER: "bottom",
        EXPIRYRANGEE: "top",
        EXPIRYMISSE: "bottom",
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
    if (!elem) return;
    if (elem.offsetWidth === 0 && elem.offsetHeight === 0) {
        return false;
    } else {
        return true;
    }
}

/*
 * function to hide and display the loading icon for price container
 */
function hideLoadingOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'none';
    }
}

function showLoadingOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'block';
    }
}

function showPriceOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container2');
    if (elm) {
        elm.style.display = 'block';
    }
}

function hidePriceOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container2');
    if (elm) {
        elm.style.display = 'none';
    }

}

function hideFormOverlay(){
    'use strict';
    var elm = document.getElementById('loading_container3');
    if (elm) {
        elm.style.display = 'none';
    }
}

function showFormOverlay(){
    'use strict';
    var elm = document.getElementById('loading_container3');
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
    var elm2 = document.getElementById('contracts_list');
    if (elm2) {
        elm2.style.display = 'flex';
    }
}

/*
 * function to assign sorting to market list
 */
function compareMarkets(a, b) {
    'use strict';
    var sortedMarkets = {
        'forex': 0,
        'indices': 1,
        'stocks': 2,
        'commodities': 3,
        'volidx': 4
    };

    if (sortedMarkets[a.toLowerCase()] < sortedMarkets[b.toLowerCase()]) {
        return -1;
    }
    if (sortedMarkets[a.toLowerCase()] > sortedMarkets[b.toLowerCase()]) {
        return 1;
    }
    return 0;
}

function getContractCategoryTree(elements){
    'use strict';

    var tree = [
        ['updown',
            ['risefall',
            'higherlower']
        ],
        'touchnotouch',
        ['inout',
            ['endsinout',
            'staysinout']
        ],
        'asian',
        ['digits',
            ['matchdiff',
            'evenodd',
            'overunder']
        ],
        'spreads'
    ];

    if(elements){
        tree = tree.map(function(e){
            if(typeof e === 'object'){
                e[1] = e[1].filter(function(e1){
                    return elements[e1];
                });
                if(!e[1].length){
                    e = '';
                }
            }
            else if(!elements[e]){
                e = '';
            }
            return e;
        });
        tree = tree.filter(function(v){ return v.length; });
    }
    return tree;
}

/*
 * Display price/spot movement variation to depict price moved up or down
 */
function displayPriceMovement(element, oldValue, currentValue) {
    'use strict';
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
 * resets price movement color changing, to prevent coloring on some changes
 * coloring will continue on the next proposal responses
 */
function resetPriceMovement() {
    var btns = document.getElementsByClassName('purchase_button');
    for(var i = 0; i < btns.length; i++) {
        btns[i].setAttribute('data-display_value', '');
        btns[i].setAttribute('data-payout', '');
    }
}

/*
 * function to toggle active class of menu
 */
function toggleActiveNavMenuElement(nav, eventElement) {
    'use strict';
    var liElements = nav.getElementsByTagName("li");
    var classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (var i = 0, len = liElements.length; i < len; i++){
            liElements[i].classList.remove('active');
        }
        classes.add('active');
    }
}

function toggleActiveCatMenuElement(nav, eventElementId) {
    'use strict';
    var eventElement = document.getElementById(eventElementId);
    var liElements = nav.querySelectorAll('.active, .a-active');
    var classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (var i = 0, len = liElements.length; i < len; i++){
            liElements[i].classList.remove('active');
            liElements[i].classList.remove('a-active');
        }
        classes.add('a-active');

        i = 0;
        var parent;
        while((parent = eventElement.parentElement) && parent.id !== nav.id && i < 10){
            if(parent.tagName === 'LI'){
                parent.classList.add('active');
            }
            eventElement = parent;
            i++;
        }
    }
}

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
 * function to display the profit and return of bet under each trade container except spreads
 */
function displayCommentPrice(node, currency, type, payout) {
    'use strict';

    if (node && type && payout) {
        var profit = payout - type,
            return_percent = (profit/type)*100,
            comment = Content.localize().textNetProfit + ': ' + format_money(currency, profit.toFixed(2)) + ' | ' + Content.localize().textReturn + ' ' + return_percent.toFixed(1) + '%';

        if (isNaN(profit) || isNaN(return_percent)) {
            node.hide();
        } else {
            node.show();
            node.textContent = comment;
        }
    }
}

/*
 * function to display comment for spreads
 */
function displayCommentSpreads(node, currency, point) {
    'use strict';

    if (node && point) {
        var amountPerPoint = document.getElementById('amount_per_point').value,
            stopType = document.querySelector('input[name="stop_type"]:checked').value,
            stopLoss = document.getElementById('stop_loss').value,
            displayAmount = 0;

        if (isNaN(stopLoss) || isNaN(amountPerPoint)) {
            node.hide();
        } else {
            if (stopType === 'point') {
                displayAmount = parseFloat(parseFloat(amountPerPoint) * parseFloat(stopLoss));
            } else {
                displayAmount = parseFloat(stopLoss);
            }
            node.textContent = Content.localize().textSpreadDepositComment + " " + format_money(currency, displayAmount.toFixed(2)) + " " + Content.localize().textSpreadRequiredComment + ": " + point + " " + Content.localize().textSpreadPointsComment;
        }
    }
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
    'use strict';
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
    'use strict';
    var mkt = Defaults.get('market');
    var markets = Symbols.markets(1);
    if (!mkt || !markets[mkt]) {
        var sorted_markets = Object.keys(Symbols.markets()).filter(function(v){return markets[v].is_active;}).sort(function(a, b) {
            return getMarketsOrder(a) - getMarketsOrder(b);
        });
        mkt = sorted_markets[0];
    }
    return mkt;
}

// Order
function getMarketsOrder(market) {
    var order = {
        'forex': 1,
        'volidx': 2,
        'indices': 3,
        'stocks': 4,
        'commodities': 5
    };
    return order[market] ? order[market] : 100;
}

/*
 * this is invoked when submit button is clicked and prevents reloading of page
 */
function addEventListenerForm(){
    'use strict';
    document.getElementById('websocket_form').addEventListener("submit", function(evt){
        evt.currentTarget.classList.add('submitted');
        evt.preventDefault();
        return false;
    }, false);
}

/*
 * this creates a button, clicks it, and destroys it to invoke the listener
 */
function submitForm(form) {
    'use strict';
    var button = form.ownerDocument.createElement('input');
    button.style.display = 'none';
    button.type = 'submit';
    form.appendChild(button).click();
    form.removeChild(button);
}

/*
 * function to display indicative barrier
 */
function displayIndicativeBarrier() {
    'use strict';
    var unit = document.getElementById('duration_units'),
        currentTick = Tick.quote(),
        indicativeBarrierTooltip = document.getElementById('indicative_barrier_tooltip'),
        indicativeHighBarrierTooltip = document.getElementById('indicative_high_barrier_tooltip'),
        indicativeLowBarrierTooltip = document.getElementById('indicative_low_barrier_tooltip'),
        barrierElement = document.getElementById('barrier'),
        highBarrierElement = document.getElementById('barrier_high'),
        lowBarrierElement = document.getElementById('barrier_low');

    if (unit && (!isVisible(unit) || unit.value !== 'd') && currentTick && !isNaN(currentTick)) {
        var decimalPlaces = countDecimalPlaces(currentTick);
        if (indicativeBarrierTooltip && isVisible(indicativeBarrierTooltip)) {
            var barrierValue = isNaN(parseFloat(barrierElement.value))?0:parseFloat(barrierElement.value);
            indicativeBarrierTooltip.textContent = (parseFloat(currentTick) + barrierValue).toFixed(decimalPlaces);
        }

        if (indicativeHighBarrierTooltip && isVisible(indicativeHighBarrierTooltip)) {
            var highBarrierValue = isNaN(parseFloat(highBarrierElement.value))?0:parseFloat(highBarrierElement.value);
            indicativeHighBarrierTooltip.textContent = (parseFloat(currentTick) + highBarrierValue).toFixed(decimalPlaces);
        }

        if (indicativeLowBarrierTooltip && isVisible(indicativeLowBarrierTooltip)) {
            var lowBarrierValue = isNaN(parseFloat(lowBarrierElement.value))?0:parseFloat(lowBarrierElement.value);
            indicativeLowBarrierTooltip.textContent = (parseFloat(currentTick) + lowBarrierValue).toFixed(decimalPlaces);
        }
    } else {
        indicativeBarrierTooltip.textContent = '';
        indicativeHighBarrierTooltip.textContent = '';
        indicativeLowBarrierTooltip.textContent = '';
    }
}

/*
 * function to sort the duration in ascending order
 */
function durationOrder(duration){
    'use strict';
    var order = {
        t:1,
        s:2,
        m:3,
        h:4,
        d:5
    };
    return order[duration];
}

function marketOrder(market){
    'use strict';
    var order = {
        forex:               0,
            major_pairs:     1,
            minor_pairs:     2,
            smart_fx:        3,
        indices:             4,
            asia_oceania:    5,
            europe_africa:   6,
            americas:        7,
            otc_index:       8,
        stocks:              9,
            au_otc_stock:    10,
            ge_otc_stock:    11,
            india_otc_stock: 12,
            uk_otc_stock:    13,
            us_otc_stock:    14,
        commodities:         15,
            metals:          16,
            energy:          17,
        volidx:              18,
            random_index:    19,
            random_daily:    20,
            random_nightly:  21
    };
    return order[market];
}

function marketSort(a,b){
    if(marketOrder(a) > marketOrder(b)){
        return 1;
    }
    else if(marketOrder(a) < marketOrder(b)){
        return -1;
    }
    else{
        return 0;
    }
}

function displayTooltip(market, symbol){
    'use strict';
    var tip = document.getElementById('symbol_tip'),
        guide = document.getElementById('guideBtn'),
        app = document.getElementById('androidApp'),
        appstore = document.getElementById('appstore'),
        markets = document.getElementById('contract_markets').value;
    if (!market || !symbol) return;
    if (market.match(/^volidx/) || symbol.match(/^R/) || market.match(/^random_index/) || market.match(/^random_daily/)){
        if (guide) guide.hide();
        tip.show();
        tip.setAttribute('target', page.url.url_for('/get-started/volidx-markets'));
        app.show();
        appstore.show();
    } else {
      app.hide();
      appstore.hide();
      tip.hide();
      if (guide) guide.show();
    }
    if (market.match(/^otc_index/) || symbol.match(/^OTC_/) || market.match(/stock/) || markets.match(/stocks/)){
        tip.show();
        tip.setAttribute('target', page.url.url_for('/get-started/otc-indices-stocks'));
    }
    if (market.match(/^random_index/) || symbol.match(/^R_/)){
        tip.setAttribute('target', page.url.url_for('/get-started/volidx-markets', '#volidx-indices'));
    }
    if (market.match(/^random_daily/) || symbol.match(/^RDB/) || symbol.match(/^RDMO/) || symbol.match(/^RDS/)){
        tip.setAttribute('target', page.url.url_for('/get-started/volidx-markets', '#volidx-quotidians'));
    }
    if (market.match(/^smart_fx/) || symbol.match(/^WLD/)){
        tip.show();
        tip.setAttribute('target', page.url.url_for('/get-started/smart-indices', '#world-fx-indices'));
    }
}

/*
 * count number of decimal places in spot so that we can make barrier to same decimal places
 */
function countDecimalPlaces(num) {
    'use strict';
    if (!isNaN(num)) {
        var str = num.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        } else {
            return 0;
        }
    }
}

function selectOption(option, select){
    var options = select.getElementsByTagName('option');
    var contains = 0;
    for(var i = 0; i < options.length; i++){
        if(options[i].value==option && !options[i].hasAttribute('disabled')){
            contains = 1;
            break;
        }
    }
    if(contains){
        select.value = option;
        return true;
    }
    else{
        return false;
    }
}

function updatePurchaseStatus(final_price, pnl, contract_status){
    $('#contract_purchase_heading').text(text.localize(contract_status));
    $payout = $('#contract_purchase_payout');
    $cost = $('#contract_purchase_cost');
    $profit = $('#contract_purchase_profit');

    $payout.html(Content.localize().textBuyPrice + '<p>'+addComma(Math.abs(pnl))+'</p>');
    $cost.html(Content.localize().textFinalPrice + '<p>'+addComma(final_price)+'</p>');
    if(!final_price){
        $profit.html(Content.localize().textLoss + '<p>'+addComma(pnl)+'</p>');
    }
    else{
        $profit.html(Content.localize().textProfit + '<p>'+addComma(Math.round((final_price-pnl)*100)/100)+'</p>');
    }
}

function updateWarmChart(){
    var $chart = $('#trading_worm_chart');
    var spots =  Object.keys(Tick.spots()).sort(function(a,b){return a-b;}).map(function(v){return Tick.spots()[v];});
    var chart_config = {
        type: 'line',
        lineColor: '#606060',
        fillColor: false,
        spotColor: '#00f000',
        minSpotColor: '#f00000',
        maxSpotColor: '#0000f0',
        highlightSpotColor: '#ffff00',
        highlightLineColor: '#000000',
        spotRadius: 1.25
    };
    if($chart){
        $chart.sparkline(spots, chart_config);
        if(spots.length){
            $chart.show();
        }
        else{
            $chart.hide();
        }
    }
}

function reloadPage(){
    Defaults.remove('market', 'underlying', 'formname',
        'date_start','expiry_type', 'expiry_date', 'expirt_time', 'duration_units', 'diration_value',
        'amount', 'amount_type', 'currency', 'stop_loss', 'stop_type', 'stop_profit', 'amount_per_point', 'prediction');
    location.reload();
}

function addComma(num){
    num = (num || 0) * 1;
    return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showHighchart(){
  Content.populate();

  if (window.chartAllowed) {
    chartFrameSource();
  } else {
    document.getElementById('chart_frame').src = '';
    $('#trade_live_chart').hide();
    $('#chart-error').text(text.localize('Chart is not available for this underlying.'))
                     .show();
    return;
  }
}

function chartFrameSource() {
  if ($('#tab_graph').hasClass('active') && (sessionStorage.getItem('old_underlying') !== sessionStorage.getItem('underlying') || $('#chart_frame').attr('src') === '')) {
      setChartSource();
      sessionStorage.setItem('old_underlying', document.getElementById('underlying').value);
  }
  $('#chart-error').hide();
  $('#trade_live_chart').show();
}

function setChartSource() {
  document.getElementById('chart_frame').src = 'https://webtrader.binary.com?affiliates=true&instrument=' + document.getElementById('underlying').value + '&timePeriod=1t&gtm=true&lang=' + (page.language() || 'en').toLowerCase();
}


// ============= Functions used in /trading_beta =============

/*
 * function to toggle active class of menu
 */
function toggleActiveNavMenuElement_Beta(nav, eventElement) {
    'use strict';
    var liElements = nav.getElementsByTagName("li");
    var classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (var i = 0, len = liElements.length; i < len; i++){
            liElements[i].classList.remove('active');
        }
        classes.add('active');
        var parent = eventElement.parentElement.parentElement;
        if (parent.tagName === 'LI' && !parent.classList.contains('active')) {
            parent.classList.add('active');
        }
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

function updatePurchaseStatus_Beta(final_price, pnl, contract_status){
    $('#contract_purchase_heading').text(text.localize(contract_status));
    var payout  = document.getElementById('contract_purchase_payout'),
        cost    = document.getElementById('contract_purchase_cost'),
        profit  = document.getElementById('contract_purchase_profit'),
        currency = TUser.get().currency;

    label_value(cost  , Content.localize().textStake , Math.abs(pnl));
    label_value(payout, Content.localize().textPayout, addComma(final_price));

    var isWin = (+final_price > 0);
    $('#contract_purchase_profit_value').attr('class', (isWin ? 'profit' : 'loss'));
    label_value(profit, isWin ? Content.localize().textProfit : Content.localize().textLoss, addComma(Math.round((final_price - pnl) * 100) / 100));
}

function label_value(label_elem, label, value, no_currency) {
    var currency = TUser.get().currency;
    label_elem.innerHTML = label;
    var value_elem = document.getElementById(label_elem.id + '_value');
    value_elem.innerHTML = no_currency ? value : format_money(currency, value);
    value_elem.setAttribute('value', value);
}

function adjustAnalysisColumnHeight() {
    var sumHeight = 0;
    if (window.innerWidth > 767) {
        $('.col-left').children().each(function() {
            if ($(this).is(':visible')) sumHeight += $(this).outerHeight(true);
        });
    } else {
        sumHeight = 'auto';
    }
    $('#trading_analysis_content').height(sumHeight);
}

function moreTabsHandler($ul) {
    if (!$ul) $ul = $('#analysis_tabs');
    var $visibleTabs  = $ul.find('>li:visible'),
        seeMoreClass  = 'see-more',
        moreTabsClass = 'more-tabs',
        maxWidth      = $ul.outerWidth(),
        totalWidth    = 0;

    // add seeMore tab
    var $seeMore = $ul.find('li.' + seeMoreClass);
    if ($seeMore.length === 0) {
        $seeMore = $('<li class="tm-li ' + seeMoreClass + '"><a class="tm-a" href="javascript:;"><span class="caret-down"></span></a></li>');
        $ul.append($seeMore);
    }
    $seeMore.removeClass('active');

    // add moreTabs container
    var $moreTabs = $ul.find('.' + moreTabsClass);
    if ($moreTabs.length === 0) {
        $moreTabs = $('<div class="' + moreTabsClass + '" />').appendTo($seeMore);
    } else {
        $moreTabs.find('>li').each(function(index, tab) {
            $(tab).insertBefore($seeMore);
        });
    }
    $moreTabs.css('top', $ul.find('li:visible').outerHeight() - 1).unbind('click').click(function() { hideDropDown('fast'); });

    // move additional tabs to moreTabs
    $visibleTabs = $ul.find('>li:visible');
    $visibleTabs.each(function(index, tab) {
        totalWidth += $(tab).outerWidth(true);
    });
    var resultWidth = totalWidth;
    while (resultWidth >= maxWidth) {
        var $thisTab = $ul.find('>li:not(.' + seeMoreClass + '):visible').last();
        resultWidth -= $thisTab.outerWidth(true);
        $thisTab.prependTo($moreTabs);
    }

    if ($moreTabs.children().length === 0) {
        $seeMore.hide();
        return;
    }

    $seeMore.show();
    if ($moreTabs.find('>li.active').length > 0) {
        $seeMore.addClass('active');
    }

    // drop down behaviour
    function showDropDown() {
        $moreTabs.slideDown();
        if ($seeMore.find('.over').length === 0) {
            $('<div/>', {class: 'over'}).insertBefore($seeMore.find('>a'));
            $seeMore.find('.over').width($seeMore.width());
        }
        $seeMore.addClass('open');
    }
    function hideDropDown(duration) {
        $moreTabs.slideUp(duration || 400, function() {
            $seeMore.removeClass('open');
        });
    }
    var timeout;
    $seeMore.find('>a').unbind('click').on('click', function(e) {
        e.stopPropagation();
        if($moreTabs.is(':visible')) {
            hideDropDown();
            clearTimeout(timeout);
        } else {
            clearTimeout(timeout);
            showDropDown();
            timeout = setTimeout(function() {
                hideDropDown();
                clearTimeout(timeout);
            }, 3000);
        }
    });
    $(document).unbind('click').on('click', function() { hideDropDown(); });

    $moreTabs.mouseenter(function() {
        clearTimeout(timeout);
    });

    $moreTabs.mouseleave(function() {
        clearTimeout(timeout);
        var $this = $(this);
        timeout = setTimeout(function() {
            hideDropDown();
        }, 1000);
    });
}

//used temporarily for mocha test
if (typeof module !== 'undefined') {
    module.exports = {
        addComma: addComma
    };
}
