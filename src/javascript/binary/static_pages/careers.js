const emailRot13 = require('../common_functions/common_functions').emailRot13;

const Careers = (function() {
    const onLoad = function() {
        $('#hr_contact_eaddress').html(emailRot13('<n uers=\"znvygb:ue@ovanel.pbz\" ery=\"absbyybj\">ue@ovanel.pbz</n>'));
    };
    return {
        onLoad: onLoad,
    };
})();

module.exports = Careers;
