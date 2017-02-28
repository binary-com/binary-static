const email_rot13 = require('../common_functions/common_functions').email_rot13;

const Careers = (function() {
    const onLoad = function() {
        $('#hr_contact_eaddress').html(email_rot13('<n uers=\"znvygb:ue@ovanel.pbz\" ery=\"absbyybj\">ue@ovanel.pbz</n>'));
    };
    return {
        onLoad: onLoad,
    };
})();

module.exports = Careers;
