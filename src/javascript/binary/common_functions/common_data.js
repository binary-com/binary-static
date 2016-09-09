var CommonData = {
    getLoginToken: function() { return Cookies.get('login'); }
};

module.exports = {
    CommonData: CommonData,
};
