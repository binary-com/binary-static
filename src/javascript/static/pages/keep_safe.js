const BinarySocket = require('../../app/base/socket');
const isIndonesia  = require('../../app/common/country_base').isIndonesia;

const KeepSafe = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status').then(() => {
            $('.id-show').setVisibility(isIndonesia());
        });
    };

    return {
        onLoad,
    };
})();

module.exports = KeepSafe;
