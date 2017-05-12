const Moment             = require('moment');
const Defaults           = require('./defaults');
const Notifications      = require('./notifications');
const Symbols            = require('./symbols');
const Tick               = require('./tick');
const Client             = require('../../base/client');
const localize           = require('../../base/localize').localize;
const urlFor             = require('../../base/url').urlFor;
const isEmptyObject      = require('../../base/utility').isEmptyObject;
const formatMoney        = require('../../common_functions/currency_to_symbol').formatMoney;
const toISOFormat        = require('../../common_functions/string_util').toISOFormat;
const elementInnerHtml   = require('../../common_functions/common_functions').elementInnerHtml;
const elementTextContent = require('../../common_functions/common_functions').elementTextContent;

/*
 * This contains common functions we need for processing the response
 */

const commonTrading = (() => {
    'use strict';

    /*
     * display contract form as element of ul
     */
    const displayContractForms = (id, elements, selected) => {
        if (!id || !elements || !selected) return;
        const target = document.getElementById(id);
        const fragment = document.createDocumentFragment();

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
                        const li2 = document.createElement('li');
                        const a2  = document.createElement('a');
                        const content2 = document.createTextNode(elements[el2]);
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
                        const ul = document.createElement('ul');
                        const a  = document.createElement('a');
                        const content = document.createTextNode(elements[el1[0]]);

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
                    const content3 = document.createTextNode(elements[el1]);
                    const a3 = document.createElement('a');

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
    };

    const displayMarkets = (id, elements, selected) => {
        const target = document.getElementById(id);
        const fragment = document.createDocumentFragment();

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        const keys1 = Object.keys(elements).sort(submarketSort);
        for (let i = 0; i < keys1.length; i++) {
            const key = keys1[i];
            const content = document.createTextNode(elements[key].name);
            let option = document.createElement('option');
            option.setAttribute('value', key);
            if (selected && selected === key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);

            if (elements[key].submarkets && !isEmptyObject(elements[key].submarkets)) {
                const keys2 = Object.keys(elements[key].submarkets).sort(submarketSort);
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
    };

    /*
     * display underlyings
     */
    const displayUnderlyings = (id, elements, selected) => {
        const target = document.getElementById(id);

        if (!target) return;

        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }

        if (!isEmptyObject(elements)) {
            target.appendChild(generateUnderlyingOptions(elements, selected));
        }
    };

    const generateUnderlyingOptions = (elements, selected) => {
        const fragment = document.createDocumentFragment();
        const keys = Object.keys(elements).sort((a, b) => elements[a].display.localeCompare(elements[b].display));
        const submarkets = {};
        for (let i = 0; i < keys.length; i++) {
            if (!submarkets.hasOwnProperty(elements[keys[i]].submarket)) {
                submarkets[elements[keys[i]].submarket] = [];
            }
            submarkets[elements[keys[i]].submarket].push(keys[i]);
        }
        const keys2 = Object.keys(submarkets).sort(submarketSort);
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
    };

    /*
     * This maps the form name and barrierCategory we display on
     * trading form to the actual we send it to backend
     * for e.g risefall is mapped to callput with barrierCategory euro_atm
     */
    const getFormNameBarrierCategory = form_name => (
        {
            form_name       : form_name && !/(risefall|higherlower|callput)/.test(form_name) ? (/(overunder|evenodd|matchdiff)/.test(form_name) ? 'digits' : form_name) : 'callput',
            barrier_category: form_name && !/(risefall|callput)/.test(form_name) ? (/higherlower/.test(form_name) ? 'euro_non_atm' : '') : 'euro_atm',
        }
    );

    /*
     * This maps the contract type to where we display on trading form
     * and as there is no mapping on server side so need to create it
     * on front end
     *
     * for example we display CALL on top and PUT to bottom
     */
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
    };

    const contractTypeDisplayMapping = type => (type ? obj[type] : 'top');

    const showHideOverlay = (el, display) => {
        const elm = document.getElementById(el);
        if (elm) {
            elm.style.display = display;
        }
    };

    /*
     * hide contract confirmation overlay container
     */
    const hideOverlayContainer = () => {
        showHideOverlay('contract_confirmation_container', 'none');
        showHideOverlay('contracts_list', 'flex');
        $('.purchase_button').css('visibility', '');
    };

    const getContractCategoryTree = (elements) => {
        let tree = [
            ['updown',
                ['risefall', 'higherlower'],
            ],
            'touchnotouch',
            ['inout',
                ['endsinout', 'staysinout'],
            ],
            'asian',
            ['digits',
                ['matchdiff', 'evenodd', 'overunder'],
            ],
        ];

        if (elements) {
            tree = tree.map((e) => {
                if (typeof e === 'object') {
                    e[1] = e[1].filter(e1 => elements[e1]);
                    if (!e[1].length) {
                        e = '';
                    }
                } else if (!elements[e]) {
                    e = '';
                }
                return e;
            });
            tree = tree.filter(v => v.length);
        }
        return tree;
    };

    /*
     * resets price movement color changing, to prevent coloring on some changes
     * coloring will continue on the next proposal responses
     */
    const resetPriceMovement = () => {
        const btns = document.getElementsByClassName('purchase_button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].setAttribute('data-display_value', '');
            btns[i].setAttribute('data-payout', '');
        }
    };

    const toggleActiveCatMenuElement = (nav, event_element_id) => {
        const event_element = document.getElementById(event_element_id);
        const li_elements = nav.querySelectorAll('.active, .a-active');
        const classes = event_element.classList;
        let i,
            len;

        if (!classes.contains('active')) {
            for (i = 0, len = li_elements.length; i < len; i++) {
                li_elements[i].classList.remove('active');
                li_elements[i].classList.remove('a-active');
            }
            classes.add('a-active');

            i = 0;
            let parent = event_element.parentElement;
            while (parent && parent.id !== nav.id && i < 10) {
                if (parent.tagName === 'LI') {
                    parent.classList.add('active');
                }
                parent = parent.parentElement;
                i++;
            }
        }
    };

    /*
     * display the profit and return of bet under each trade container
     */
    const displayCommentPrice = (node, currency, type, payout) => {
        if (node && type && payout) {
            const profit = payout - type;
            const return_percent = (profit / type) * 100;
            const comment = `${localize('Net profit')}: ${formatMoney(currency, profit)} | ${localize('Return')} ${return_percent.toFixed(1)}%`;

            if (isNaN(profit) || isNaN(return_percent)) {
                node.hide();
            } else {
                node.show();
                elementTextContent(node, comment);
            }
        }
    };

    /*
     * This is used in case where we have input and we don't want to fire
     * event on every change while user is typing for example in case of amount if
     * we want to change 10 to 1000 i.e. two zeros so two input events will be fired
     * normally, this will delay the event based on delay specified in milliseconds
     *
     * Reference
     * http://davidwalsh.name/javascript-debounce-function
     */
    const debounce = (func, wait, immediate) => {
        let timeout;
        const delay = wait || 500;
        return function() {
            const context = this;
            const args = arguments;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const call_now = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
            if (call_now) func.apply(context, args);
        };
    };

    /*
     * check if selected market is allowed for current user
     */
    const getDefaultMarket = () => {
        let mkt = Defaults.get('market');
        const markets = Symbols.markets(1);
        if (!mkt || !markets[mkt]) {
            const sorted_markets = Object.keys(Symbols.markets()).filter(v => markets[v].is_active)
                .sort((a, b) => getMarketsOrder(a) - getMarketsOrder(b));
            mkt = sorted_markets[0];
        }
        return mkt;
    };

    // Order
    const market_order = {
        forex      : 1,
        volidx     : 2,
        indices    : 3,
        stocks     : 4,
        commodities: 5,
    };

    const getMarketsOrder = market => market_order[market] || 100;

    /*
     * this is invoked when submit button is clicked and prevents reloading of page
     */
    const addEventListenerForm = () => {
        document.getElementById('websocket_form').addEventListener('submit', (evt) => {
            evt.currentTarget.classList.add('submitted');
            evt.preventDefault();
            return false;
        }, false);
    };

    /*
     * this creates a button, clicks it, and destroys it to invoke the listener
     */
    const submitForm = (form) => {
        const button = form.ownerDocument.createElement('input');
        button.style.display = 'none';
        button.type = 'submit';
        form.appendChild(button).click();
        form.removeChild(button);
    };

    /*
     * sort the duration in ascending order
     */
    const duration_order = {
        t: 1,
        s: 2,
        m: 3,
        h: 4,
        d: 5,
    };

    const submarket_order = {
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

    const submarketOrder = market => submarket_order[market];

    const submarketSort = (a, b) => {
        if (submarketOrder(a) > submarketOrder(b)) {
            return 1;
        } else if (submarketOrder(a) < submarketOrder(b)) {
            return -1;
        }

        return 0;
    };

    const displayTooltip = (market, symbol) => {
        const tip      = document.getElementById('symbol_tip');
        const guide    = document.getElementById('guideBtn');
        const app      = document.getElementById('androidApp');
        const appstore = document.getElementById('appstore');
        const markets  = document.getElementById('contract_markets').value;
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
    };

    const selectOption = (option, select) => {
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
    };

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

    let $chart;

    const updateWarmChart = () => {
        $chart = $chart || $('#trading_worm_chart');
        const spots =  Object.keys(Tick.spots()).sort((a, b) => a - b).map(v => Tick.spots()[v]);
        if ($chart && typeof $chart.sparkline === 'function') {
            $chart.sparkline(spots, chart_config);
            if (spots.length) {
                $chart.show();
            } else {
                $chart.hide();
            }
        }
    };

    const reloadPage = () => {
        Defaults.remove('market', 'underlying', 'formname',
            'date_start', 'expiry_type', 'expiry_date', 'expirt_time', 'duration_units', 'diration_value',
            'amount', 'amount_type', 'currency', 'prediction');
        location.reload();
    };

    // ============= Functions used in /trading_beta =============

    const updatePurchaseStatus_Beta = (final_price, pnl, contract_status) => {
        final_price = String(final_price).replace(/,/g, '') * 1;
        pnl = String(pnl).replace(/,/g, '') * 1;
        $('#contract_purchase_heading').text(localize(contract_status));
        const payout  = document.getElementById('contract_purchase_payout');
        const cost    = document.getElementById('contract_purchase_cost');
        const profit  = document.getElementById('contract_purchase_profit');
        const currency = Client.get('currency');

        labelValue(cost, localize('Stake'), formatMoney(currency, Math.abs(pnl), 1));
        labelValue(payout, localize('Payout'), formatMoney(currency, final_price, 1));

        const isWin = (final_price > 0);
        $('#contract_purchase_profit_value').attr('class', (isWin ? 'profit' : 'loss'));
        labelValue(profit, isWin ? localize('Profit') : localize('Loss'),
            formatMoney(currency, isWin ? Math.round((final_price - pnl) * 100) / 100 : -Math.abs(pnl), 1));
    };

    const displayTooltip_Beta = (market, symbol) => {
        const tip     = document.getElementById('symbol_tip');
        const markets = document.getElementById('contract_markets').value;
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
    };

    const labelValue = (label_elem, label, value, no_currency) => {
        const currency = Client.get('currency');
        elementInnerHtml(label_elem, label);
        const value_elem = document.getElementById(`${label_elem.id}_value`);
        elementInnerHtml(value_elem, no_currency ? value : formatMoney(currency, value));
        value_elem.setAttribute('value', String(value).replace(/,/g, ''));
    };

    const timeIsValid = ($element) => {
        let end_date_value   = document.getElementById('expiry_date').getAttribute('data-value'),
            start_date_value = document.getElementById('date_start').value,
            end_time_value   = document.getElementById('expiry_time').value;
        const $invalid_time = $('#invalid-time');

        if ($element.attr('id') === $('#expiry_time') && end_time_value &&
            !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(end_time_value)) {
            $element.addClass('error-field');
            if ($invalid_time.length === 0) {
                $('#expiry_type_endtime').parent().append($('<p>', { class: 'error-msg', id: 'invalid-time', text: localize('Time is in the wrong format.') }));
            }
            return false;
        }

        $element.removeClass('error-field');
        $invalid_time.remove();

        end_date_value = end_date_value ? toISOFormat(Moment(end_date_value)) : toISOFormat(new Moment());
        start_date_value = start_date_value === 'now' ? Math.floor(window.time._i / 1000) : start_date_value;
        end_time_value = end_time_value || '23:59:59';

        if (Moment.utc(`${end_date_value} ${end_time_value}`).unix() <= start_date_value) {
            $element.addClass('error-field');
            if (!document.getElementById('end_time_validation')) {
                $('#expiry_type_endtime').append($('<p/>', { class: 'error-msg', id: 'end_time_validation', text: localize('End time must be after start time.') }));
            }
            return false;
        }

        $element.removeClass('error-field');
        $('#end_time_validation').remove();
        return true;
    };

    return {
        displayUnderlyings        : displayUnderlyings,
        generateUnderlyingOptions : generateUnderlyingOptions,
        getFormNameBarrierCategory: getFormNameBarrierCategory,
        contractTypeDisplayMapping: contractTypeDisplayMapping,
        showPriceOverlay          : () => { showHideOverlay('loading_container2', 'block'); },
        hidePriceOverlay          : () => { showHideOverlay('loading_container2', 'none'); },
        hideFormOverlay           : () => { showHideOverlay('loading_container3', 'none'); },
        showFormOverlay           : () => { showHideOverlay('loading_container3', 'block'); },
        hideOverlayContainer      : hideOverlayContainer,
        getContractCategoryTree   : getContractCategoryTree,
        resetPriceMovement        : resetPriceMovement,
        toggleActiveCatMenuElement: toggleActiveCatMenuElement,
        displayCommentPrice       : displayCommentPrice,
        debounce                  : debounce,
        getDefaultMarket          : getDefaultMarket,
        addEventListenerForm      : addEventListenerForm,
        submitForm                : submitForm,
        durationOrder             : duration => duration_order[duration],
        displayTooltip            : displayTooltip,
        selectOption              : selectOption,
        updateWarmChart           : updateWarmChart,
        reloadPage                : reloadPage,
        displayContractForms      : displayContractForms,
        displayMarkets            : displayMarkets,
        updatePurchaseStatus_Beta : updatePurchaseStatus_Beta,
        displayTooltip_Beta       : displayTooltip_Beta,
        labelValue                : labelValue,
        timeIsValid               : timeIsValid,
        clean                     : () => { $chart = null; },
    };
})();

module.exports = commonTrading;
