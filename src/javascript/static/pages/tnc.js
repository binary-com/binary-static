const sidebar     = require('../../_common/sidebar');
const localize    = require('../../_common/localize').localize;
const TNCApproval = require('../../app/pages/user/tnc_approval');

const TermsAndConditions = (() => {
    const onLoad = () => {
        TNCApproval.requiresTNCApproval(
            $('#btn_accept'),
            () => { $('.tnc_accept').setVisibility(1); },
            () => { $('#tnc_accept').html(localize('Your settings have been updated successfully.')); });
        sidebar.initSidebar();

        $('.currentYear').text(new Date().getFullYear());
    };

    const onUnload = () => {
        $('.sidebar-collapsible a').off('click');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = TermsAndConditions;
