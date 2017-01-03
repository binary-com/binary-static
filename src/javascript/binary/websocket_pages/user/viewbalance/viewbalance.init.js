const ViewBalance = (function() {
    const init = function() {
        BinarySocket.init(1);
    };

    return {
        init: init,
    };
})();

module.exports = {
    ViewBalance: ViewBalance,
};
