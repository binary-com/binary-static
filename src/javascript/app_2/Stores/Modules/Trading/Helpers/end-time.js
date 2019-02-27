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

    value.minute(Math.round(value.minute() / 5) * 5);
    return value.format('HH:mm');
};

export const getBoundaries = (
    server_time,
    market_open_time,
    market_close_time,
) => {
    const boundaries = {
        start: server_time.isBefore(market_open_time)
            ? market_open_time
            : server_time,
        end: market_close_time,
    };

    boundaries.start.minute(Math.round(boundaries.start.minute() / 5) * 5);
    return boundaries;
};
