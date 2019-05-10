const TradingDuration = (() => {
    let market_columns;

    const getTradingDurationData = (trading_duration_asset) => {
        // get market columns array objects
        market_columns = trading_duration_asset.trading_durations
            .map(trading_duration => trading_duration.market);

        // filter to get unique values, appending to market columns
        market_columns = Object.values(market_columns.reduce((accumulator, current_market) =>
            Object.assign(accumulator, { [current_market.display_name]: current_market  }), {}));
        
        return trading_duration_asset.trading_durations;
    };

    const getTradingDurationSymbol = (trading_duration_asset, market, symbol) => {
        let trading_duration_symbol = [];

        trading_duration_asset.trading_durations.map((duration_data) => {
            if (duration_data.market.name === market) {
                duration_data.data.map((data) => {
                    if (data.symbol.some((data_symbol) => data_symbol.name === symbol)) {
                        trading_duration_symbol = data.trade_durations;
                    }
                });
            }
        });

        return trading_duration_symbol;
    };

    return {
        getTradingDurationData,
        getMarketColumns: () => market_columns,
        getTradingDurationSymbol,
    };
})();

module.exports = TradingDuration;
