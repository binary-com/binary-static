Object.defineProperties(TradeSocket,{
	getContracts:{
		value:function(underlying){
			var params = { contracts_for: { symbol: underlying, region: 'japan' } }
			this.send(params);
		}
	},
	getOfferings:{
		value:function(underlying){
			var params = { 
				offerings: { hierarchy: 1,
				contract: 0,
				market: 'forex',
				submarket: 'Major Pairs',
				start_type: 'spot' }
        	}
			this.send(params);
		}
	}
})