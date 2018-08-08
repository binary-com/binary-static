export const symbolChange = (onSymbolChange) => (
    onSymbolChange &&
    ((symbol_obj) => {
        onSymbolChange({
            target: {
                name : 'symbol',
                value: symbol_obj.symbol,
            },
        });
    })
);
