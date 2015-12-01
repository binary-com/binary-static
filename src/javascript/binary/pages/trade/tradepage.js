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
	};

	var onUnload = function(){
		trading_page = 0;
		forgetTradingStreams();
		BinarySocket.clear();
	};

	return {
		onLoad: onLoad,
		onUnload : onUnload,
		is_trading_page: function(){return trading_page;}
	};
})();