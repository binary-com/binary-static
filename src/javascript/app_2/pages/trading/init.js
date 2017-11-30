const State = require('../../../_common/storage').State;

const Trading = (() => {
    const onLoad = () => {
        State.set('is_trading_2', true);
    };

    const onUnload = () => {
        State.remove('is_trading_2');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Trading;
