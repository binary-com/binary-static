export const getSelectedTime = (
    server_time,
    selected_time,
    market_open_time,
) => {
    const value = selected_time.isBefore(market_open_time)
        ? market_open_time.isBefore(server_time)
            ? server_time
            : market_open_time
        : selected_time;

    return value.format('HH:mm');
};

export const getBoundaries = (
    selected_time,
    server_time,
    market_open_time,
    market_close_time,
) => {
    const boundaries = {
        start: selected_time.isBefore(market_open_time)
            ? market_open_time.isBefore(server_time)
                ? server_time
                : market_open_time
            : selected_time,
        end: market_close_time,
    };

    return boundaries;
};
