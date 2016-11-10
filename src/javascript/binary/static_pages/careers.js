var CommonFunctions = require('../common_functions/common_functions').CommonFunctions;

var Careers = (function() {
    var display_career_email = function() {
        $("#hr_contact_eaddress").html(CommonFunctions.email_rot13("<n uers=\"znvygb:ue@ovanel.pbz\" ery=\"absbyybj\">ue@ovanel.pbz</n>"));
    };
    return {
        display_career_email: display_career_email,
    };
})();

module.exports = {
    Careers: Careers,
};
