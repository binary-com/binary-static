const makeCacheGroup = (name, priority, ...matches) => ({
    [name]: {
        name,
        priority,
        chunks : 'initial',
        enforce: true,
        test   : new RegExp(`^${matches.map(m => `(?=.*${m})`).join('')}`),
    },
});

module.exports = {
    makeCacheGroup,
};
