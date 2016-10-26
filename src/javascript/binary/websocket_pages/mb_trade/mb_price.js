/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 */

var MBPrice = (function() {
    'use strict';

    var prices = {},
        req_id = 0;

    var display = function() {
    };

    var updatePrice = function(id, barrier, buy_price, sell_price) {
        var $priceRow = $('#' + id);
        if (!$priceRow.length) return;
        $priceRow.find('.barrier').text(barrier);
        $priceRow.find('.buy-price').text(buy_price);
        $priceRow.find('.sell-price').text(sell_price);
    };

    var getPriceTemplate = function(id, barrier, buy_price, sell_price) {
        return '<div id="' + id + '" class="gr-row price-row">' +
                '<div class="gr-4 barrier">' + barrier + '</div>' +
                '<div class="gr-4 buy-price"><button class="price-button">' + buy_price  + '<span class="dynamics"></span></button></div>' +
                '<div class="gr-4 sell-price"><span class="price-wrapper">' + sell_price + '<span class="dynamics"></span></span></div>' +
            '</div>';
    };

    var cleanup = function() {
        $('.prices-wrapper .price-row').html('');
    };

    return {
        display      : display,
        getReqId     : function() { return req_id; },
        increaseReqId: function() { req_id++; },
    };
})();

module.exports = {
    MBPrice: MBPrice,
};
