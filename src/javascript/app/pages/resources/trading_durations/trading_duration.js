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

    return {
        getTradingDurationData,
        getMarketColumns: () => market_columns,
    };
})();

module.exports = TradingDuration;
