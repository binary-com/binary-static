var ViewBalance = (function() {
    function init() {
        BinarySocket.init(1);
    }

    return {
        init: init,
    };
})();

module.exports = {
    ViewBalance: ViewBalance,
};
