var TermsAndConditions = (function() {
    var init = function() {
        var selected_tab = page.url.params_hash().selected_tab;
        if(selected_tab) {
          $('li#' + selected_tab + ' a').click();
        }
        var year = document.getElementsByClassName('currentYear');
        for (var i = 0; i < year.length; i++){
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
