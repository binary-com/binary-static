const Moment             = require('moment');
const Defaults           = require('./defaults').Defaults;
const Notifications      = require('./notifications').Notifications;
const Symbols            = require('./symbols').Symbols;
const Tick               = require('./tick').Tick;
const Client             = require('../../base/client');
const getLanguage        = require('../../base/language').get;
const localize           = require('../../base/localize').localize;
const urlFor             = require('../../base/url').urlFor;
const isEmptyObject      = require('../../base/utility').isEmptyObject;
const jpClient           = require('../../common_functions/country_base').jpClient;
const formatMoney        = require('../../common_functions/currency_to_symbol').formatMoney;
const addComma           = require('../../common_functions/string_util').addComma;
const toISOFormat        = require('../../common_functions/string_util').toISOFormat;
const elementInnerHtml   = require('../../common_functions/common_functions').elementInnerHtml;
const elementTextContent = require('../../common_functions/common_functions').elementTextContent;

/*
 * This contains common functions we need for processing the response
 */

if (typeof window === 'undefined') {
    // eslint-disable-next-line
    Element = function() {}; // jshint ignore:line
}

Element.prototype.hide = function() {
    this.style.display = 'none';
};

Element.prototype.show = function() {
    this.style.display = '';
};

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

/*
 * function to display contract form as element of ul
 */
function displayContractForms(id, elements, selected) {
    'use strict';

    if (!id || !elements || !selected) return;
    const target = document.getElementById(id),
        fragment = document.createDocumentFragment();

    elementInnerHtml(target, '');

    if (elements) {
        const tree = getContractCategoryTree(elements);
        for (let i = 0; i < tree.length; i++) {
            const el1 = tree[i];
            const li = document.createElement('li');

            li.classList.add('tm-li');
            if (i === 0) {
                li.classList.add('first');
            } else if (i === tree.length - 1) {
                li.classList.add('last');
            }

            if (typeof el1 === 'object') {
                const fragment2 = document.createDocumentFragment();
                let flag = 0,
                    first = '';
                for (let j = 0; j < el1[1].length; j++) {
                    const el2 = el1[1][j];
                    const li2 = document.createElement('li'),
                        a2 = document.createElement('a'),
                        content2 = document.createTextNode(elements[el2]);
                    li2.classList.add('tm-li-2');

                    if (j === 0) {
                        first = el2.toLowerCase();
                        li2.classList.add('first');
                    } else if (j === el1[1].length - 1) {
                        li2.classList.add('last');
                    }

                    if (selected && selected === el2.toLowerCase()) {
                        li2.classList.add('active');
                        a2.classList.add('a-active');
                        flag = 1;
                    }

                    a2.classList.add('tm-a-2');
                    a2.appendChild(content2);
                    a2.setAttribute('menuitem', el2.toLowerCase());
                    a2.setAttribute('id', el2.toLowerCase());

                    li2.appendChild(a2);

                    fragment2.appendChild(li2);
                }
                if (fragment2.hasChildNodes()) {
                    const ul = document.createElement('ul'),
                        a = document.createElement('a'),
                        content = document.createTextNode(elements[el1[0]]);

                    a.appendChild(content);
                    a.setAttribute('class', 'tm-a');
                    a.setAttribute('menuitem', first);
                    ul.appendChild(fragment2);
                    ul.setAttribute('class', 'tm-ul-2');
                    ul.setAttribute('id', `${el1[0]}-submenu`);

                    if (flag) {
                        li.classList.add('active');
                    }

                    li.appendChild(a);
                    li.appendChild(ul);
                }
            } else {
                const content3 = document.createTextNode(elements[el1]),
                    a3 = document.createElement('a');

                if (selected && selected === el1.toLowerCase()) {
                    a3.classList.add('a-active');
                    li.classList.add('active');
                }
                a3.appendChild(content3);
                a3.classList.add('tm-a');
                a3.setAttribute('menuitem', el1);
                a3.setAttribute('id', el1.toLowerCase());
                li.appendChild(a3);
            }
            fragment.appendChild(li);
        }
        if (target) {
            target.appendChild(fragment);
            const list = target.getElementsByClassName('tm-li');
            for (let k = 0; k < list.length; k++) {
                const li4 = list[k];
                li4.addEventListener('mouseover', function() {
                    this.classList.add('hover');
                });
                li4.addEventListener('mouseout', function() {
                    this.classList.remove('hover');
                });
            }
        }
    }
}


function displayMarkets(id, elements, selected) {
    'use strict';

    const target = document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    const keys1 = Object.keys(elements).sort(marketSort);
    for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i],
            content = document.createTextNode(elements[key].name);
        let option = document.createElement('option');
        option.setAttribute('value', key);
        if (selected && selected === key) {
            option.setAttribute('selected', 'selected');
        }
        option.appendChild(content);
        fragment.appendChild(option);

        if (elements[key].submarkets && !isEmptyObject(elements[key].submarkets)) {
            const keys2 = Object.keys(elements[key].submarkets).sort(marketSort);
            for (let j = 0; j < keys2.length; j++) {
                const key2 = keys2[j];
                option = document.createElement('option');
                option.setAttribute('value', key2);
                if (selected && selected === key2) {
                    option.setAttribute('selected', 'selected');
                }
                elementTextContent(option, `\xA0\xA0\xA0\xA0${elements[key].submarkets[key2].name}`);
                fragment.appendChild(option);
            }
        }
    }
    if (target) {
        target.appendChild(fragment);

        if (target.selectedIndex < 0) {
            target.selectedIndex = 0;
        }
        const current = target.options[target.selectedIndex];
        if (selected !== current.value) {
            Defaults.set('market', current.value);
        }

        if (current.disabled) { // there is no open market
            Notifications.show({ text: localize('All markets are closed now. Please try again later.'), uid: 'MARKETS_CLOSED' });
            document.getElementById('trading_init_progress').style.display = 'none';
        }
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

    const target = document.getElementById(id);

    if (!target) return;

    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (!isEmptyObject(elements)) {
        target.appendChild(generateUnderlyingOptions(elements, selected));
    }
}

function generateUnderlyingOptions(elements, selected) {
    const fragment = document.createDocumentFragment();
    const keys = Object.keys(elements).sort(function(a, b) {
        return elements[a].display.localeCompare(elements[b].display);
    });
    const submarkets = {};
    for (let i = 0; i < keys.length; i++) {
        if (!submarkets.hasOwnProperty(elements[keys[i]].submarket)) {
            submarkets[elements[keys[i]].submarket] = [];
        }
        submarkets[elements[keys[i]].submarket].push(keys[i]);
    }
    const keys2 = Object.keys(submarkets).sort(marketSort);
    for (let j = 0; j < keys2.length; j++) {
        for (let k = 0; k < submarkets[keys2[j]].length; k++) {
            const key = submarkets[keys2[j]][k];
            const option = document.createElement('option');
            const content = document.createTextNode(localize(elements[key].display));
            option.setAttribute('value', key);
            if (selected && selected === key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
    }
    return fragment;
}

/*
 * This maps the form name and barrierCategory we display on
 * trading form to the actual we send it to backend
 * for e.g risefall is mapped to callput with barrierCategory euro_atm
 */
function getFormNameBarrierCategory(displayFormName) {
    'use strict';

    const obj = {};
    if (displayFormName) {
        if (displayFormName === 'risefall') {
            obj.formName = 'callput';
            obj.barrierCategory = 'euro_atm';
        } else if (displayFormName === 'higherlower') {
            obj.formName = 'callput';
            obj.barrierCategory = 'euro_non_atm';
        } else if (displayFormName === 'callput') {
            obj.formName = displayFormName;
            obj.barrierCategory = 'euro_atm';
        } else if (displayFormName === 'overunder' || displayFormName === 'evenodd' || displayFormName === 'matchdiff') {
            obj.formName = 'digits';
            obj.barrierCategory = '';
        } else {
            obj.formName = displayFormName;
            obj.barrierCategory = '';
        }
    } else {
        obj.formName = 'callput';
        obj.barrierCategory = 'euro_atm';
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

    const obj = {
        CALL        : 'top',
        PUT         : 'bottom',
        CALLE       : 'top',
        PUTE        : 'bottom',
        ASIANU      : 'top',
        ASIAND      : 'bottom',
        DIGITMATCH  : 'top',
        DIGITDIFF   : 'bottom',
        DIGITEVEN   : 'top',
        DIGITODD    : 'bottom',
        DIGITOVER   : 'top',
        DIGITUNDER  : 'bottom',
        EXPIRYRANGEE: 'top',
        EXPIRYMISSE : 'bottom',
        EXPIRYRANGE : 'top',
        EXPIRYMISS  : 'bottom',
        RANGE       : 'top',
        UPORDOWN    : 'bottom',
        ONETOUCH    : 'top',
        NOTOUCH     : 'bottom',
        SPREADU     : 'top',
        SPREADD     : 'bottom',
    };

    return type ? obj[type] : 'top';
}

function showPriceOverlay() {
    'use strict';

    const elm = document.getElementById('loading_container2');
    if (elm) {
        elm.style.display = 'block';
    }
}

function hidePriceOverlay() {
    'use strict';

    const elm = document.getElementById('loading_container2');
    if (elm) {
        elm.style.display = 'none';
    }
}

function hideFormOverlay() {
    'use strict';

    const elm = document.getElementById('loading_container3');
    if (elm) {
        elm.style.display = 'none';
    }
}

function showFormOverlay() {
    'use strict';

    const elm = document.getElementById('loading_container3');
    if (elm) {
        elm.style.display = 'block';
    }
}

/*
 * function to hide contract confirmation overlay container
 */
function hideOverlayContainer() {
    'use strict';

    const elm = document.getElementById('contract_confirmation_container');
    if (elm) {
        elm.style.display = 'none';
    }
    const elm2 = document.getElementById('contracts_list');
    if (elm2) {
        elm2.style.display = 'flex';
    }
    $('.purchase_button').css('visibility', '');
}

function getContractCategoryTree(elements) {
    'use strict';

    let tree = [
        ['updown',
            ['risefall',
                'higherlower'],
        ],
        'touchnotouch',
        ['inout',
            ['endsinout',
                'staysinout'],
        ],
        'asian',
        ['digits',
            ['matchdiff',
                'evenodd',
                'overunder'],
        ],
        'spreads',
    ];

    if (elements) {
        tree = tree.map(function(e) {
            if (typeof e === 'object') {
                e[1] = e[1].filter(function(e1) {
                    return elements[e1];
                });
                if (!e[1].length) {
                    e = '';
                }
            } else if (!elements[e]) {
                e = '';
            }
            return e;
        });
        tree = tree.filter(function(v) { return v.length; });
    }
    return tree;
}

/*
 * resets price movement color changing, to prevent coloring on some changes
 * coloring will continue on the next proposal responses
 */
function resetPriceMovement() {
    const btns = document.getElementsByClassName('purchase_button');
    for (let i = 0; i < btns.length; i++) {
        btns[i].setAttribute('data-display_value', '');
        btns[i].setAttribute('data-payout', '');
    }
}

/*
 * function to toggle active class of menu
 */
function toggleActiveNavMenuElement(nav, eventElement) {
    'use strict';

    const liElements = nav.getElementsByTagName('li');
    const classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (let i = 0, len = liElements.length; i < len; i++) {
            liElements[i].classList.remove('active');
        }
        classes.add('active');
    }
}

function toggleActiveCatMenuElement(nav, eventElementId) {
    'use strict';

    const eventElement = document.getElementById(eventElementId),
        liElements = nav.querySelectorAll('.active, .a-active'),
        classes = eventElement.classList;
    let i,
        len;

    if (!classes.contains('active')) {
        for (i = 0, len = liElements.length; i < len; i++) {
            liElements[i].classList.remove('active');
            liElements[i].classList.remove('a-active');
        }
        classes.add('a-active');

        i = 0;
        let parent = eventElement.parentElement;
        while (parent && parent.id !== nav.id && i < 10) {
            if (parent.tagName === 'LI') {
                parent.classList.add('active');
            }
            parent = parent.parentElement;
            i++;
        }
    }
}

/*
 * function to display the profit and return of bet under each trade container except spreads
 */
function displayCommentPrice(node, currency, type, payout) {
    'use strict';

    if (node && type && payout) {
        const profit = payout - type,
            return_percent = (profit / type) * 100,
            comment = `${localize('Net profit')}: ${formatMoney(currency, profit)} | ${localize('Return')} ${return_percent.toFixed(1)}%`;

        if (isNaN(profit) || isNaN(return_percent)) {
            node.hide();
        } else {
            node.show();
            elementTextContent(node, comment);
        }
    }
}

/*
 * function to display comment for spreads
 */
function displayCommentSpreads(node, currency, point) {
    'use strict';

    if (node && point) {
        const amountPerPoint = document.getElementById('amount_per_point').value,
            stopType = document.querySelector('input[name="stop_type"]:checked').value,
            stopLoss = document.getElementById('stop_loss').value;
        let displayAmount = 0;

        if (isNaN(stopLoss) || isNaN(amountPerPoint)) {
            node.hide();
        } else {
            if (stopType === 'point') {
                displayAmount = parseFloat(parseFloat(amountPerPoint) * parseFloat(stopLoss));
            } else {
                displayAmount = parseFloat(stopLoss);
            }
            elementTextContent(node, localize('Deposit of [_1] is required. Current spread: [_2] points', formatMoney(currency, displayAmount), point));
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

    let timeout;
    const delay = wait || 500;
    return function() {
        const context = this,
            args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
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

    let mkt = Defaults.get('market');
    const markets = Symbols.markets(1);
    if (!mkt || !markets[mkt]) {
        const sorted_markets = Object.keys(Symbols.markets()).filter(function(v) {
            return markets[v].is_active;
        }).sort(function(a, b) {
            return getMarketsOrder(a) - getMarketsOrder(b);
        });
        mkt = sorted_markets[0];
    }
    return mkt;
}

// Order
function getMarketsOrder(market) {
    const order = {
        forex      : 1,
        volidx     : 2,
        indices    : 3,
        stocks     : 4,
        commodities: 5,
    };
    return order[market] ? order[market] : 100;
}

/*
 * this is invoked when submit button is clicked and prevents reloading of page
 */
function addEventListenerForm() {
    'use strict';

    document.getElementById('websocket_form').addEventListener('submit', function(evt) {
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

    const button = form.ownerDocument.createElement('input');
    button.style.display = 'none';
    button.type = 'submit';
    form.appendChild(button).click();
    form.removeChild(button);
}

/*
 * function to sort the duration in ascending order
 */
function durationOrder(duration) {
    'use strict';

    const order = {
        t: 1,
        s: 2,
        m: 3,
        h: 4,
        d: 5,
    };
    return order[duration];
}

function marketOrder(market) {
    'use strict';

    const order = {
        forex          : 0,
        major_pairs    : 1,
        minor_pairs    : 2,
        smart_fx       : 3,
        indices        : 4,
        asia_oceania   : 5,
        europe_africa  : 6,
        americas       : 7,
        otc_index      : 8,
        stocks         : 9,
        au_otc_stock   : 10,
        ge_otc_stock   : 11,
        india_otc_stock: 12,
        uk_otc_stock   : 13,
        us_otc_stock   : 14,
        commodities    : 15,
        metals         : 16,
        energy         : 17,
        volidx         : 18,
        random_index   : 19,
        random_daily   : 20,
        random_nightly : 21,
    };
    return order[market];
}

function marketSort(a, b) {
    if (marketOrder(a) > marketOrder(b)) {
        return 1;
    } else if (marketOrder(a) < marketOrder(b)) {
        return -1;
    }

    return 0;
}

function displayTooltip(market, symbol) {
    'use strict';

    const tip = document.getElementById('symbol_tip'),
        guide = document.getElementById('guideBtn'),
        app = document.getElementById('androidApp'),
        appstore = document.getElementById('appstore'),
        markets = document.getElementById('contract_markets').value;
    if (!market || !symbol) return;
    if (market.match(/^volidx/) || symbol.match(/^R/) || market.match(/^random_index/) || market.match(/^random_daily/)) {
        if (guide) guide.hide();
        tip.show();
        tip.setAttribute('target', urlFor('/get-started/volidx-markets'));
        app.show();
        appstore.show();
    } else {
        app.hide();
        appstore.hide();
        tip.hide();
        if (guide) guide.show();
    }
    if (market.match(/^otc_index/) || symbol.match(/^OTC_/) || market.match(/stock/) || markets.match(/stocks/)) {
        tip.show();
        tip.setAttribute('target', urlFor('/get-started/otc-indices-stocks'));
    }
    if (market.match(/^random_index/) || symbol.match(/^R_/)) {
        tip.setAttribute('target', urlFor('/get-started/volidx-markets', '#volidx-indices'));
    }
    if (market.match(/^random_daily/) || symbol.match(/^RDB/) || symbol.match(/^RDMO/) || symbol.match(/^RDS/)) {
        tip.setAttribute('target', urlFor('/get-started/volidx-markets', '#volidx-quotidians'));
    }
    if (market.match(/^smart_fx/) || symbol.match(/^WLD/)) {
        tip.show();
        tip.setAttribute('target', urlFor('/get-started/smart-indices', '#world-fx-indices'));
    }
}

function selectOption(option, select) {
    const options = select.getElementsByTagName('option');
    let contains = 0;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === option && !options[i].hasAttribute('disabled')) {
            contains = 1;
            break;
        }
    }
    if (contains) {
        select.value = option;
        return true;
    }

    return false;
}

function updatePurchaseStatus(final_price, pnl, contract_status) {
    $('#contract_purchase_heading').text(localize(contract_status));
    const $payout = $('#contract_purchase_payout'),
        $cost = $('#contract_purchase_cost'),
        $profit = $('#contract_purchase_profit');

    $payout.html($('<div/>', { text: localize('Buy price') }).append($('<p/>', { text: addComma(Math.abs(pnl)) })));
    $cost.html($('<div/>', { text: localize('Final price') }).append($('<p/>', { text: addComma(final_price) })));
    if (!final_price) {
        $profit.html($('<div/>', { text: localize('Loss') }).append($('<p/>', { text: addComma(pnl) })));
    } else {
        $profit.html($('<div/>', { text: localize('Profit') }).append($('<p/>', { text: addComma(Math.round((final_price - pnl) * 100) / 100) })));
        updateContractBalance(Client.get('balance'));
    }
}

function updateContractBalance(balance) {
    $('#contract_purchase_balance').text(`${localize('Account balance:')} ${formatMoney(Client.get('currency'), balance)}`);
}

function updateWarmChart() {
    const $chart = $('#trading_worm_chart');
    const spots =  Object.keys(Tick.spots()).sort(function(a, b) {
        return a - b;
    }).map(function(v) {
        return Tick.spots()[v];
    });
    const chart_config = {
        type              : 'line',
        lineColor         : '#606060',
        fillColor         : false,
        spotColor         : '#00f000',
        minSpotColor      : '#f00000',
        maxSpotColor      : '#0000f0',
        highlightSpotColor: '#ffff00',
        highlightLineColor: '#000000',
        spotRadius        : 1.25,
    };
    if ($chart && typeof $chart.sparkline === 'function') {
        $chart.sparkline(spots, chart_config);
        if (spots.length) {
            $chart.show();
        } else {
            $chart.hide();
        }
    }
}

function reloadPage() {
    Defaults.remove('market', 'underlying', 'formname',
        'date_start', 'expiry_type', 'expiry_date', 'expirt_time', 'duration_units', 'diration_value',
        'amount', 'amount_type', 'currency', 'stop_loss', 'stop_type', 'stop_profit', 'amount_per_point', 'prediction');
    location.reload();
}

function showHighchart() {
    if (window.chartAllowed) {
        chartFrameSource();
    } else {
        chartFrameCleanup();
        $('#trade_live_chart').hide();
        $('#chart-error').text(localize('Chart is not available for this underlying.'))
                     .show();
    }
}

function chartFrameCleanup() {
    /*
     * Prevent IE memory leak (http://stackoverflow.com/questions/8407946).
     */
    const chart_frame = document.getElementById('chart_frame');
    if (chart_frame) {
        chart_frame.src = 'about:blank';
    }
}

function chartFrameSource() {
    if ($('#tab_graph').hasClass('active') && (sessionStorage.getItem('old_underlying') !== sessionStorage.getItem('underlying') || /^(|about:blank)$/.test($('#chart_frame').attr('src')))) {
        chartFrameCleanup();
        setChartSource();
        sessionStorage.setItem('old_underlying', document.getElementById('underlying').value);
    }
    $('#chart-error').hide();
    $('#trade_live_chart').show();
}

function setChartSource() {
    const is_ja = !!jpClient();
    document.getElementById('chart_frame').src = `https://webtrader.binary.com?affiliates=true&instrument=${document.getElementById('underlying').value}&timePeriod=1t&gtm=true&lang=${getLanguage().toLowerCase()}&hideOverlay=${is_ja}&hideShare=${is_ja}&timezone=GMT+${(is_ja ? '9' : '0')}&hideFooter=${is_ja}`;
}

// ============= Functions used in /trading_beta =============

/*
 * function to toggle active class of menu
 */
function toggleActiveNavMenuElement_Beta(nav, eventElement) {
    'use strict';

    const liElements = nav.getElementsByTagName('li');
    const classes = eventElement.classList;

    if (!classes.contains('active')) {
        for (let i = 0, len = liElements.length; i < len; i++) {
            liElements[i].classList.remove('active');
        }
        classes.add('active');
        const parent = eventElement.parentElement.parentElement;
        if (parent.tagName === 'LI' && !parent.classList.contains('active')) {
            parent.classList.add('active');
        }
    }
}

function updatePurchaseStatus_Beta(final_price, pnl, contract_status) {
    final_price = String(final_price).replace(/,/g, '') * 1;
    pnl = String(pnl).replace(/,/g, '') * 1;
    $('#contract_purchase_heading').text(localize(contract_status));
    const payout  = document.getElementById('contract_purchase_payout'),
        cost    = document.getElementById('contract_purchase_cost'),
        profit  = document.getElementById('contract_purchase_profit');

    label_value(cost, localize('Stake'), addComma(Math.abs(pnl)));
    label_value(payout, localize('Payout'), addComma(final_price));

    const isWin = (final_price > 0);
    $('#contract_purchase_profit_value').attr('class', (isWin ? 'profit' : 'loss'));
    label_value(profit, isWin ? localize('Profit') : localize('Loss'),
        addComma(isWin ? Math.round((final_price - pnl) * 100) / 100 : -Math.abs(pnl)));
}

function displayTooltip_Beta(market, symbol) {
    'use strict';

    const tip = document.getElementById('symbol_tip'),
        markets = document.getElementById('contract_markets').value;
    if (!market || !symbol) return;
    if (market.match(/^volidx/) || symbol.match(/^R/) || market.match(/^random_index/) || market.match(/^random_daily/)) {
        tip.show();
        tip.setAttribute('target', urlFor('/get-started/volidx-markets'));
    } else {
        tip.hide();
    }
    if (market.match(/^otc_index/) || symbol.match(/^OTC_/) || market.match(/stock/) || markets.match(/stocks/)) {
        tip.show();
        tip.setAttribute('target', urlFor('/get-started/otc-indices-stocks'));
    }
    if (market.match(/^random_index/) || symbol.match(/^R_/)) {
        tip.setAttribute('target', urlFor('/get-started/volidx-markets', '#volidx-indices'));
    }
    if (market.match(/^random_daily/) || symbol.match(/^RDB/) || symbol.match(/^RDMO/) || symbol.match(/^RDS/)) {
        tip.setAttribute('target', urlFor('/get-started/volidx-markets', '#volidx-quotidians'));
    }
    if (market.match(/^smart_fx/) || symbol.match(/^WLD/)) {
        tip.show();
        tip.setAttribute('target', urlFor('/get-started/smart-indices', '#world-fx-indices'));
    }
}

function label_value(label_elem, label, value, no_currency) {
    const currency = Client.get('currency');
    elementInnerHtml(label_elem, label);
    const value_elem = document.getElementById(`${label_elem.id}_value`);
    elementInnerHtml(value_elem, no_currency ? value : formatMoney(currency, value));
    value_elem.setAttribute('value', String(value).replace(/,/g, ''));
}

function timeIsValid($element) {
    let endDateValue = document.getElementById('expiry_date').getAttribute('data-value'),
        startDateValue = document.getElementById('date_start').value,
        endTimeValue = document.getElementById('expiry_time').value;
    const $invalid_time = $('#invalid-time');

    if ($element.attr('id') === $('#expiry_time') && endTimeValue &&
        !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(endTimeValue)) {
        $element.addClass('error-field');
        if ($invalid_time.length === 0) {
            $('#expiry_type_endtime').parent().append($('<p>', { class: 'error-msg', id: 'invalid-time', text: localize('Time is in the wrong format.') }));
        }
        return false;
    }

    $element.removeClass('error-field');
    $invalid_time.remove();

    endDateValue = endDateValue ? toISOFormat(Moment(endDateValue)) : toISOFormat(new Moment());
    startDateValue = startDateValue === 'now' ? Math.floor(window.time._i / 1000) : startDateValue;
    endTimeValue = endTimeValue || '23:59:59';

    if (Moment.utc(`${endDateValue} ${endTimeValue}`).unix() <= startDateValue) {
        $element.addClass('error-field');
        if (!document.getElementById('end_time_validation')) {
            $('#expiry_type_endtime').append($('<p/>', { class: 'error-msg', id: 'end_time_validation', text: localize('End time must be after start time.') }));
        }
        return false;
    }

    $element.removeClass('error-field');
    $('#end_time_validation').remove();
    return true;
}

module.exports = {
    displayUnderlyings             : displayUnderlyings,
    generateUnderlyingOptions      : generateUnderlyingOptions,
    getFormNameBarrierCategory     : getFormNameBarrierCategory,
    contractTypeDisplayMapping     : contractTypeDisplayMapping,
    showPriceOverlay               : showPriceOverlay,
    hidePriceOverlay               : hidePriceOverlay,
    hideFormOverlay                : hideFormOverlay,
    showFormOverlay                : showFormOverlay,
    hideOverlayContainer           : hideOverlayContainer,
    getContractCategoryTree        : getContractCategoryTree,
    resetPriceMovement             : resetPriceMovement,
    toggleActiveNavMenuElement     : toggleActiveNavMenuElement,
    toggleActiveCatMenuElement     : toggleActiveCatMenuElement,
    displayCommentPrice            : displayCommentPrice,
    displayCommentSpreads          : displayCommentSpreads,
    debounce                       : debounce,
    getDefaultMarket               : getDefaultMarket,
    addEventListenerForm           : addEventListenerForm,
    submitForm                     : submitForm,
    durationOrder                  : durationOrder,
    displayTooltip                 : displayTooltip,
    selectOption                   : selectOption,
    updatePurchaseStatus           : updatePurchaseStatus,
    updateContractBalance          : updateContractBalance,
    updateWarmChart                : updateWarmChart,
    reloadPage                     : reloadPage,
    showHighchart                  : showHighchart,
    chartFrameCleanup              : chartFrameCleanup,
    chartFrameSource               : chartFrameSource,
    displayContractForms           : displayContractForms,
    displayMarkets                 : displayMarkets,
    toggleActiveNavMenuElement_Beta: toggleActiveNavMenuElement_Beta,
    updatePurchaseStatus_Beta      : updatePurchaseStatus_Beta,
    displayTooltip_Beta            : displayTooltip_Beta,
    label_value                    : label_value,
    timeIsValid                    : timeIsValid,
};
