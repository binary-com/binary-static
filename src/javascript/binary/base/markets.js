var Markets = function(markets, market_symbols) { 
    this.all = [];
    var market_count = markets.length;
    while(market_count--) {
        var market_name = markets[market_count];
        var market_config = market_symbols[market_name];
        var market_obj = new Market(market_name, market_config['label'], market_config['submarkets']);
        this.all.push(market_obj);

    }
};

Markets.prototype = {
    each: function(callback) {
        var market_count = this.all.length;
        while(market_count--) {
            callback.call(this.all[market_count]);
        }
    },
    by_symbol: function(symbol) {
        var market_count = this.all.length;
        while(market_count--) {
            var found = this.all[market_count].by_symbol(symbol);
            if(found) {
                return found;
            }
        }
    },
    get: function(name) {
        var market_count = this.all.length;
        while(market_count--) {
            if(this.all[market_count].name == name) {
                return this.all[market_count];
            }
        }
    }
};

var Market = function(name, display_name, submarkets) {
    this.name = name;
    this.display_name = display_name;
    this.submarkets = [];
    this.all_submarkets = [];
    var submarket_count = submarkets.length;
    while(submarket_count--) {
        var submarket = submarkets[submarket_count];
        var submarket_obj = new SubMarket(submarket['name'], submarket['label'], submarket['instruments']);
        this.submarkets.push(submarket_obj);
        this.all_submarkets.push(submarket_obj);
    }
};

Market.prototype = {
    translated_display_name: function() {
        return text.localize(this.display_name);
    },
    by_symbol: function(symbol) {
        var count = this.submarkets.length;
        while(count--) {
            found = this.submarkets[count].by_symbol(symbol);
            if(found) {
                found['market'] = this;
                return found;
            }
        }
    },
    each: function(callback) {
        var count = this.all_submarkets.length;
        while(count--) {
            callback.call(this.all_submarkets[count]);
        }
    },
    get: function(name) {
        if(name.toUpperCase() == 'ALL') {
            return this.all_submarkets;
        }

        var count = this.submarkets.length;
        while(count--) {
            if(this.submarkets[count].name == name) {
                return this.submarkets[count];
            }
        }
    }
};

function localizeName() {
    return text.localize(this.name);
}

var SubMarket = function(name, display_name, underlyings) {
    this.name = name;
    this.display_name = display_name;
    this.underlyings = [];
    var underlying_count = underlyings.length;
    while(underlying_count--) {
        var underlying = underlyings[underlying_count];
        var underlying_object = {
            name: underlying['label'],
            symbol: underlying['value'],
            translated_display_name: localizeName
        };
        this.underlyings.push(underlying_object);
    }
};

SubMarket.prototype = {
    translated_display_name: function() {
        return text.localize(this.display_name);
    },
    each: function(callback) {
        var underlying_count = this.underlyings.length;
        while(underlying_count--) {
            callback.call(this.underlyings[underlying_count]);
        }
    },
    by_symbol: function(symbol) {
        var underlying_count = this.underlyings.length;
        while(underlying_count--) {
            if(this.underlyings[underlying_count].symbol == symbol) {
                return { submarket: this, underlying: this.underlyings[underlying_count] };
            }
        }

        return;
    },
};
