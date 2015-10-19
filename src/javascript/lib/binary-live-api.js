
'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var LiveEvents = (function() {
    function LiveEvents() {
        _classCallCheck(this, LiveEvents);
        this.messageHandlers = {};
    }
    LiveEvents.prototype.emitSingle = function emitSingle(msgType, msgData) {
        (this.messageHandlers[msgType] || []).forEach(function(handler) {
            handler(msgData);
        });
    };
    LiveEvents.prototype.emitWildcard = function emitWildcard(msgData) {
		(this.messageHandlers['*'] || []).forEach(function(handler) {
            handler(msgData);
        });
    };
    LiveEvents.prototype.emit = function emit(msgType, msgData) {
        this.emitSingle(msgType, msgData);
        this.emitWildcard(msgData);
    };
    LiveEvents.prototype.on = function on(msgType, callback) {
        if (!this.messageHandlers[msgType]) {
            this.messageHandlers[msgType] = [callback];
        } else {
            this.messageHandlers[msgType].push(callback);
        }
    };
    return LiveEvents;
})();
var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};
var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        'default': obj
    };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var apiUrl = 'wss://www.binary.com/websockets/v2';
var noSubscriptions = function noSubscriptions() {
    return {
        ticks: {},
        portfolio: false,
        priceProposal: null
    };
};
var LiveApi = (function() {
    _createClass(LiveApi, null, [{
        key: 'Status',
        value: {
            Unknown: 'unknown',
            Connected: 'connected'
        },
        enumerable: true
    }]);

    function LiveApi() {
        _classCallCheck(this, LiveApi);
        this.status = LiveApi.Status.Unknown;
        this.subscriptions = noSubscriptions();
        this.bufferedSends = [];
        this.bufferedExecutes = [];
        this.unresolvedPromises = {};
        this.events = new LiveEvents();
        this.connect();
    }
    LiveApi.prototype.connect = function connect() {
        this.socket = new WebSocket(apiUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    };
    LiveApi.prototype.isReady = function isReady() {
        return this.socket && this.socket.readyState === 1;
    };
    LiveApi.prototype.sendBufferedSends = function sendBufferedSends() {
        while (this.bufferedSends.length > 0) {
            this.socket.send(JSON.stringify(this.bufferedSends.shift()));
        }
    };
    LiveApi.prototype.executeBufferedExecutes = function executeBufferedExecutes() {
        while (this.bufferedExecutes.length > 0) {
            this.bufferedExecutes.shift()();
        }
    };
    LiveApi.prototype.onOpen = function onOpen() {
        this.sendBufferedSends();
        this.executeBufferedExecutes();
    };
    LiveApi.prototype.onClose = function onClose() {
        setTimeout((function() {
            this.connect();
            this.resubscribe();
        }).bind(this), 1000);
    };
    LiveApi.prototype.onError = function onError(error) {
        console.log(error);
    };
    LiveApi.prototype.onMessage = function onMessage(message) {
        var json = JSON.parse(message.data);
        this.events.emit(json.msg_type, json);
        if (!json.echo_req.passthrough || !json.echo_req.passthrough.uid) {
            return;
        }
        var promise = this.unresolvedPromises[json.echo_req.passthrough.uid];
        if (promise) {
            delete this.unresolvedPromises[json.echo_req.passthrough.uid];
            if (!json.error) {
                promise.resolve(json);
            } else {
                promise.reject(json.error);
            }
        }
    };
    LiveApi.prototype.sendRaw = function sendRaw(data) {
        var _this = this;
        if (this.isReady()) {
            this.socket.send(JSON.stringify(data));
        } else {
            this.bufferedSends.push(data);
        }
        var promise = new Promise(function(resolve, reject) {
            _this.unresolvedPromises[data.uid] = {
                resolve: resolve,
                reject: reject
            };
        });
        return promise;
    };
    LiveApi.prototype.send = function send(data) {
        data.passthrough = {
            uid: (Math.random() * 1e17).toString()
        };
        return this.sendRaw(data);
    };
    LiveApi.prototype.execute = function execute(func) {
        if (this.isReady()) {
            func();
        } else {
            this.bufferedExecutes.push(func);
        }
    };
    LiveApi.prototype.resubscribe = function resubscribe() {
        var _subscriptions = this.subscriptions;
        var ticks = _subscriptions.ticks;
        var portfolio = _subscriptions.portfolio;
        var priceProposal = _subscriptions.priceProposal;
        this.subscribeToTicks(Object.keys(ticks));
        if (portfolio) {
            this.getPortfolio(true);
        }
        if (priceProposal) {
            this.getPriceForContractProposal(priceProposal);
        }
    };
    LiveApi.prototype.getTickHistory = function getTickHistory(symbol) {
        var tickHistoryOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        return this.send(_extends({
            ticks: symbol
        }, tickHistoryOptions));
    };
    LiveApi.prototype.getActiveSymbolsBrief = function getActiveSymbolsBrief() {
        return this.send({
            active_symbols: 'brief'
        });
    };
    LiveApi.prototype.getActiveSymbolsFull = function getActiveSymbolsFull() {
        return this.send({
            active_symbols: 'full'
        });
    };
    LiveApi.prototype.getContractsForSymbol = function getContractsForSymbol(symbol) {
        return this.send({
            contracts_for: symbol
        });
    };
    LiveApi.prototype.getPayoutCurrencies = function getPayoutCurrencies() {
        return this.send({
            payout_currencies: 1
        });
    };
    LiveApi.prototype.getTradingTimes = function getTradingTimes() {
        var date = arguments.length <= 0 || arguments[0] === undefined ? new Date() : arguments[0];
        var dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        return this.send({
            trading_times: dateStr
        });
    };
    LiveApi.prototype.ping = function ping() {
        return this.send({
            ping: 1
        });
    };
    LiveApi.prototype.getServerTime = function getServerTime() {
        return this.send({
            time: 1
        });
    };
    LiveApi.prototype.subscribeToTick = function subscribeToTick(symbol) {
        this.subscriptions.ticks[symbol] = true;
        this.send({
            ticks: symbol
        });
    };
    LiveApi.prototype.subscribeToTicks = function subscribeToTicks(symbols) {
        symbols.forEach(this.subscribeToTick.bind(this));
    };
    LiveApi.prototype.getPriceForContractProposal = function getPriceForContractProposal(contractProposal) {
        return this.send(_extends({
            proposal: 1
        }, contractProposal));
    };
    LiveApi.prototype.unsubscribeFromTick = function unsubscribeFromTick(symbol) {
        delete this.subscriptions.ticks[symbol];
        return this.send({
            forget: symbol
        });
    };
    LiveApi.prototype.unsubscribeFromTicks = function unsubscribeFromTicks(symbols) {
        symbols.forEach(this.unsubscribeFromTick);
    };
    LiveApi.prototype.unsubscribeFromAllTicks = function unsubscribeFromAllTicks() {
        this.subscriptions.ticks[symbol] = {};
        return this.send({
            forget_all: "ticks"
        });
    };
    LiveApi.prototype.unsubscribeFromAllProposals = function unsubscribeFromAllProposals() {
        this.subscriptions.priceProposal = null;
        return this.send({
            forget_all: "proposal"
        });
    };
    LiveApi.prototype.unsubscribeFromAllPortfolios = function unsubscribeFromAllPortfolios() {
        this.subscriptions.portfolio = false;
        return this.send({
            forget_all: "portfolio"
        });
    };
    LiveApi.prototype.unsubscribeFromAlProposals = function unsubscribeFromAlProposals() {
        this.subscriptions = noSubscriptions();
        return this.send({
            forget_all: "proposal_open_contract"
        });
    };
    LiveApi.prototype.authorize = function authorize(token) {
        return this.send({
            authorize: token
        });
    };
    LiveApi.prototype.getBalance = function getBalance() {
        return this.send({
            balance: 1
        });
    };
    LiveApi.prototype.getStatement = function getStatement() {
        var statementOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return this.send(_extends({
            statement: 1
        }, statementOptions));
    };
    LiveApi.prototype.getPortfolio = function getPortfolio() {
        var subscribeToUpdates = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        if (subscribeToUpdates) {
            this.subscriptions.portfolio = true;
        }
        return this.send({
            portfolio: 1,
            spawn: +subscribeToUpdates
        });
    };
    LiveApi.prototype.getPriceForOpenContract = function getPriceForOpenContract(contractId) {
        return this.send({
            proposal_open_contract: 1,
            fmd_id: contractId
        });
    };
    LiveApi.prototype.buyContract = function buyContract(contractId, price) {
        return this.send({
            buy: contractId,
            price: price
        });
    };
    LiveApi.prototype.sellContract = function sellContract(contractId, price) {
        return this.send({
            sell: contractId,
            price: price
        });
    };
    return LiveApi;
})();