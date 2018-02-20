const sidebar     = require('../../app/common/sidebar');
const localize    = require('../../_common/localize').localize;
const TNCApproval = require('../../app/pages/user/tnc_approval');

const TermsAndConditions = (() => {
    const onLoad = () => {
        TNCApproval.requiresTNCApproval(
            $('#btn_accept'),
            () => { $('.tnc_accept').setVisibility(1); },
            () => { $('#tnc_accept').html(localize('Your settings have been updated successfully.')); });
        sidebar.init();

        $('.currentYear').text(new Date().getFullYear());
    };

    const onUnload = () => {
        sidebar.clean();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = TermsAndConditions;
