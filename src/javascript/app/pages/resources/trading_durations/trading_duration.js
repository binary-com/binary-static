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

    const getTradeDurationAssets = (trade_duration) => {
        const asset_array = [];
        const duration_type_array = ['ticks', 's', 'm', 'h', 'days'];

        asset_array.push(trade_duration.trade_type.display_name);
        duration_type_array.forEach((type) => {
            if (trade_duration.durations.some((duration) => duration.name === type)) {
                const duration_min = trade_duration.durations.find((unit) => unit.name === type).min;
                const duration_max = trade_duration.durations.find((unit) => unit.name === type).max;
                asset_array.push(`${duration_min} - ${duration_max}`);
            } else {
                asset_array.push('-');
            }
        });

        return asset_array;
    };

    return {
        getTradingDurationData,
        getMarketColumns: () => market_columns,
        getTradingDurationSymbol,
        getTradeDurationAssets,
    };
})();

module.exports = TradingDuration;
