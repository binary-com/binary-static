export const getSelectedTime = (
    server_time,
    selected_time,
    market_open_time,
) => {
    const boundaries = selected_time.isBefore(market_open_time)
        ? market_open_time.isBefore(server_time)
            ? server_time.add(5, 'minute')
            : market_open_time.add(5, 'minute')
        : selected_time;

    return boundaries.format('HH:mm');
};

export const getBoundaries = (
    server_time,
    market_open_time,
    market_close_time,
) => {
    const boundaries = {
        min: server_time.isBefore(market_open_time)
            ? market_open_time
            : server_time,
        max: market_close_time,
    };
    return boundaries;
};
