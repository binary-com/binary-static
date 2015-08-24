/*
 * Offerings object parses the offerings json that we get from socket.send({offerings: {hierachy :1 ...}}
 * and outputs in usable form, like it gives markets, submarkets, underlyings, contractForms
 *
 *
 * Usage:
 *
 * use `Offerings.details` to populate this object first
 *
 * then use
 *
 * `Offerings.markets` to get markets like Forex, Random etc
 * `Offerings.contractForms` like risefall, higherlower
 *
 */
var Offerings = (function () {
    'use strict';

    var tradeMarkets, tradeSubmarkets, tradeUnderlyings, tradeContractForms, responseData, form, barrier;

    var details = function (data, market, formName, barrierCategory, submarket, underlying) {
        responseData = data;
        var selectors = data.offerings.selectors;
        var offerings = data.offerings.offerings;

        var submarketElements = {}, underlyingElements = {}, contractCategories = {};

        submarketElements['all'] = 'All';

        var formBarrier = getFormNameBarrierCategory(formName);
        form = formName = formBarrier['formName'];
        barrier = barrierCategory = formBarrier['barrierCategory'];

        market_label:
        for (var i = 0, offlen = offerings.length; i < offlen; i++) {
            market = market || 'Forex';
            var mkt = offerings[i].market;
            if (mkt === market) {
                submarket_label:
                for(var j = 0, sbmktlen = offerings[i].available.length; j < sbmktlen; j++) {
                    var loop_submarket = offerings[i].available[j].submarket;
                    if (submarket && submarket !== loop_submarket) {
                        continue submarket_label;
                    }
                    underlying_label:
                    for (var k = 0, undrlylen = offerings[i].available[j].available.length; k < undrlylen; k++) {
                        var loop_underlying = offerings[i].available[j].available[k];
                        if(underlying && underlying !== loop_underlying.symbol) {
                            continue underlying_label;
                        }
                        for (var l = 0, ctcategorylen = offerings[i].available[j].available[k].available.length; l < ctcategorylen; l++) {
                            var contractCategory = offerings[i].available[j].available[k].available[l].contract_category, isBarrierUndefinedRequired = false;

                            for (var m = 0, ctcategoryavalen = offerings[i].available[j].available[k].available[l].available.length; m < ctcategoryavalen; m++) {

                                for (var property in  offerings[i].available[j].available[k].available[l].available[m]) {
                                    if (offerings[i].available[j].available[k].available[l].available[m].hasOwnProperty(property)) {
                                        var prop_value = offerings[i].available[j].available[k].available[l].available[m][property];
                                        if (property === 'barrier_category') {
                                            if (!barrierCategory) {
                                                barrierCategory = prop_value;
                                                isBarrierUndefinedRequired = true;
                                            }
                                            if (contractCategory && !contractCategories.hasOwnProperty(contractCategory)) {
                                                if (contractCategory === 'callput') {
                                                    if( prop_value === 'euro_atm') {
                                                        contractCategories['risefall'] = 'risefall';
                                                    } else {
                                                        contractCategories['higherlower'] = 'higherlower';
                                                    }
                                                } else {
                                                    contractCategories[contractCategory] = contractCategory;
                                                }

                                            }
                                            if(formName === contractCategory && barrierCategory === prop_value) {
                                                var submarketId = loop_submarket.toLowerCase().replace(/ /g, '_');
                                                submarketElements[submarketId] = loop_submarket;
                                                underlyingElements[loop_underlying.symbol] = {
                                                    display: loop_underlying.symbol_display,
                                                    classname: submarketId
                                                };
                                            }
                                            if (isBarrierUndefinedRequired) {
                                                barrierCategory = undefined;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if(underlying && underlying === loop_underlying.symbol) {
                            break underlying_label;
                        }
                    }
                    if (submarket && submarket === loop_submarket) {
                        break submarket_label;
                    }
                }
                break market_label;
            } else {
                continue;
            }
        }
        tradeMarkets = Object.keys(selectors.market);
        tradeContractForms = contractCategories;
        tradeSubmarkets = submarketElements;
        tradeUnderlyings = underlyingElements;
    };

    var getOfferings = function(){
        TradeSocket.send({offerings: {contracts: 0}});
    }

    return {
        details: details,
        offerings: function () { return responseData; },
        markets: function () { return tradeMarkets; },
        submarkets: function () { return tradeSubmarkets; },
        underlyings: function () { return tradeUnderlyings; },
        contractForms: function () { return tradeContractForms; },
        getOfferings: getOfferings,
        form: function (name) {
            if (name) {
                form = getFormNameBarrierCategory(name);
                barrier(form['barrier']);
                form = form['formName'];
            }
            return form;
        },
        barrier: function (name) {
            if (name) {
                barrier = name;
            }
            return barrier;
        }
    };

})();
