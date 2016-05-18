var TradePage = (function(){
	
	var trading_page = 0;

	var onLoad = function(){
		trading_page = 1;
		if(sessionStorage.getItem('currencies')){
			displayCurrencies();
		}		
		BinarySocket.init({
			onmessage: function(msg){
				Message.process(msg);
			},
			onclose: function(){
				processMarketUnderlying();
			}
		});
		Price.clearFormId();
		TradingEvents.init();
		Content.populate();
		
		if(sessionStorage.getItem('currencies')){
			displayCurrencies();
			Symbols.getSymbols(1);
		}
		else {
			BinarySocket.send({ payout_currencies: 1 });
		}
		
		if (document.getElementById('websocket_form')) {
		    addEventListenerForm();
		}

		// Walktrough Guide
		Guide.init({
			script : 'trading'
		});
	};

	var reload = function() {
		sessionStorage.removeItem('underlying');
		window.location.reload();
	};

	var onUnload = function(){
		trading_page = 0;
		forgetTradingStreams();
		BinarySocket.clear();
		Defaults.clear();
	};

	return {
		onLoad: onLoad,
		reload: reload,
		onUnload : onUnload,
		is_trading_page: function(){return trading_page;}
	};
})();