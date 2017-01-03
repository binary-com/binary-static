const email_rot13 = require('../common_functions/common_functions').email_rot13;

const Careers = (function() {
    const display_career_email = function() {
        $('#hr_contact_eaddress').html(email_rot13('<n uers=\"znvygb:ue@ovanel.pbz\" ery=\"absbyybj\">ue@ovanel.pbz</n>'));
    };
    return {
        display_career_email: display_career_email,
    };
})();

module.exports = {
    Careers: Careers,
};
