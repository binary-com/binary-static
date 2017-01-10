const url = require('../base/url').url;

const TermsAndConditions = (function() {
    const init = function() {
        const selected_tab = url.params_hash().selected_tab;
        if (selected_tab) {
            $('li#' + selected_tab + ' a').click();
        }
        const year = document.getElementsByClassName('currentYear');
        for (let i = 0; i < year.length; i++) {
            year[i].innerHTML = new Date().getFullYear();
        }
    };

    return {
        init: init,
    };
})();

module.exports = {
    TermsAndConditions: TermsAndConditions,
};
